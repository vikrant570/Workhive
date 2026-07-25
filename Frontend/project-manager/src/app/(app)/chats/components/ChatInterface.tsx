"use client";
import React, { useState, useEffect, useRef, useLayoutEffect, Suspense, useCallback } from "react";
// ICONS
import { FaPaperclip } from "react-icons/fa6";
import { IoMdMore, IoIosSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";
// COMPONENTS
import Message from "./Message";
// API(s)
import { useUserContext } from "@/contexts/UserContext";
import api from "@/lib/axios";
import { sendMessage } from "@/ctaApiLogics/chatGateway";
import ProjectInviteCard from "./ProjectInviteCard";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import handleError from "@/utils/handleError";
import { LuRefreshCcw } from "react-icons/lu";

// Type definition for a single message
interface Res {
  success: boolean,
  messages: Array<any>,
  hasMore?: boolean
}
interface Msg {
  _id: string,
  senderID: string,
  chatID: string,
  text: string,
  delivered: boolean,
  createdAt: string
}

interface ProjectInvite extends Msg {
  project: {
    _id: string,
    title: string
  },
  inviteStatus: 'Accepted' | 'Rejected' | 'Expired' | 'Pending'

}

interface ChatProps {
  chatID: string;
  chatName: string;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInteraction: React.Dispatch<React.SetStateAction<Msg | null>>;
  interaction: Msg | null;
}

const ChatInterface: React.FC<ChatProps> = ({ chatID, chatName, setChatOpen, setInteraction, interaction }) => {
  // Sending Message States
  const [sending, setSending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Main Messaging States
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Context Elements
  const { user } = useUserContext();
  const { showToastMsg } = useToastMsgContext();

  const [error, setError] = useState<string>("");

  // Element References
  const mainContainerRef = useRef<HTMLElement | null>(null);
  const messagesTopRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Logical References
  const prevMessagesHeight = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);
  const hasMoreRef = useRef<boolean>(hasMore);
  const loadingRef = useRef<boolean>(loading);

  // Syncing References With States
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  // Top Most Message Pointer
  const [cursor, setCursor] = useState<string>("")

  // Message Fetching Function
  const fetchMessages = useCallback(async (cursor: string) => {
    if (isFirstLoad.current) isFirstLoad.current = false;
    try {
      setLoading(true);
      const res = await api.get(`/chats/${chatID}?cursor=${cursor}`, { withCredentials: true });

      if (!res.data.success && res.data.message == "Chat Doesn't Exist!") return;
      const msgs = (res.data as Res).messages;
      console.log(msgs);

      setMessages((prev) => [...msgs, ...prev]);
      setHasMore(res.data.hasMore)

      // Setting The Cursor To The TopMost Message
      if (msgs.length > 0) setCursor((msgs[0] as Msg)?._id);

      messagesEndRef.current?.scrollTo({ behavior: "smooth" });
    }
    catch (err) {
      setError(handleError(err, "axios") as string);
    }
    finally {
      setLoading(false);
      return;
    }
  }, [chatID])


  //Oberver - Triggering Fetch
  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loadingRef.current && hasMoreRef.current) {
        prevMessagesHeight.current = mainContainerRef!.current!.scrollHeight;
        fetchMessages(cursor);
      }
    }, {
      root: mainContainerRef.current,
      threshold: 0
    });

    if (messagesTopRef.current)
      observer.observe(messagesTopRef?.current);

    return () => { observer.disconnect() }
  }, [chatID, cursor]);

  // For Preserving The Position Of The Screen
  useLayoutEffect(() => {
    if (mainContainerRef.current && !isFirstLoad.current) {
      const scrollHeightDifference = mainContainerRef.current.scrollHeight - prevMessagesHeight.current;
      mainContainerRef.current.scrollTop = scrollHeightDifference;
    }
  }, [messages]);

  // Reset Everything When Switching Between Chats
  useEffect(() => {
    isFirstLoad.current == true;
    setMessages([]);
    setCursor("");
    setHasMore(true);
    prevMessagesHeight.current = 0;
  }, [chatName, chatID]);

  //Listening For New Messages -> MsgNotificationContext
  useEffect(() => {
    if (!interaction) return;
    setMessages((prev) => {
      const exists = messages[prev.length - 1];
      return (exists?._id !== interaction?._id ? [...prev, interaction] : prev)
    });
  }, [interaction]);

  // Sending a message
  const handleSendMessage = useCallback(async (inputValue: string) => {
    setSending(true);
    const res = await sendMessage(chatID, inputValue!.trim());

    if (!res.success) {
      showToastMsg({ text: "Failed to send message!", type: "error" });
      return;
    }

    else {
      const messageSent: Msg = {
        _id: res._id,
        text: String(inputValue),
        chatID: chatID,
        senderID: String(user?._id),
        createdAt: new Date().toISOString(),
        delivered: true
      }

      setInteraction(messageSent);
      setMessages((prev) => [...prev, messageSent]);

      setInputValue(null);
    }
    setSending(false);
  }, [chatID])

  if (error !== "") {
    return (
      <div className="w-3xl mx-0 border-ui-tertiary/40 h-full py-10 px-3">
        <div className="max-w-10/12 rounded-3xl shadow-xs shadow-texts-important/ text-center">
          <h1 className="text-xl text-texts-primary font-bold "> Ooops ! </h1>
          <p className="text-sm text-alerts mb-2">{error}</p>
          <button
            onClick={() => {
              setError("");
              fetchMessages(cursor);
            }}
            className="text-mdflex items-center justify-center gap-2 px-6 py-3 bg-buttons text-ui-main rounded-xl font-bold hover:bg-buttons/90 hover:scale-105 transition-all shadow-lg shadow-buttons/20 active:scale-95"
          >
            <LuRefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen text-texts-primary font-sans w-3xl mx-0 shadow-2xl border-r border-ui-tertiary/40" id="chat-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-ui-secondary sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-buttons/70 flex items-center justify-center font-bold text-white text-sm">
              {chatName[0]}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-ui-tertiary/15 rounded-full"></div>
          </div>
          <div>
            <h2 className="font-semibold text-sm">{chatName}</h2>
            <p className="text-xs text-green-400 font-medium tracking-wide">
              {/* Will add the online/offline logic later */}
              ONLINE
            </p>
          </div>
        </div>

        <span>
          <button className="p-2 hover:bg-ui-tertiary/60 rounded-full transition-colors text-texts-primary cursor-pointer">
            <IoMdMore size={18} />
          </button>
          <button className="p-2 hover:bg-ui-tertiary/60 rounded-full transition-colors text-texts-primary cursor-pointer" onClick={() => { setChatOpen(false) }}>
            <RxCross2 size={18} />
          </button>
        </span>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4" ref={mainContainerRef}>
        {loading ? <CgSpinner size={25} className="m-auto mt-10 animate-spin" /> : <></>}
        <div ref={messagesTopRef} />

        <Suspense fallback={
          <div className="bg-transparent h-1/2 w-auto m-0 text-center">
            <h1 className="mt-30 m-auto text-red-400">{error || "Something Went Wrong!\nPlease Try Again Later."}</h1>
          </div>
        }>

          {
            user && messages && messages.map(
              (msg, i) => (
                (msg as ProjectInvite)?.project?._id ?
                  <ProjectInviteCard invite={(msg as ProjectInvite)} userID={user._id} key={msg._id} /> :
                  <Message msg={msg} key={msg._id + String(i)} userID={user?._id} />
              )
            )
          }
        </Suspense>

        {/* Use insertAdjacentElement('beforebegin') for inserting new messages */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-ui-secondary">
        <div
          // onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-ui-main rounded-full px-4 py-2 focus-within:border-buttons/70 transition-all"
        >
          <button
            type="button"
            className="text-texts-secondary hover:text-buttons transition-colors cursor-pointer"
          >
            <FaPaperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue || ""}
            className="flex-1 bg-transparent border-none outline-none text-sm py-1 px-2 text-texts-primary placeholder:text-texts-secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
          />
          <button
            onClick={() => { inputValue && handleSendMessage(inputValue) }}
            disabled={!inputValue?.trim()}
            className={`p-2 rounded-full transition-all ${inputValue?.trim()
              ? "bg-buttons/70 text-white hover:bg-buttons/90 shadow-lg shadow-buttons/10 cursor-pointer"
              : "bg-ui-tertiary/20 text-texts-primary"
              }`}
          >
            <IoIosSend size={18} className={`${sending == true ? "text-ui-tertiary/50 bg-buttons/40" : ""}`} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;