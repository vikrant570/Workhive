import { parseDate } from "@/utils/dateTimeFormatter";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface Message {
  _id: string,
  senderID: string,
  chatID: string,
  text: string,
  delivered: boolean,
  createdAt: string
}

interface MessageProps {
  msg: Message
  userID: string,
}

const Message: React.FC<MessageProps> = ({ msg, userID }) => {
  return (
    <div
      className={`flex ${msg.senderID === userID ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 relative shadow-sm ${msg.senderID === userID
          ? 'bg-buttons/60 text-white rounded-tr-none'
          : 'bg-ui-secondary text-slate-200 rounded-tl-none border border-slate-700'
          }`}
      >
        <p className="text-sm leading-relaxed">{msg.text}</p>
        <div className="flex items-center gap-1 mt-1 justify-end text-texts-primary/90">
          <span className="text-[10px] uppercase">{parseDate(new Date(msg.createdAt)).split(",")[1]}</span>
          {/* Needs final improvement while finalizing the process */}
          {
            msg.delivered &&
            msg.senderID == userID &&
            <IoCheckmarkDoneOutline size={12} />
          }
        </div>
      </div>
    </div>
  )
}

export default Message