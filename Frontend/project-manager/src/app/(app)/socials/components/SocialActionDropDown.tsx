"use client"

import { useToastMsgContext } from "@/contexts/ToastMsgContext"
import { socialActionsHandle } from "@/ctaApiLogics/socialsGateway"
import Link from "next/link"
import { SetStateAction } from "react"

interface Props {
    userID: string,
    view: "connections" | "searchResults" | "blockList",
    setReqSent?: React.Dispatch<SetStateAction<boolean>>,
    setBlocked: React.Dispatch<SetStateAction<boolean>>,
    setDropDownOpen: React.Dispatch<SetStateAction<boolean>>,
    setRemoved?: React.Dispatch<SetStateAction<boolean>>
}

// Dropdown for actions for already connected/requested users
const SocialActionDropDown = ({ userID, view, setBlocked, setReqSent, setDropDownOpen, setRemoved }: Props) => {
    const { showToastMsg } = useToastMsgContext();

    // Handling different actions locally
    const handleAllCallsLocally = async (action: "request" | "remove" | "block" | "withdraw" | "unblock") => {
        const res = await socialActionsHandle(action, userID);

        if (!res.success) {
            showToastMsg({ text: res.message, type: "error" });
            console.log(res.message)
            return;
        }

        if (res.success && setReqSent !== undefined) {
            let message: string = "Action Success";

            switch (action) {
                case "block":
                    setBlocked(true);
                    setReqSent(false);
                    message = "User Blocked!"
                    break;

                case "unblock":
                    setBlocked(false);
                    message = "User Unblocked."
                    break;

                case "withdraw":
                    setReqSent(false);
                    message = "Request Cancelled!"
                    break;

                case "remove":
                    setRemoved !== undefined && setRemoved(true);
                    message = "Connection Removed."
                    break;

                default:
                    break;
            }
            showToastMsg({ text: message, type: "info" });
        }
    }

    return (
        <div className={`absolute ${view === "connections" ? "right-10 top-2" : "left-58 top-2"} min-w-30 rounded-xl bg-ui-main text-center border-ui-tertiary/20 shadow-lg shadow-black/25 flex flex-col items-center text-texts-primary text-xs`} onMouseLeave={() => { setDropDownOpen(false) }}>
            {/* setReqSentMeans user is not connected, exists in sent requests */}
            {
                view === "connections" || view === "blockList" ?
                    <Link href={`/profile/${userID}`} className="hover:bg-buttons/5 hover:text-buttons/90 transition-all px-6 py-2.5 cursor-pointer w-full rounded-t-xl">
                        View Profile
                    </Link>
                    : null
            }
            {
                view !== "blockList" &&
                <button className="hover:bg-texts-important/5 hover:text-texts-important/90 transition-all px-6 py-2.5 cursor-pointer w-full"
                    onClick={() => { handleAllCallsLocally(view === "connections" ? "remove" : "withdraw") }}
                >
                    {view === "connections" ? "Remove" : "Unsend Req"}
                </button>
            }

            <button className={`${view === "blockList" ? "hover:bg-ui-tertiary/30" : "hover:bg-alerts/10 hover:text-red-500"} transition-all px-6 py-2.5 cursor-pointer w-full rounded-b-xl`}
                onClick={() => { handleAllCallsLocally(view === "blockList" ? "unblock" : "block") }}
            >
                {view === "blockList" ? "Unblock" : "Block"}
            </button>

        </div>
    )
}

export default SocialActionDropDown