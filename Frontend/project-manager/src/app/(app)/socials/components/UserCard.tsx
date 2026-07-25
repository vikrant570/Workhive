"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { socialActionsHandle } from "@/ctaApiLogics/socialsGateway";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

import {
    LuUser,
    LuMessageSquare,
    LuBriefcase,
    LuEllipsisVertical,
    LuUserPlus,
    LuChevronRight
} from "react-icons/lu";
import { LiaUserClockSolid } from "react-icons/lia";

import { Activity, useState } from "react";
import SocialActionDropDown from "./SocialActionDropDown";

interface Props {
    user: professionalUserInfo | partialUserInfo,
    view: "connections" | "searchResults" | "blockList",
    isConnected?: boolean,
    isRequested?: boolean
}

const UserCard = ({ user, view, isConnected, isRequested }: Props) => {
    const pathname = usePathname();
    const { showToastMsg } = useToastMsgContext();

    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const [blocked, setBlocked] = useState<boolean>(view == "blockList" ? true : false);
    const [reqSent, setReqSent] = useState<boolean>(isRequested || false);
    const [removed, setRemoved] = useState<boolean>(false);

    const handleAllCallsLocally = async (action: "request") => {
        // One exception - For Sending Request From Search Results (Button is a part of this component)
        const res = await socialActionsHandle(action, user._id);

        if (!res.success) {
            showToastMsg({ text: res.message, type: "error" });
            return;
        }

        else {
            setReqSent(true);
            showToastMsg({ text: "Request Sent!", type: "info" })
        }
    }

    const smallUserCardClickableJSX = () => {
        if (view === "blockList") {
            return (
                <button className="text-texts-secondary hover:text-texts-primary cursor-pointer ml-auto" onClick={() => { setDropDownOpen(true) }}>
                    <LuEllipsisVertical size={16} />
                </button>
            )
        }
        else if (view === "searchResults" && !isConnected) {
            return (
                <button
                    className={`p-2 rounded-full ${reqSent ? "bg-ui-tertiary/20 text-texts-important/80 hover:bg-ui-main hover:text-texts-primary" : "bg-ui-main text-texts-secondary hover:bg-buttons hover:text-ui-main"} ml-auto transition-all cursor-pointer`}
                    onClick={() => {
                        if (reqSent) {
                            setDropDownOpen(true);
                            return;
                        }
                        handleAllCallsLocally("request");
                    }}
                >

                    {reqSent ? <LiaUserClockSolid size={18} /> : <LuUserPlus size={18} />}
                </button>
            )
        }

        else if (isConnected) {
            return (
                <Link
                    href={`/profile/${user?._id}`}
                    className="p-2 rounded-full bg-ui-main text-texts-secondary hover:bg-buttons hover:text-ui-main hover:scale-[1.15] transition-all ml-auto"
                >
                    <LuChevronRight size={18} />
                </Link>
            )
        }
    }

    // Small User Cards
    if (view === "searchResults" || view === "blockList") {

        const mode = (): "visible" | "hidden" => {
            if (view === "blockList") return blocked ? "visible" : "hidden";
            if (view === "searchResults") return blocked ? "hidden" : "visible";

            return "visible";
        }

        return (
            <Activity mode={mode()}>
                <div className="flex flex-row items-center px-3 py-2 gap-3 group relative z-[899] min-w-[240px] bg-ui-secondary rounded-2xl border border-ui-tertiary/10 hover:border-buttons/30 transition-all">
                    <div className="w-12 h-12 rounded-full bg-ui-main flex items-center justify-center text-lg font-bold text-texts-secondary group-hover:text-buttons transition-colors">
                        {user.fullname[0]}
                    </div>

                    <div className="mb-0">
                        <Link href={`/profile/${user?._id}`} className="font-semibold text-md text-texts-primary truncate cursor-pointer transition-colors hover:text-buttons/50">
                            {user.fullname}
                        </Link>

                        <p className="text-xs text-texts-secondary mb-2">{user.username}</p>
                    </div>
                    {smallUserCardClickableJSX()}
                    {dropDownOpen && <SocialActionDropDown userID={user._id} view={view} setBlocked={setBlocked} setDropDownOpen={setDropDownOpen} setReqSent={setReqSent} />}
                </div>
            </Activity>
        )
    }

    // Large User Cards
    else if (view === "connections") {
        const profileData = user as professionalUserInfo;

        return (
            <Activity mode={!blocked && !removed ? "visible" : "hidden"}>
                <div className="relative z-[899] min-w-[240px] bg-ui-secondary rounded-2xl border border-ui-tertiary/10 hover:border-buttons/30 transition-all snap-start flex flex-col p-5" >

                    <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-ui-main border border-ui-tertiary/20 flex items-center justify-center text-buttons font-bold shadow-sm">
                            <LuUser size={18} />
                        </div>
                        <button className="text-texts-secondary hover:text-texts-primary cursor-pointer" onClick={() => { setDropDownOpen(true) }}>
                            <LuEllipsisVertical size={16} />
                        </button>
                        {dropDownOpen && <SocialActionDropDown userID={profileData._id} view={"connections"} setDropDownOpen={setDropDownOpen} setBlocked={setBlocked} setRemoved={setRemoved} />}
                    </div>

                    <div className="mb-4">
                        <Link href={`/profile/${profileData?._id}`} className="font-bold text-lg text-texts-primary truncate cursor-pointer transition-colors hover:text-buttons/50">
                            {profileData.fullname}
                        </Link>

                        <p className="text-xs text-texts-secondary mb-2">{profileData.username}</p>

                        <div className="flex items-center gap-2 text-xs text-texts-secondary bg-ui-main/50 p-2 rounded-lg">
                            <LuBriefcase size={12} className="text-buttons" />
                            <span className="truncate">{profileData?.jobTitle} at {profileData?.workplace}</span>
                        </div>
                    </div>

                    <Link
                        href={`/chats?c_id=${profileData?._id}&from=${pathname}`}
                        className="z-[900] mt-auto w-full py-2 bg-buttons/10 text-buttons rounded-xl text-sm font-bold hover:bg-buttons hover:text-ui-main transition-all flex items-center justify-center gap-2"
                    >
                        <LuMessageSquare size={16} /> Chat
                    </Link>
                </div>
            </Activity >
        )
    }
}

export default UserCard;