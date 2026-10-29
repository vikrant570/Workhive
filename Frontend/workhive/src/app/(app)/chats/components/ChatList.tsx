"use client"
import { useUserContext } from "@/contexts/UserContext";
import { determineTimeStamp } from "@/utils/dateTimeFormatter";
import { getNameInitials, selectRandomBg } from "@/utils/nameInitials";
import { useState } from "react";

interface Participant {
  _id: string,
  fullname: string
}
export interface Chat {
  _id: string,
  participants: Participant[],
  lastMessage?: {
    sender: {
      _id: string,
      fullname: string,
    }
    text: string
  },
  chatType: "p2p" | "group",
  group?: {
    name: string,
    admin: string
  }
  updatedAt: Date,
  isBlocked: boolean,
  p2pKey: string,
  unread: Array<{
    user: string,
    count: boolean
  }>
}
interface Props {
  chat: Chat,
  setChatID: React.Dispatch<React.SetStateAction<string>>,
  setCurrentChat: React.Dispatch<React.SetStateAction<{ recipientKey: string, chatName: string } | null>>,
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>,
  chatID: string
}

const ChatListElement: React.FC<Props> = ({ chat, setChatID, setCurrentChat, setChatOpen, chatID }) => {
  const { user } = useUserContext();

  const [unreadCount, setUnreadCount] = useState<boolean>(chat.unread.find((u) => u.user === user?._id)?.count || false);

  const chatNaming = () => {
    if (chat.group) return chat?.group.name
    return chat.participants[0]?.fullname;
  }

  const lastMessage = () => {
    if (!chat?.lastMessage?.text) return "No messages yet";

    return (
      chat?.lastMessage?.text.length >= 45
        ? chat?.lastMessage?.text.slice(0, 45) + "..."
        : chat?.lastMessage?.text
    )
  }

  const chatName = chatNaming();
  const recipientKey = chat.chatType === "p2p" ? chat.participants[0]._id : chat._id;

  return (
    <div className={
      `${chat._id === chatID ? "bg-ui-tertiary/5" : "bg-buttons/5 hover:bg-texts-important/5"} 
            flex items-center p-3 rounded-lg cursor-pointer border-l-4 border-ui-tertiary/15 transition duration-150`}
      onClick={() => {
        setChatID(chat._id);
        setCurrentChat({ recipientKey: String(recipientKey), chatName: chatName });
        setChatOpen((prev) => chat._id === chatID && prev == true ? false : true);
        setUnreadCount(false)
      }}
    >
      <div
        className={`min-w-10 h-10 ${chat.chatType === "group" ? 'bg-ui-tertiary/70' : selectRandomBg(chatName)} rounded-full flex items-center justify-center text-texts-primary font-bold text-sm mr-3`}
      >
        {getNameInitials(chatName)}
      </div>

      <div className="flex-grow overflow-hidden">
        <p className="text-texts-primary font-semibold ">
          {chatName}
        </p>
        <p className="text-texts-secondary text-sm">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-10/12">
            {
              chat?.lastMessage &&
              <>
                <b>
                  {
                    user?._id && chat.lastMessage.sender._id == user?._id ? "You: " :
                      (chat.chatType == "p2p" ? "" : chat.lastMessage.sender.fullname.split(" ")[0] + ": ")
                  }
                </b>
                {lastMessage()}
              </> || <></>
            }
          </span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-max">
        <span className="text-xs text-ui-tertiary">
          {determineTimeStamp(String(chat?.updatedAt))}
        </span>
        {/* 054 - Count Changes When We Change Delivered(true/false) system. */}
        <span className={` ${unreadCount === true ? "bg-texts-important/90 text-texts-important/90 shadow-xs shadow-texts-important/90" : "bg-transparent text-transparent"} text-xs rounded-full px-1.5`}>
          .
        </span>
      </div>
    </div>
  )
}

export default ChatListElement