"use client"
import { fetchUserProfile_client } from "@/lib/fetchData.client";

import { parseDate } from "@/utils/dateTimeFormatter";
import handleError from "@/utils/handleError";
import { getNameInitials } from "@/utils/nameInitials";

import { useUserContext } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import Link from "next/link";

import { LuBriefcase, LuCheck, LuChevronRight, LuCross, LuTimer } from "react-icons/lu";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

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
    userID: string,
    align: "start" | "end"
}

const ProjectInviteCard: React.FC<Props> = ({ invite, userID, align }) => {
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
        const status = invite?.inviteStatus;;
        const baseClass = "flex items-center justify-center gap-1 text-xs font-medium rounded-md py-1 px-2"

        switch (status) {
            case ("Pending"):
                if (user?._id === invite.senderID) {
                    return (
                        <span className={`${baseClass} text-texts-important bg-ui-tertiary/10`}>
                            {status} &nbsp;<LuTimer size={14} />
                        </span>
                    )
                }
                return (
                    <span className={`${baseClass} bg-buttons/90 hover:bg-buttons/70 cursor-pointer transition-all duration-100 hover:scale-102`}>
                        View <LuChevronRight size={14} />
                    </span>
                );

            case "Rejected":
                return (
                    <span className={`${baseClass} bg-red-600/50`}>
                        {status} &nbsp;<LuCross size={14} />
                    </span>
                );

            case "Expired":
                return (
                    <span className={`${baseClass} bg-ui-tertiary/10 text-texts-secondary stroke-1 stroke-alerts/40`}>
                        {status} &nbsp;<LuTimer size={14} />
                    </span>
                );
            case "Accepted":
                return (
                    <span className={`${baseClass} bg-ui-tertiary/10 text-green-500 font-semibold border border-green-500/20`}>
                        View &nbsp;<LuCheck size={14} />
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
                    <LuTimer size={10} className="inline" /> This message is unavailable.
                </p>
            </div>
        )
    }

    // Destination Link For Invite Card
    const status = invite.inviteStatus;
    const url = (status === "Expired" || status === "Rejected") ?
        '/#' :
        (status === "Pending") ?
            `/projects/${invite.project._id}?inviteStatus=${status}&inviteID=${invite._id}` :
            `/projects/${invite.project._id}`;

    return (
        <Link
            href={url}
            className={`flex justify-${align} duration-300`}
        >
            <div className={`w-full max-w-[80%] md:max-w-md rounded-2xl ${invite.senderID == userID ? "rounded-tr-xs" : "rounded-tl-xs"} ${url === "#" ? "cursor-default" : "hover:bg-ui-secondary/40 transition-all duration-200"} px-4 py-3 relative shadow-md bg-ui-main border border-ui-tertiary/10`}>

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
                        <div className="flex items-end justify-between gap-4">
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
                        <IoCheckmarkDoneOutline size={14} className="text-buttons ml-1" />
                    )}
                </div>
            </div>
        </Link>
    )
};

export default ProjectInviteCard;