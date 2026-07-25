"use client"
import { useUserContext } from "@/contexts/UserContext";
import { determineTimeStamp } from "@/utils/dateTimeFormatter";
import { getNameInitials, selectRandomBg } from "@/utils/nameInitials";
import { useEffect, useState } from "react";

interface Participant {
  _id: string,
  fullname: string
}
interface Chat {
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
  groupName?: string,
  updatedAt: Date,
  isBlocked: boolean
}
interface Msg {
  _id: string,
  senderID: string,
  chatID: string,
  text: string
}
interface Props {
  chats: Chat[],
  setChatID: React.Dispatch<React.SetStateAction<string>>,
  setChatName: React.Dispatch<React.SetStateAction<string>>,
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>,
  chatID: string,
  interaction: Msg | null
}

const ChatList: React.FC<Props> = ({ chats, setChatID, setChatName, setChatOpen, chatID, interaction }) => {
  const { user } = useUserContext();

  const [chatList, setChatList] = useState<Chat[]>();

  useEffect(() => {
    if (chats && chats.length != 0) {
      setChatList(chats)
    }
  }, [chats])

  const sortChats = (interaction: Props["interaction"]) => {
    if (!interaction) return;
    // Updating The Latest Interacted(Sent/Received) Only On UI Side 
    const interactedWith = chatList?.find(chat => chat._id == interaction.chatID);

    if (interactedWith) {
      interactedWith!.updatedAt = new Date();
      interactedWith!.lastMessage = {
        sender: {
          _id: interaction.senderID,
          fullname: interactedWith.lastMessage?.sender.fullname || ""
        },
        text: interaction.text
      };
    }

    const sortedChatList = chatList?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setChatList(sortedChatList);
  };

  // Helper Functions ---
  const chatNaming = (ps: Participant[]) => {
    return ps.find(p => p._id !== user?._id)?.fullname || "Unknown User";
  };

  // For Sorting Chats.
  useEffect(() => {
    // Only Triggering A Sort/Re-Render If The Chat Is Not Already At The Top.
    if (interaction && interaction.chatID !== "" && chatList?.[0]?._id !== interaction.chatID) {
      sortChats(interaction);
    }
  }, [interaction]);

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2">
      {/* <!-- Chat List Container --> */}
      {chatList && chatList.map((chat, i) => {
        return (
          <div className={
            `${chat._id === chatID ? "bg-ui-tertiary/5" : "bg-buttons/5 hover:bg-texts-important/5"} 
            flex items-center p-3 rounded-lg cursor-pointer border-l-4 border-ui-tertiary/15 transition duration-150`}
            onClick={() => {
              setChatID(chat._id);
              setChatName(chat?.groupName || chatNaming(chat?.participants));
              setChatOpen(false);
              setChatOpen(true);
            }}
            key={i}
          >
            {/* Colour Setup For Initials In The List*/}
            <>
              <div className="bg-indigo-500/70 hidden"></div>
              <div className="bg-buttons hidden"></div>
              <div className="bg-texts-important hidden"></div>
              <div className="bg-red-500 hidden"></div>
              <div className="bg-purple-500/80 hidden"></div>
              <div className="bg-yellow-500 hidden"></div>
              <div className="bg-alerts hidden"></div>
              <div className="bg-ui-tertiary hidden"></div>
            </>
            <div className={`w-10 h-10 ${chat.groupName ? 'bg-ui-tertiary/70' : selectRandomBg(chat.participants[0].fullname)}
             rounded-full flex items-center justify-center text-texts-primary font-bold text-sm mr-4`}>
              {
                // Showing initials of groupname or the contact's name
                chat?.groupName ?
                  chat?.groupName.slice(2) :
                  // If not a group then
                  getNameInitials(chatNaming(chat.participants))
              }
            </div>
            <div className="flex-grow">
              <p className="text-texts-primary font-semibold truncate">
                {
                  chat?.groupName ? chat?.groupName :
                    chatNaming(chat?.participants)
                }
              </p>
              <p className="text-texts-secondary text-sm truncate">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                  {
                    chat?.lastMessage &&
                    <>
                      <b>
                        {
                          user?._id && chat.lastMessage.sender._id == user?._id ? "You: " :
                            (chat.chatType == "p2p" ? "" : chat.lastMessage.sender.fullname)
                        }
                      </b>
                      {
                        chat?.lastMessage.text.length >= 45
                          ? chat?.lastMessage.text.slice(0, 45) + "..."
                          : chat?.lastMessage.text
                      }
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
              <span className="bg-texts-important/80 text-texts-primary text-xs rounded-full px-1">1</span>
            </div>
          </div>
        )
      })}

    </div>
  )
}

export default ChatList