"use client"
import { LuCircleCheck, LuClock, LuEllipsisVertical, LuPencilLine, LuX } from "react-icons/lu";

import Link from "next/link";
import { useState } from "react";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

import { acceptInvite, askReport } from "@/ctaApiLogics/projectGateway";
import handleError from "@/utils/handleError";

import { Task } from "../../[id]/page";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";

// Component number one
interface EditORViewAccessProps {
    type: "ownerView" | "invite" | "none"
    projectId: string,
    inviteStatus?: "Accepted" | "Pending"
    inviteID: string
}

export const EditORViewAccess: React.FC<EditORViewAccessProps> = ({ type, projectId, inviteStatus, inviteID }) => {
    const baseClass = "px-4 py-2 rounded-xl font-bold transition-colors duration-150 shadow-lg cursor-pointer flex items-center gap-2";

    const [currInviteStatus, setCurrInviteStatus] = useState<"Accepted" | "Rejected" | null>(null);
    const { showToastMsg } = useToastMsgContext();
    const router = useRouter();

    const handleInviteAction = async (action: "Accepted" | "Rejected") => {
        try {
            const res = await acceptInvite(projectId, action, inviteID);

            if (!res.success) {
                throw new Error("Unable to process your request at the moment!");
            }

            if (action === "Accepted") {
                const successTone = new Audio("/sounds/send_request_web.mp3");
                successTone.play();
            }

            router.refresh();
            setCurrInviteStatus(action);
            showToastMsg({ text: "Invite " + action.toLowerCase() + " successfully!", type: "success" });
        } catch (error) {
            showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
        }
    }

    if (type === "ownerView") {
        return (
            <Link href={`/projects/create?p_id=${projectId}&edit=1`} className={`${baseClass} text-md hover:bg-buttons/70 bg-buttons text-ui-main hover:text-texts-primary/90 shadow-buttons/20`}>
                <LuPencilLine size={18} className="inline" /> &nbsp; Edit Project
            </Link>
        )
    }

    else if (type === "invite" && inviteStatus && inviteStatus === "Pending" && !currInviteStatus) {
        return (
            <div className="group fixed top-5 right-5 p-3 rounded-2xl bg-ui-secondary border-2 border-ui-tertiary/10 opacity-100">
                <p className="text-xs text-texts-secondary"> <LuClock size={12} className="inline" /> Kindly respond to the invitation timely</p>
                <div className="flex gap-4 items-center mt-2">
                    <button
                        onClick={() => { handleInviteAction("Accepted") }}
                        className={`${baseClass} text-sm hover:bg-buttons/70 bg-buttons text-ui-main hover:text-texts-primary/90 shadow-buttons/20`}
                    >
                        <LuCircleCheck size={18} className="inline" /> Accept
                    </button>

                    <button
                        onClick={() => { handleInviteAction("Rejected") }}
                        className={`${baseClass} text-sm hover:bg-red-500/60 bg-red-500/90 text-texts-primary hover:text-texts-primary/80 shadow-alerts/20`}
                    >
                        <LuX size={18} className="inline" /> Reject
                    </button>
                </div>
            </div>
        )
    }

    else {
        return null;
    }
}

// Component number 2
interface TaskEllipsesDropDownProps {
    projectTitle: string;
    projectOwner: string;
    projectTask: Task;
    view: "Project" | "Report"
}
export const TaskEllipsesDropDown = ({ projectTitle, projectTask, projectOwner, view }: TaskEllipsesDropDownProps) => {
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const { showToastMsg } = useToastMsgContext();
    const { user } = useUserContext();

    const handleAskReportClick = async () => {
        try {
            await askReport(projectTask.assignedTo._id, projectTask.title, projectTitle);
            showToastMsg({ text: "Report Request Sent!", type: "success" });
        } catch (error) {
            showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
        }
    }

    if (projectOwner === projectTask.assignedTo._id || ["Cancelled", "Completed"].includes(projectTask.status)) {
        return <div className="w-6"></div>
    }

    return (
        <>
            <button className="p-1 text-texts-secondary hover:text-texts-primary hover:bg-ui-secondary rounded transition-colors opacity-0 group-hover:opacity-100" onClick={() => setDropDownOpen(prev => !prev)}>
                <LuEllipsisVertical size={16} />
            </button>
            {
                dropDownOpen &&
                <div className="absolute right-5 top-8 w-32 rounded-xl bg-ui-main border border-ui-tertiary/20 shadow-lg shadow-black/5 z-999" onMouseLeave={() => { setDropDownOpen(false) }}>
                    {
                        user?._id === projectTask.assignedTo._id ?
                            <button
                                onClick={() => handleAskReportClick()}
                                className={`w-full text-left px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors ${false ? "rounded-t-xl" : "rounded-xl"}`}
                            >
                                Feedback
                            </button>
                            :
                            <button
                                onClick={() => handleAskReportClick()}
                                className={`w-full text-left px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors ${false ? "rounded-t-xl" : "rounded-xl"}`}
                            >
                                Ask report
                            </button>
                    }

                    {/* More buttons if needed */}
                </div>
            }

        </>
    )
}