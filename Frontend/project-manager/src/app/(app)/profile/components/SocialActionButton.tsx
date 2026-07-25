"use client"
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { socialActionsHandle } from "@/ctaApiLogics/socialsGateway";
import Link from "next/link";
import { useRef, useState } from "react";
import { LiaUserClockSolid } from "react-icons/lia";
import { LuFlag, LuLink, LuMessageSquare, LuUserPlus, LuX } from "react-icons/lu";

interface Props {
    socialBooleans: {
        userID: string,
        isConnected: boolean,
        isRequested: boolean,
        isBlockedBy: boolean
    }
}

const SocialActionButtonForProfileView = ({ socialBooleans }: Props) => {
    const { userID, isRequested, isConnected, isBlockedBy } = socialBooleans;

    const [reqSent, setReqSent] = useState<boolean>(isRequested);
    const [blocked, setBlocked] = useState<boolean>(isBlockedBy);
    const [remove, setRemove] = useState<boolean>(false);

    const coolDownTimer = useRef<NodeJS.Timeout | null>(null);
    const { showToastMsg } = useToastMsgContext();

    const handleAllCallsLocally = async (action: "request" | "remove" | "block" | "withdraw" | "unblock") => {
        if (coolDownTimer.current) return;
        console.log(action);

        coolDownTimer.current = setTimeout(() => {
            coolDownTimer.current = null;
        }, 3000);

        // Only perform actions if they are not already done -> Backend overload prevention
        if (action !== "block") {
            switch (action) {
                case ("request"):
                    if (reqSent) return;
                    break;
                case ("withdraw"):
                    if (!reqSent) return;
                    break;
                case ("remove"):
                    if (remove) return;
                    break;
                default:
                    break;
            }
        }

        const response = await socialActionsHandle(action, userID);

        if (!response.success) {
            showToastMsg({ text: response.message, type: "error" });
            return
        }

        if (response.success) {
            switch (action) {
                case "block":
                    setBlocked(true);
                    setReqSent(false)
                    break;
                case "remove":
                    setRemove(true);
                    break;
                case "request":
                    setReqSent(true);
                    break;
                case "withdraw":
                    setReqSent(false);
                    break;
                case "unblock":
                    setReqSent(false);
                    setBlocked(false);
                    setRemove(true);
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <>
            {
                <div className="w-full flex flex-row items-center p-2 text-sm justify-between gap-2 rounded-2xl bg-ui-main border border-ui-tertiary/10">

                    <button className={`${blocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"} flex items-center justify-center gap-2 px-4 py-2 transition-all duration-150 ease-in-out rounded-xl text-texts-primary
                        ${isConnected && !remove ? "bg-transparent hover:scale-102 hover:bg-ui-tertiary/20 border border-ui-tertiary/20"
                            : (
                                reqSent ? "bg-transparent hover:scale-102 hover:text-texts-important/80 hover:bg-texts-important/10 border border-texts-important/10"
                                    : "bg-buttons hover:bg-buttons/60 hover:scale-102"
                            )
                        } 
                        `}
                        onClick={() => { if (!remove && !blocked) handleAllCallsLocally(isConnected && !remove ? "remove" : reqSent ? "withdraw" : "request") }}
                        disabled={blocked}
                    >
                        {
                            isConnected && !remove ? <> <LuX size={18} /> Remove </>
                                : (
                                    reqSent ? <> <LiaUserClockSolid size={18} /> Unsend Req </>
                                        : <> <LuUserPlus size={18} /> Connect </>
                                )
                        }
                    </button>

                    <button className={`flex items-center justify-center gap-2 px-4 py-2 text-texts-primary bg-transparent transition-all duration-150 cursor-pointer ease-in-out hover:scale-102 rounded-xl border
                    ${!blocked ? "hover:text-red-500 hover:bg-alerts/10 border-alerts/50"
                            : "hover:bg-ui-tertiary/10 border-ui-tertiary/20"
                        }`}
                        onClick={() => { handleAllCallsLocally(!blocked ? "block" : "unblock") }}
                    >
                        {!blocked ? <> <LuFlag size={18} /> Block User </> : <> <LuLink size={18} /> Unblock </>}
                    </button>
                </div>
            }

            <Link
                href={`${!blocked ? `/chats?c_id=${userID}&from=/profile/${userID}}` : '#'}`}
                className={`w-full py-3 bg-ui-main border border-ui-tertiary/20 rounded-xl font-medium ${!blocked ? "hover:border-buttons/50 text-texts-primary" : "text-texts-secondary/70 cursor-not-allowed"} transition-all flex items-center justify-center gap-2`}
            >
                <LuMessageSquare size={18} /> Message
            </Link>
        </>
    )
};

export default SocialActionButtonForProfileView;