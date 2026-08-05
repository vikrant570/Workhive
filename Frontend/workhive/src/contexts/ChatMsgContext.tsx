"use client"
import { useEffect, useState, createContext, useContext, SetStateAction } from 'react';
import { socket } from '@/ctaApiLogics/chatGateway';

interface Msg {
    _id: string,
    text: string,
    senderID: string,
    chatID: string,
    delivered: boolean,
    createdAt: string
}

interface ChatMsgCtxType {
    msg: Msg | null,
    setActivate: React.Dispatch<SetStateAction<boolean>>
}

const ChatMessageContext = createContext<ChatMsgCtxType | null>(null);

export const MessageContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [msg, setMsg] = useState<Msg | null>(null);
    const [activate, setActivate] = useState<boolean>(false);

    useEffect(() => {
        if (activate === true) {
            socket?.on("messageReceived", (msg: Msg) => {
                setMsg(msg)
            });
        }

        return () => {
            socket?.off("messageReceived");
        }
    }, [activate]);

    return (
        <ChatMessageContext.Provider value={{ msg, setActivate }}>
            {children}
        </ChatMessageContext.Provider>
    )
}

export const useChatMsgContext = () => {
    const context = useContext(ChatMessageContext);

    if (!context) throw new Error("Message must be inside the message provider!");
    return context;
}