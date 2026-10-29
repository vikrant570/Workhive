import { fetchSingleProject_client } from "@/lib/fetchData.client";
import { ReactNode, useEffect, useRef, useState } from "react"
import { LuCheck, LuChevronDown, LuCircle, LuCircleAlert, LuClock, LuPencil } from "react-icons/lu";
import { Project, Task } from "../../projects/[id]/page";
import { useUserContext } from "@/contexts/UserContext";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import handleError from "@/utils/handleError";
import api from "@/lib/axios";

interface TaskFeedBack {
    _id: string,
    title: string,
    feedback: string,
    status: "In progress" | "Completed"
}
interface TaskFeedBackListProps {
    task: Omit<TaskFeedBack, "feedback">
    setLockedFeedBacks: React.Dispatch<React.SetStateAction<TaskFeedBack[] | null>>
    reportStatus: "Pending" | "Reported"
}
const TaskFeedBackListElement = ({ task, setLockedFeedBacks, reportStatus }: TaskFeedBackListProps) => {
    const [locked, setLocked] = useState<boolean>(false);
    const [feedBack, setFeedBack] = useState<string>("");
    const [taskStatus, setTaskStatus] = useState<"In progress" | "Completed">(task.status || "In progress");

    const originalTask = useRef<string>(JSON.stringify(task).trim());
    const { showToastMsg } = useToastMsgContext()


    const badges: { [key: string]: { icon: ReactNode, color: string } } = {
        "In progress": { icon: <LuClock size={12} />, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        "Completed": { icon: <LuCircle size={12} />, color: "bg-ui-tertiary/10 text-texts-secondary border-ui-tertiary/20" },
        "Pending": { icon: <LuCircleAlert size={12} />, color: "bg-texts-important-500/50 text-red-500 border-red-500/20" }
    }

    // Toggle Locked Tasks
    const toggleTasks = () => {
        const currentTask: TaskFeedBack = {
            _id: task._id,
            title: task.title,
            feedback: feedBack,
            status: taskStatus
        }

        const { feedback, ...rest } = currentTask;
        if (JSON.stringify(rest) == originalTask.current) {
            showToastMsg({ type: "info", text: "No Changes Were Made !" });
            return;
        }

        setLockedFeedBacks((prev) => {
            //Repair Logic Task Is Being Added Multiple Times ---
            if (!prev) return [currentTask];
            for (let t of prev) {
                if (t._id === task._id) {
                    t = currentTask;
                    break;
                }
                return prev;
            }
            return [...prev, currentTask]
        })
    }

    return (
        <div
            key={task._id}
            className={`relative px-4 py-2 rounded-2xl border transition-colors flex flex-col justify-start group bg-ui-main border-ui-tertiary/5 hover:border-buttons/30`}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className={`bg-gradient-to-r from-ui-tertiary/10 to-ui-secondary border-l-2 border-texts-important/80 rounded-l-sm rounded-lg w-fit text-xs ${locked ? "line-through text-texts-secondary/60" : "text-texts-primary"} px-2 py-1`}>
                    {task.title}
                </span>
                <button
                    className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${locked ? "bg-ui-tertiary/20 text-texts-secondary" : badges[taskStatus!]?.color ?? ""}`}
                    disabled={locked || reportStatus === "Reported"}
                    title="Change task status"
                    onClick={() => setTaskStatus((prev) => prev === "In progress" ? "Completed" : "In progress")}
                >
                    {badges[taskStatus!]?.icon} {taskStatus} <LuChevronDown size={12} />
                </button>
            </div>
            <div className="flex items-center gap-2 w-full">
                <input
                    type="text"
                    disabled={locked || reportStatus === "Reported"}
                    onChange={(e) => setFeedBack(e.target.value)}
                    placeholder="feeback ..."
                    value={feedBack}
                    className={`${locked || reportStatus === "Reported" ? "text-texts-secondary/40 bg-ui-tertiary/10 border-transparent cursor-not-allowed" : "text-texts-secondary focus:border-buttons border-ui-tertiary/20 bg-ui-main"} flex-1 border rounded-xl px-4 py-2 text-xs focus:outline-none transition-all`}
                />

                {
                    reportStatus === "Pending" &&
                    <button
                        className={`rounded-full ${locked ? "bg-green-500/90 hover:bg-green-500/60" : "bg-ui-tertiary/80 hover:bg-ui-tertiary/65"} cursor-pointer text-texts-primary text-sm p-1.5 transition-colors`}
                        onClick={() => {
                            setLocked(prev => !prev);
                            toggleTasks();
                        }}
                    >
                        {!locked ? <LuCheck size={18} /> : <LuPencil size={18} />}
                    </button>
                }
            </div>
        </div>
    )
}

const AskProgressReportCard = ({ projectID, messageID, align, reportStatus }: { projectID: string, messageID: string, align: "start" | "end", reportStatus: "Pending" | "Reported" }) => {
    const [lockedFeedBacks, setLockedFeedBacks] = useState<TaskFeedBack[] | null>(null);

    type partialTask = Omit<Task, "status" | "assignedTo"> & { status: "In progress" | "Completed", assignedTo: string };
    type partialProject = Pick<Project, "_id" | "title" | "owner"> & { tasks: partialTask[] };
    const [project, setProject] = useState<partialProject | null>(null);

    const { user } = useUserContext();
    const { showToastMsg } = useToastMsgContext();

    useEffect(() => {
        const fetchProjectTasks = async () => {
            try {
                const res = await fetchSingleProject_client(projectID, "partial");
                if (!res || !user) throw new Error();

                const filteredTasks = (res.project.tasks as partialTask[]).filter((t) => t.assignedTo === user._id && t.status === "In progress");
                const { tasks, ...rest } = res.project;
                setProject({ ...rest, tasks: filteredTasks });
            } catch (error) {
                showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
            }
        }
        fetchProjectTasks();
    }, [])

    // if (!myTasks) return (
    //     <div className="flex items-center italic gap-2 bg-ui-secondary text-texts-secondary text-sm p-2 rounded-2xl border-ui-tertiary/15 border-2">
    //         <LuCircleAlert size={16} /> <p>Failed To Load This Message !</p>
    //     </div>
    // )

    // Finalised API Call
    const submitReport = async () => {
        // try {
        //     const res = await api.patch("/reportUpdate", { reportedTasks: lockedFeedBacks, messageID });
        //     if (!res.data.success) throw new Error();

        //     showToastMsg({ type: "success", text: "Report Submitted Successfully !" });
        // } catch (error) {
        //     showToastMsg({ type: "error", text: handleError(error, "axios") as string });
        // }
        console.log("Task Feedback !", lockedFeedBacks);
    }

    return (
        project &&
        <div className={`flex justify-${align} p-0`}>
            <div className={`flex flex-col justify-start bg-gradient-to-bl from-ui-secondary to-ui-tertiary/5 py-2 px-4 rounded-2xl border-ui-tertiary/15 border w-[95%] ${align === "start" ? "rounded-tl-xs" : "rounded-tr-xs"}`}>
                <div className="flex items-center gap-2">
                    <span className="text-buttons text-lg font-semibold">Progress Report</span>
                    <h1 className="text-md text-texts-primary truncate text-ellipsis"> | {project?.title} | </h1>
                    <span className="text-texts-secondary italic text-sm"> {project?.owner.fullname.split(" ")[0]} </span>
                </div>

                <div className="h-0.5 flex-1 bg-gradient-to-r from-buttons to-transparent my-2"></div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {project.tasks.map((task) => (
                        <TaskFeedBackListElement task={task} setLockedFeedBacks={setLockedFeedBacks} key={task._id} reportStatus={reportStatus} />
                    ))}
                </div>

                {
                    reportStatus == "Pending" &&
                    <button
                        onClick={submitReport}
                        disabled={!lockedFeedBacks}
                        className="ml-auto w-fit mt-2 bg-ui-tertiary/30 text-texts-primary text-xs py-1 px-3 rounded-lg hover:bg-ui-tertiary/70 transition-all cursor-pointer">
                        Submit
                    </button>
                }
            </div>
        </div>
    )
}

export default AskProgressReportCard;