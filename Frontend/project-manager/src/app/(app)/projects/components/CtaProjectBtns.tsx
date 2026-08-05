"use client"
import { LuCircleCheck, LuEllipsisVertical, LuPencilLine } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { askReport } from "@/ctaApiLogics/projectGateway";
import handleError from "@/utils/handleError";
import { Task } from "../[id]/page";

// Component number one
interface EditORViewAccessProps {
    type: "ownerView" | "invite" | "none"
    projectId: string,
}

export const EditORViewAccess: React.FC<EditORViewAccessProps> = ({ type, projectId }) => {
    // 054
    const handleInviteAccept = async () => {
        // console.log("Invite Accepted");
    };
    const baseClass = "px-4 py-2 bg-buttons text-ui-main rounded-xl text-md font-bold hover:bg-buttons/70 transition-colors duration-150 hover:text-texts-primary/90 shadow-lg shadow-buttons/20 cursor-pointer flex items-center gap-2"

    if (type === "ownerView") {
        return (
            <Link href={`/projects/create?p_id=${projectId}&edit=1`} className={`${baseClass}`}>
                <LuPencilLine size={18} className="inline" /> &nbsp; Edit Project
            </Link>
        )
    }

    else if (type === "invite") {
        return (
            <button
                onClick={handleInviteAccept}
                className={`${baseClass}`}
            >
                <LuCircleCheck size={18} className="inline" /> Accept Invite
            </button>
        )
    } else {
        return null;
    }
}

// Component number 2
interface TaskEllipsesDropDownProps {
    projectTitle: string;
    projectOwner: string;
    projectTask: Task
}
export const TaskEllipsesDropDown = ({ projectTitle, projectTask, projectOwner }: TaskEllipsesDropDownProps) => {
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
    const { showToastMsg } = useToastMsgContext();

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
                    <button
                        onClick={() => handleAskReportClick()}
                        className={`w-full text-left px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors ${false ? "rounded-t-xl" : "rounded-xl"}`}
                    >
                        Ask report
                    </button>
                    {/* {
                        updateTasks && taskId &&
                        <button
                            onClick={() => { updateTasks(taskId, "status", "Cancelled") }}
                            className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors rounded-b-xl"
                        >
                            Abandon task
                        </button>
                    } */}
                    {/* More buttons if needed */}
                </div>
            }

        </>
    )
}