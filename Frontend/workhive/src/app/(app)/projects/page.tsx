import { fetchProjectsList_server } from "@/lib/fetchData.server";
import { Suspense } from "react";
import { CgSpinner } from "react-icons/cg";
import FullContentError from "@/components/global_compns/FullContentError";
import { Project } from "./[id]/page";
import { LuClock, LuUsers, LuCircle, LuCircleAlert, LuCheck } from "react-icons/lu";
import { parseDate } from "@/utils/dateTimeFormatter";
import { getStatusBadge } from "@/utils/otherUItools";
import Link from "next/link";


function getStatusIconOnly(status: string) {
    switch (status) {
        case "Completed": return <LuCheck className="text-green-600 inline" size={13} />
        case "In progress": return <LuClock className="text-texts-important inline" size={13} />
        case "Cancelled": return <LuCircleAlert className="text-red-500 inline" size={13} />
        default: return <LuCircle className="text-gray-500 inline" size={13} />
    }
}

// Component
function FullProjectPreviewCard({ projects, userID }: { projects: Project[], userID: string }) {
    return (
        <>
            {projects.map((project, key) => (
                <Link href={`/projects/${project._id}`} className="p-0 m-0" key={key}>
                    <div key={key} className="flex items-center justify-start md:grid-cols-3 gap-10 bg-gradient-to-br from-buttons/5 via-indigo-300/10 to-ui-tertiary/10 p-4 my-3 rounded-2xl border-2 border-ui-tertiary/5 hover:border-buttons/20 transition-colors group w-full">
                        {/* Left Column */}
                        <div className="min-w-1/2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-buttons transition-colors">{project.title}</h3>
                                    <p className="text-xs text-texts-secondary flex items-center gap-2 mt-1">
                                        <LuUsers size={12} /> {project.owner.fullname}
                                        <span className="w-1 h-1 rounded-full bg-ui-tertiary/50"></span>
                                        <LuClock size={12} /> Due: {parseDate(new Date(project.deadline))}
                                    </p>
                                </div>
                                {getStatusBadge(project.status)}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-texts-secondary">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-ui-tertiary/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-buttons to-indigo-500"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="border-l-2 rounded-l-sm border-l-texts-important/80 pl-3">
                            <p className="text-md font-semibold text-texts-secondary mb-1">Your Roles</p>
                            <div className="flex flex-wrap gap-2 overflow-hidden">
                                {
                                    project.tasks.filter(task => String(task.assignedTo) === userID).slice(0, 4)
                                        .map(task => (
                                            <span key={task._id} className="text-texts-secondary text-sm bg-ui-secondary border border-buttons/20 text-center py-0.5 px-1.5 rounded-md">
                                                &bull; &nbsp;{task.title.split(" ", 4).join(" ")} {getStatusIconOnly(task.status)}
                                            </span>
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    )
}

// Main Function -----
export default async function MyProjectsList({ searchParams }: { searchParams: Promise<{ userID: string }> }) {
    const data = await fetchProjectsList_server("full");
    const { userID } = await searchParams;

    if (!data.success) {
        return <FullContentError page={"Projects"} error={data.message || "Failed to fetch data!"} />
    }

    return (
        <div className="bg-ui-main min-h-screen p-8 ml-55 text-texts-primary">
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-texts-secondary text-sm mt-1">Projects in which you are member</p>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-buttons to-transparent mt-2"></div>
            </div>
            <Suspense fallback={<CgSpinner size={25} className="m-auto mt-10 animate-spin" />}>
                {data?.projects && <FullProjectPreviewCard projects={data?.projects} userID={userID} />}
            </Suspense>
        </div>
    )
}