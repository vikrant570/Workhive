"use client"
import { useUserContext } from "@/contexts/UserContext"
import { parseDate } from "@/utils/dateTimeFormatter"
import Link from "next/link"
import { LuUsers, LuClock, } from "react-icons/lu"

interface Project {
    _id: string,
    owner: {
        _id: string,
        fullname: string
    },
    deadline: Date,
    title: string,
    status: string,
    progress: number
}

interface ProjectProp {
    projects: Project[],
}

const ProjectsList: React.FC<ProjectProp> = ({ projects }) => {
    const { user } = useUserContext();

    return (
        <>
            {projects.map((project, key) => (
                <Link href={`/projects/${project._id}?isOwner=${project.owner._id == user?._id ? "1" : "0"}`} className="p-0 m-0" key={key}>
                    <div key={key} className={
                        `bg-${projects.length > 4 ? 'gradient-to-r from-ui-secondary to-ui-tertiary/5' : 'ui-main'} 
                        p-4 my-3 rounded-2xl border border-ui-tertiary/5 hover:border-buttons/20 transition-colors group w-full`
                    }>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-buttons transition-colors">{project.title}</h3>
                                <p className="text-xs text-texts-secondary flex items-center gap-2 mt-1">
                                    <LuUsers size={12} /> {project.owner.fullname}
                                    <span className="w-1 h-1 rounded-full bg-ui-tertiary/50"></span>
                                    <LuClock size={12} /> Due: {parseDate(new Date(project.deadline))}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${project.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                                project.status === 'In progress' ? 'bg-buttons/10 text-buttons' :
                                    'bg-green-500/10 text-green-500'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-texts-secondary">
                                <span>Progress</span>
                                <span>{project?.progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-ui-tertiary/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-buttons to-indigo-500"
                                    style={{ width: `${project?.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    )
}

export default ProjectsList;