"use client"
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { handleIncomingConnReqs } from "@/ctaApiLogics/socialsGateway";
import Link from "next/link";
import { Activity, SetStateAction, useState } from "react";
import { LuCheck, LuEllipsisVertical, LuX } from "react-icons/lu";

interface props {
    connection: partialUserInfo,
    view: string,
    setRequestsLength?: React.Dispatch<SetStateAction<number>>;
};

const ConnectionsList: React.FC<props> = ({ connection, view, setRequestsLength }) => {
    const [reqIgnored, setReqIgnored] = useState<boolean>(false);
    const [reqAccepted, setReqAccepted] = useState<boolean>(false);
    const [openMemberMenu, setOpenMemberMenu] = useState<string | null>(null);

    const { showToastMsg } = useToastMsgContext();

    const handleAllCallsLocally = async (action: "accept" | "ignore") => {
        const res = await handleIncomingConnReqs(action, connection._id);

        if (!res.success) {
            showToastMsg({ text: res.message, type: "error" });
            return;
        }

        else if (res.success) {
            switch (action) {
                case "accept":
                    setReqAccepted(true);
                    break;
                case "ignore":
                    setReqIgnored(true);
                    setRequestsLength !== undefined && setRequestsLength((prev) => prev > 0 ? prev - 1 : prev)
                    break;
                default:
                    break;
            }
        }
    }

    const setCustomJsx = (connection: partialUserInfo) => {
        // Homepage Socials
        if (view == 'home') {
            return (
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full text-texts-secondary hover:bg-alerts/10 hover:text-alerts transition-colors" title="Remove">
                        <LuX size={14} />
                    </button>
                    <Link className="px-3 py-1.5 rounded-full bg-buttons/10 text-buttons text-xs font-semibold hover:bg-buttons hover:text-ui-main transition-colors" href={`/chats?c_id=${connection._id}`}>
                        Chat
                    </Link>
                </div>
            )
        }
        // Socials
        else if (view == 'socials') {
            return (
                reqAccepted == true ?
                    <span className="py-1.5 px-3 rounded-full bg-green-500/10 text-green-500 text-sm">
                        Accepted
                    </span>
                    : <div className="flex flex-row gap-7">
                        <button className="opacity-85 py-0.5 px-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/80 hover:text-white transition-colors cursor-pointer text-xs" onClick={() => { handleAllCallsLocally("accept") }}>
                            Accept <LuCheck size={14} className="inline" />
                        </button>
                        <button className="opacity-85 py-0.5 px-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/80 hover:text-white transition-colors cursor-pointer text-xs" onClick={() => { handleAllCallsLocally("ignore") }}>
                            Reject <LuX size={14} className="inline" />
                        </button>
                    </div>
            )
        }
        // View Project
        else if (view == 'project_view') {
            return (
                <Link href={`/profile/${connection._id}`} className="text-xs text-buttons font-medium hover:underline">
                    View
                </Link>
            )
        }
        // Edit Project
        else if (view == 'edit_project') {
            return (
                <div className="relative ml-2">
                    <button
                        onMouseEnter={() => setOpenMemberMenu(openMemberMenu === connection._id ? null : connection._id)}
                        className="p-1 text-texts-secondary hover:text-texts-primary hover:bg-ui-main rounded transition-colors cursor-pointer"
                    >
                        <LuEllipsisVertical size={16} />
                    </button>
                    {openMemberMenu === connection._id && (
                        <div className=" absolute right-3 p-2 top-0" onMouseLeave={() => setOpenMemberMenu(null)}>
                            <div className="w-32 rounded-xl bg-ui-main border border-ui-tertiary/20 shadow-xl z-30 overflow-hidden">
                                <Link
                                    href={`/profile/${connection._id}`}
                                    className="block px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors"
                                >
                                    View profile
                                </Link>
                                <Link
                                    href={`/chats?c_id=${connection._id}`}
                                    className="block px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors"
                                >
                                    Chat
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }

    const getStylingClass = () => {
        if (view == 'home') {
            return "border-ui-tertiary/20 border-2 px-4 py-3 rounded-xl bg-gradient-to-l from-ui-secondary to-buttons/5"
        }
        else if (view == 'socials') {
            return "border-buttons/10 border-2 px-4 py-3 rounded-xl bg-gradient-to-r from-ui-tertiary/5 to-ui-secondary"
        }
        else if (view == 'project_view') {
            return "border-l-3 border-buttons/20 pl-2 py-1.5 rounded-sm bg-gradient-to-l from-ui-secondary to-ui-tertiary/5"
        }
        else if (view == 'edit_project') {
            return "border-2 border-buttons/20 px-3 py-3 rounded-2xl bg-ui-main"
        }
    }

    return (
        <Activity key={connection._id} mode={!reqIgnored ? "visible" : "hidden"}>
            <div className={`flex items-center ${getStylingClass()} justify-between mb-3`} onMouseLeave={view == "edit_project" ? () => { setOpenMemberMenu(null) } : undefined}>
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ui-tertiary/20 to-ui-main flex items-center justify-center text-xs font-bold border border-ui-tertiary/10">
                        {connection.fullname[0]}
                    </div>
                    <span className="text-sm font-medium">{connection.fullname}</span>
                </div>
                {setCustomJsx(connection)}
            </div>
        </Activity>
    )
};

export default ConnectionsList;