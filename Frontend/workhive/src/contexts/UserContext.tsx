"use client";
import { createContext, SetStateAction, useContext, useEffect, useState } from "react";
import { fetchUserProfile_client } from "@/lib/fetchData.client";
import { useToastMsgContext } from "./ToastMsgContext";
import { useChatMsgContext } from "./ChatMsgContext";

interface userContextType {
    user: partialUserInfo | null,
    setUser: React.Dispatch<SetStateAction<partialUserInfo | null>>
}

const UserContext = createContext<userContextType | null>(null);

// CONTEXT PROVIDER
export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<partialUserInfo | null>(null);
    const { showToastMsg } = useToastMsgContext();
    const { setActivate } = useChatMsgContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetchUserProfile_client("0", "1");

                if (!res.success) throw new Error("Failed to fetch data!");
                setUser(res.profileData);

                setActivate(res.success);
            } catch (err) {
                showToastMsg({ text: "Failed to fetch user data!", type: "error" });
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// NUll saftey hook.
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("User context must be used within UserContextProvider");

    return context;
}