"use client"
import { LuPencilLine } from "react-icons/lu";
import Link from "next/link";

interface Props {
    isOwner: string,
    isInvite: string,
    projectId: string,
}

const CtaProjectBtn: React.FC<Props> = ({ isOwner, isInvite, projectId }) => {

    const handleInviteAccept = async () => {
        console.log("Invite Accepted");
    };

    if (isOwner !== "") {
        return (
            <Link href={`/projects/edit/${projectId}`} className="px-4 py-2 bg-buttons text-ui-main rounded-xl text-md font-bold hover:bg-buttons/90 transition-colors shadow-lg shadow-buttons/20 cursor-pointer">
                <LuPencilLine size={18} className="inline" /> &nbsp; Edit Project
            </Link>
        )
    } else if (isInvite !== "") {
        return (
            <button
                onClick={handleInviteAccept}
                className="px-4 py-2 bg-buttons text-ui-main rounded-xl text-sm font-bold hover:bg-buttons/90 transition-colors shadow-lg shadow-buttons/20"
            >
                Accept Invite
            </button>
        )
    } else {
        return (<></>);
    }
}

export default CtaProjectBtn;