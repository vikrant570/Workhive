"use client"
import { useUserContext } from "@/contexts/UserContext";
import { fetchUserProfile_client } from "@/lib/fetchData.client";
import { parseDate } from "@/utils/dateTimeFormatter";
import handleError from "@/utils/handleError";
import { getNameInitials } from "@/utils/nameInitials";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuBriefcase, LuCheck, LuChevronRight, LuCross, LuTimer, LuTimerOff } from "react-icons/lu";

interface Message {
    _id: string,
    senderID: string,
    chatID: string,
    text: string,
    delivered: boolean,
    project: {
        _id: string
        title: string
    },
    createdAt: string,
    inviteStatus: 'Accepted' | 'Rejected' | 'Expired' | 'Pending'
}

interface Props {
    invite: Message,
    userID: string
}

const ProjectInviteCard: React.FC<Props> = ({ invite, userID }) => {
    const { user } = useUserContext();
    const [senderDetails, setSenderDetails] = useState<partialUserInfo | null>(null);
    const [error, setError] = useState<String>("");

    // Fetch Partial Of The Sender Of The Invite
    useEffect(() => {
        try {
            const fetchHostDetails = async (hostID: string) => {
                const res = await fetchUserProfile_client(hostID, "1");
                setSenderDetails(res.profileData);
            }

            if (user && (userID == invite.senderID)) {
                setSenderDetails(user)
            } else {
                fetchHostDetails(invite.senderID);
            }
        } catch (err: any) {
            setError(handleError(err, "axios") as string);
        }
    }, []);


    // Set Dynamic Button/Icon For Different Invite Statuses
    const setActionForInviteStatus = () => {
        const status = invite.inviteStatus;

        switch (status) {
            case ("Pending"):
                return (
                    <span className="flex items-center justify-center gap-1 text-xs font-bold main-btn">
                        View <LuChevronRight size={14} />
                    </span>
                );
            case "Rejected":
                return (
                    <span className="flex items-center justify-center gap-1 text-xs font-bold bg-red-600/50 rounded-md py-1 px-2">
                        {status} &nbsp;<LuCross size={14} />
                    </span>
                );
            case "Expired":
                return (
                    <span className="flex items-center justify-center gap-1 text-xs font-bold bg-texts-important/60 rounded-md py-1 px-2">
                        {status} &nbsp;<LuTimerOff size={14} />
                    </span>
                );
            case "Accepted":
                return (
                    <span className="flex items-center justify-center gap-1 text-xs font-bold bg-green-500/45 rounded-md py-1 px-2">
                        {status} &nbsp;<LuTimerOff size={14} />
                    </span>
                );

            default:
                return <></>;
        }

    }

    if (error !== "") {
        return (
            <div className="w-full max-w-[80%] md:max-w-md rounded-2xl px-4 py-3 relative shadow-md bg-ui-main border border-ui-tertiary/10">
                <p className="text-texts-secondary text-xs">
                    <LuTimer size={12} className="inline" /> This message is unavailable.
                </p>
            </div>
        )
    }

    // Destination Link For Invite Card
    const url = (invite.inviteStatus == "Expired" || "Rejected") ?
        '/#' :
        `/projects/${invite.project._id}?isOwner=${userID == invite.senderID ? "1" : "0"}&isInvite=1`;

    return (
        <Link
            href={url}
            className={`flex ${invite.senderID == userID ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
            <div className={`w-full max-w-[80%] md:max-w-md rounded-2xl ${invite.senderID == userID ? "rounded-tr-sm" : "rounded-tl-sm"} px-4 py-3 relative shadow-md bg-ui-main border border-ui-tertiary/10`}>

                {/* Embedded Project Card */}
                {invite?.project && senderDetails !== null && (
                    <div className="bg-ui-secondary rounded-xl p-3 mb-3 border border-ui-tertiary/10 shadow-sm">

                        {/* Host Info Section */}
                        <div className="flex items-center justify-between mb-3 border-b border-ui-tertiary/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-ui-main flex items-center justify-center text-[10px] font-bold text-buttons border border-ui-tertiary/20">
                                    {getNameInitials(senderDetails.fullname)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-texts-primary leading-tight">{senderDetails.fullname}</p>
                                    <p className="text-[10px] text-texts-secondary">{senderDetails.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-texts-secondary bg-ui-main px-2 py-1 rounded-md border border-ui-tertiary/5">
                                <LuBriefcase size={12} className="text-buttons" />
                                <span className="truncate max-w-[80px]">Work Invite</span>
                            </div>
                        </div>

                        {/* Project Title & Action Button */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] text-texts-secondary uppercase tracking-widest mb-0.5">For</p>
                                <p className="text-sm font-bold text-texts-primary truncate" title={invite.project.title}>
                                    {invite.project.title}
                                </p>
                            </div>
                            {/* Dynamic Element For Different Invite Statuses */}
                            {setActionForInviteStatus()}
                        </div>

                    </div>
                )}

                {/* Message Text */}
                <p className="text-sm text-texts-primary leading-relaxed pr-2">
                    {invite.text}
                </p>

                {/* Timestamp & Delivery Status */}
                <div className="flex items-center gap-1 mt-2 justify-end text-texts-secondary">
                    <span className="text-[10px] font-medium uppercase tracking-wider">
                        {parseDate(new Date(invite.createdAt)).split(",")[1]}
                    </span>
                    {invite.delivered && invite.senderID === userID && (
                        <LuCheck size={14} className="text-buttons ml-1" />
                    )}
                </div>
            </div>
        </Link>
    )
};

export default ProjectInviteCard;