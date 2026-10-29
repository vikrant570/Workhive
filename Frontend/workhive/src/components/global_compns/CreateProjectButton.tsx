"use client"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"
import { useChatMsgContext } from "@/contexts/ChatMsgContext"

const CreateProjectButton = () => {
    const { activate } = useChatMsgContext();

    if (!activate) return null;
    return (
        <Link
            href="/projects/create"
            className="fixed top-3 right-3 flex items-center gap-2 rounded-3xl bg-buttons transition-colors hover:bg-buttons/80 cursor-pointer px-3 py-2 text-texts-primary"
        >
            <LuPlus size={18} /> Create
        </Link>
    )
}

export default CreateProjectButton