"use client";
import { Suspense, useEffect, useState } from "react";

//ICONS
import { LuMessagesSquare, LuLock, LuSearch } from "react-icons/lu";

// API
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

// COMPONENTS
import ChatInterface from "./components/ChatInterface";
import ChatListElement, { Chat } from "./components/ChatList";
import FullContentError from "@/components/global_compns/FullContentError";

import { useChatMsgContext } from "@/contexts/ChatMsgContext";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

import handleError from "@/utils/handleError";
import { createNewChat } from "@/ctaApiLogics/chatGateway";
import { CgSpinner } from "react-icons/cg";
import { useUserContext } from "@/contexts/UserContext";
import { AvatarColorPallete, EmptyChatPlaceholder } from "./components/Extras";

interface Res {
  success: boolean,
  chats: Array<Chat>;
}
export interface Msg {
  _id: string,
  senderID: string,
  chatID: string,
  text: string,
  delivered: boolean,
  createdAt: string,
}

const ChatsContent = () => {
  //will get from the cookie or compare using Oid
  const [chats, setChats] = useState<Array<Chat>>([]);
  const [chatID, setChatID] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<{ recipientKey: string, chatName: string } | null>(null);

  // Contexts
  const { msg, setCurrentlyOpened, messageSender } = useChatMsgContext();
  const { user } = useUserContext();
  const { showToastMsg } = useToastMsgContext();

  // For Refresh Sorting Of Chats on sending/receving message;
  // Interaction = Any Message Sent Or Received
  const [interaction, setInteraction] = useState<Msg | null>(null);

  // Previous Path - Navigation Purpose
  const prevPath = useSearchParams().get("from");
  const connectionId = useSearchParams().get("c_id");

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleErrorLocally = (err: any) => {
    const errToShow = (handleError(err, "axios") as string);
    showToastMsg({ text: errToShow, type: 'error' });
    setError(errToShow);
  }

  // --- If User Arriving From Any Indirect Route --- 
  const OpenChat = (chat: Chat) => {
    setChatID(chat?._id);

    const pickedChatName = chat.chatType === "group" ? chat.group?.name : chat.participants[0].fullname

    const recipientKey = chat.chatType === "p2p" ? chat.participants[0]._id : chat._id;
    setCurrentChat({ recipientKey: String(recipientKey), chatName: pickedChatName || "Unknown" })
    setChatOpen(true);
  }

  const IndirectChatOpen = async () => {
    const chat = (chats as Chat[]).find(chat => chat.p2pKey === [user?._id, connectionId].sort().join("_"))
    // Case 1 : User Doesn't Have Any Chat With This Connection
    if (!chat && connectionId) {
      try {
        const newChat: Chat = await createNewChat([connectionId]);
        setChats((prev) => [newChat, ...prev]);

        OpenChat(newChat);
      }
      catch (err) {
        handleErrorLocally(err);
      }
    } else if (chat) {
      // Case 2 : User Has Existing Chat With This Connection
      OpenChat(chat);
    }
  }

  //Initial fetch - All Chats
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await api.post('/chats', { withCredentials: true });
        const chatList = (response.data as Res);

        setChats(chatList.chats);
      }
      catch (err) {
        handleErrorLocally(err);
      }
    }
    fetchChatList();
  }, [])

  const sortChats = (message: Msg) => {
    const recentChat = chats?.find(c => c._id === message.chatID);

    if (recentChat) {
      const updated = {
        ...recentChat,
        lastMessage: { sender: { _id: message.senderID, fullname: "" }, text: message.text },
        updatedAt: new Date(),
        unread: recentChat.unread.map(u =>
          String(u.user) === String(user?._id) ? { ...u, count: true } : u
        )
      };

      setChats(prev => [updated!, ...(prev.filter(c => c._id !== message.chatID))]);
    }

    else if (!recentChat && messageSender && user) {
      // Creat a chat replica instantly if a message arrives from a newly created chat.
      const newChat: Chat = {
        _id: message.chatID,
        participants: [{ _id: message.senderID, fullname: messageSender.name }],
        lastMessage: { sender: { _id: message.senderID, fullname: "" }, text: message.text },
        unread: [{ user: user._id, count: true }],
        updatedAt: new Date(),
        chatType: 'p2p',
        isBlocked: false,
        p2pKey: [user._id, message.senderID].sort().join("_"),
      }
      setChats(prev => [newChat, ...prev]);
    }

    setInteraction(null);
  }

  useEffect(() => {
    if (connectionId && chats.length > 0) {
      IndirectChatOpen()
    }
  }, [chats])

  // Listening to msg and providing to components on arrival
  useEffect(() => {
    if (!msg || msg._id === undefined || chats?.length === 0) return;
    sortChats(msg);
    setInteraction(msg);
  }, [msg])

  useEffect(() => {
    if (!interaction || interaction._id === undefined || chats?.length === 0) return
    sortChats(interaction);
  }, [interaction])

  useEffect(() => {
    setCurrentlyOpened(chatOpen === true ? chatID : null);
    setChatID((prev) => chatOpen === false ? "" : prev);
  }, [chatOpen])

  if (error) {
    return <FullContentError page={"Chats"} error={error} setError={setError} />
  }

  return (
    <div id="container-inbox" className="max-w-screen overflow-hidden ml-50 flex flex-row">
      {/* LEFT COLUMN - Chat List */}
      <div className="w-xl overflow-hidden">
        {/* 054 - Back Button */}
        <div className="bg-ui-secondary shadow-lg p-4 h-screen flex flex-col border-x border-ui-tertiary/20">
          <h2 className="text-xl font-semibold mb-4 border-b border-ui-tertiary/20 pb-2">
            Recent Chats
          </h2>

          {/* <!-- Search Bar --> */}
          <div className="mb-4 relative flex flex-row  gap-3 items-center w-full bg-ui-main text-text-primary rounded-lg py-2 px-4 text-sm">
            <LuSearch className=" text-ui-tertiary inline" />
            <input
              type="text"
              placeholder="Search chats..."
              className="outline-none p-2 w-full"
            />
          </div>
          {/* Error Saftey Net For Chats ! */}
          <Suspense fallback={
            <CgSpinner size={25} className="m-auto mt-10 animate-spin" />
          }>
            <AvatarColorPallete />
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2">
              {
                chats.length > 0 && chats.map(chat => (
                  <ChatListElement key={chat._id} chat={chat} setChatID={setChatID} setCurrentChat={setCurrentChat} setChatOpen={setChatOpen} chatID={chatID} />
                ))
              }
            </div>
          </Suspense>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      {/* 054 - May require to pass the full chat later on */}
      {
        chatID !== "" && chatOpen ?
          <ChatInterface chatID={chatID} currentChat={currentChat} setChatOpen={setChatOpen} interaction={interaction} setInteraction={setInteraction} />
          : <EmptyChatPlaceholder fallback={"onlyMessages"} />
      }
    </div>
  );
};

export default function Chats() {
  return (
    <Suspense fallback={<EmptyChatPlaceholder fallback={"fullPage"} />}>
      <ChatsContent />
    </Suspense>
  )
};