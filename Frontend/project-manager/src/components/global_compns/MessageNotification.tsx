"use client"
import { useChatMsgContext } from "@/contexts/ChatMsgContext"
import { fetchUserProfile_client } from "@/lib/fetchData.client";
import { getNameInitials, selectRandomBg } from "@/utils/nameInitials";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuChevronRight, LuX } from "react-icons/lu";


const MessageNotification = () => {
    const { msg } = useChatMsgContext();
    const [visible, setVisible] = useState<boolean>(true);
    const [senderName, setSenderName] = useState<string>("");

    const notificationRef = useRef<HTMLAudioElement | null>(null);

    if (typeof window !== "undefined") {
        notificationRef.current = new Audio("/sounds/notification_web.mp3");
    }

    useEffect(() => {
        const initializeNotification = async () => {
            if (msg !== null) {
                // n = true (get name only)
                const res = await fetchUserProfile_client(msg.senderID, "1");
                if (!res) {
                    return;
                } else {
                    setSenderName(res.profileData.fullname || "Unknown");
                    setVisible(true);

                    if (notificationRef.current) {
                        notificationRef.current.play().catch((error) => {
                            console.log("User hasn't interacted with the page yet.");
                        });
                    }

                    // Notification Only Visible For 5 Seconds
                    setTimeout(() => {
                        setVisible(false)
                    }, 5000);
                }
            } else {
                return;
            }
        }
        initializeNotification();
    }, [msg]);

    return (
        visible && msg &&
        <dialog
            className="fixed z-50 top-4 right-[2%] left-auto shadow-xl bg-ui-secondary rounded-lg shadow-ui-main flex flex-row items-center w-[20rem] px-4 py-1 h-[4.5rem] border-l-3 border-buttons/80 animate-fade-in-pop"
        >
            <div className={`w-10 h-10 ${selectRandomBg(senderName)} rounded-full flex items-center justify-center text-texts-primary font-bold text-sm mr-4`}>
                {getNameInitials(senderName)}
            </div>
            <div className="text-left text-texts-primary mb-1 mr-4">
                <h6>{senderName.slice(0, 20)}</h6>
                <p className="text-texts-secondary text-xs">{msg?.text.slice(0, 35)}{msg.text.length >= 35 ? "..." : ""}</p>
            </div>
            <span className="ml-auto relative flex flex-col items-end h-full py-1 justify-end">
                <LuX size={12} className="absolute text-texts-secondary top-1.5 right-0 cursor-pointer hover:text-texts-primary" onClick={() => setVisible(false)} />
                <Link href={`/chats?c_id=${msg.chatID}`} className="text-xs text-buttons/90 font-semibold border-b border-buttons hover:text-texts-primary/80 hover:border-texts-primary/80 transition-colors duration-150 cursor-pointer">
                    View <LuChevronRight size={11} className="inline" />
                </Link>
            </span>
        </dialog>
    )
}

export default MessageNotification;