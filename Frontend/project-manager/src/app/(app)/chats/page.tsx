"use client";
import { Suspense, useEffect, useRef, useState } from "react";

//ICONS
import { LuMessagesSquare, LuLock, LuSearch } from "react-icons/lu";

// API
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

// COMPONENTS
import ChatInterface from "./components/ChatInterface";
import ChatList from "./components/ChatList";
import FullContentError from "@/components/global_compns/FullContentError";

import { useChatMsgContext } from "@/contexts/ChatMsgContext";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

import handleError from "@/utils/handleError";
import { createNewChat } from "@/ctaApiLogics/chatGateway";
import { CgSpinner } from "react-icons/cg";

interface Chat {
  participants: Array<{ fullname: string, _id: string }>,
  groupName: string,
  _id: string
}
interface Res {
  success: boolean,
  chats: Array<any>;
}
interface Msg {
  _id: string,
  senderID: string,
  chatID: string,
  text: string,
  delivered: boolean,
  createdAt: string
}

const EmptyChatPlaceholder = ({ fallback }: { fallback: "fullPage" | "onlyMessages" }) => {
  return (
    <div className={`bg-ui-secondary border-r border-white/30 h-screen ${fallback === "fullPage" ? "w-full ml-55" : "w-3xl"} flex flex-col items-center justify-center relative`}>
      {/* Center Content */}
      <div className="flex flex-col items-center text-center max-w-sm px-6">
        <div className="w-24 h-24 bg-ui-main rounded-full flex items-center justify-center mb-6 shadow-lg shadow-buttons/10">
          <LuMessagesSquare size={44} className="text-buttons opacity-80" />
        </div>

        <h2 className="text-xl font-semibold text-texts-primary mb-2">
          WorkHive Workspace
        </h2>

        <p className="text-texts-secondary text-sm leading-relaxed">
          Select a conversation from the sidebar to start collaborating, or create a new project chat.
        </p>
      </div>

      {/* Bottom Security Note */}
      <div className="absolute bottom-8 flex items-center gap-1.5 text-texts-secondary/50 text-xs font-medium">
        <LuLock size={12} />
        <span>Secure, real-time collaboration</span>
      </div>

    </div>
  );
}

const ChatsContent = () => {
  //will get from the cookie or compare using Oid
  const [chats, setChats] = useState<Array<any>>([]);
  const [chatID, setChatID] = useState<string>("");
  const [chatName, setChatName] = useState<string>("");

  // Contexts
  const { msg } = useChatMsgContext();
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
    setChatName(chat?.groupName || chat?.participants[0].fullname);
    setChatOpen(true);
  }

  const IndirectChatOpen = async () => {
    const chat = (chats as Chat[]).find(
      chat => chat?.participants[0]?._id === connectionId
    );
    // Case 1 : User Doesn't Have Any Chat With This Connection
    if (!chat && connectionId) {
      try {
        const newChat: Chat = await createNewChat([connectionId], "0");
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

  //Get all the chats from database
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

    // Later On Upgrading For Group Chats Too 054
    if (connectionId && chats) {
      IndirectChatOpen()
    }
  }, []);

  // Listenin to msg and providing to components on arrival
  useEffect(() => {
    if (msg?._id !== "") setInteraction(msg);
  }, [msg]);

  if (error) {
    return <FullContentError page={"Chats"} error={error} />
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
            <ChatList chats={chats} setChatID={setChatID} setChatName={setChatName} setChatOpen={setChatOpen} chatID={chatID} interaction={interaction} />
          </Suspense>
        </div>
      </div>

      {/* RIGHT COLUMN */}

      {/* 054 - May require to pass the full chat later on */}
      {
        chatID !== "" && chatOpen ?
          <ChatInterface chatID={chatID} chatName={chatName} setChatOpen={setChatOpen} setInteraction={setInteraction} interaction={interaction} />
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