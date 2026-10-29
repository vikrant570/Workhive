"use client"
import { useEffect, useState, createContext, useContext, SetStateAction } from 'react';
import { getSocket } from '@/ctaApiLogics/chatGateway';
import { useToastMsgContext } from './ToastMsgContext';

interface Msg {
    _id: string,
    text: string,
    senderID: string,
    chatID: string,
    delivered: boolean,
    createdAt: string
}

interface SocketMessageType {
    message: Msg,
    sender: {
        name: string,
        for: string
    }
}

interface ChatMsgCtxType {
    activate: boolean;
    msg: Msg | null,
    messageSender: SocketMessageType["sender"] | null,
    setActivate: React.Dispatch<SetStateAction<boolean>>
    currentlyOpened: string | null,
    setCurrentlyOpened: React.Dispatch<SetStateAction<string | null>>
}

const ChatMessageContext = createContext<ChatMsgCtxType | null>(null);

export const MessageContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [msg, setMsg] = useState<Msg | null>(null);
    const [messageSender, setMessageSender] = useState<SocketMessageType["sender"] | null>(null);

    const [activate, setActivate] = useState<boolean>(false);
    const [currentlyOpened, setCurrentlyOpened] = useState<string | null>(null);
    const { showToastMsg } = useToastMsgContext()

    useEffect(() => {
        if (activate === true) {
            const socket = getSocket();

            if (!socket) {
                showToastMsg({ text: "User Logged In! But failed to connect with chat servers.", type: "error" });
                return;
            }

            socket.on("messageReceived", (msg: SocketMessageType) => {
                setMessageSender(msg.sender);
                setMsg(msg.message);

                setTimeout(() => {
                    setMessageSender(null);
                    setMsg(null)
                }, 6000)
            });

            return () => {
                socket?.off("messageReceived");
            }
        }
    }, [activate]);

    return (
        <ChatMessageContext.Provider value={{ msg, activate, setActivate, currentlyOpened, setCurrentlyOpened, messageSender }}>
            {children}
        </ChatMessageContext.Provider>
    )
}

export const useChatMsgContext = () => {
    const context = useContext(ChatMessageContext);

    if (!context) throw new Error("Message must be inside the message provider!");
    return context;
}