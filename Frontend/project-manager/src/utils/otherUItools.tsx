import { LuCircle, LuCircleAlert, LuCircleCheck, LuClock, LuFileText, LuImage, LuPaperclip } from "react-icons/lu";
import { ReactNode } from "react";

//  ----- PROJECTS -----
// 1.)
export const getStatusBadge = (status: string) => {
    const baseClass = "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold";

    const badges: { [key: string]: { icon: ReactNode, color: string } } = {
        "Completed": { icon: <LuCircleCheck size={12} />, color: "bg-green-500/10 text-green-500 border-green-500/20" },
        "In progress": { icon: <LuClock size={12} />, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        "Cancelled": { icon: <LuCircleAlert size={12} />, color: "bg-red-500/10 text-red-500 border-red-500/20" },
        "Pending": { icon: <LuCircle size={12} />, color: "bg-ui-tertiary/10 text-texts-secondary border-ui-tertiary/20" }
    }

    return (
        <span className={`${baseClass} ${badges[status].color}`}>
            {badges[status].icon} {status}
        </span>
    )
};
// 2.)
export const getAttachmentIcon = (filename: string) => {
    const ext = filename!.split('.')[1].toLowerCase();
    if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) return <LuImage size={18} className="text-purple-400" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return <LuFileText size={18} className="text-blue-400" />;
    return <LuPaperclip size={18} className="text-texts-secondary" />;
};