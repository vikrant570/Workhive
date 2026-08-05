"use client"
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
    projectID: string,
    state: "loading" | "success"
}
const ProjectStateChangeAnimation = ({ projectID, state }: Props) => {
    const success = state === "success";

    const [seconds, setSeconds] = useState<number>(success ? 7 : 10);
    const [tipNo, setTipNo] = useState<number>(0);
    const router = useRouter();
    const { showToastMsg } = useToastMsgContext();

    const tips = [
        "Add milestones to track the progress of your project",
        "Break down large tasks into smaller, more manageable sub-tasks",
        "Use tags and labels to categorize and organize your tasks",
        "Assign specific department heads to ensure organized work distribution",
        "Monitor the project progress regularly and make adjustments as needed",
        "Communicate effectively with your team members to ensure everyone is on the same page",
        "Celebrate small wins to keep the team motivated.",
        "Remember that a well-planned project is a successful project."
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000)

        const tipsChangingInterval = setInterval(() => {
            const index = Math.floor(Math.random() * tips.length)
            setTipNo(index);
        }, 3000)

        setTimeout(() => {
            clearInterval(interval);
            clearInterval(tipsChangingInterval)
            if (success) {
                router.push(`/projects/${projectID}?isInvite=0`)
            }
            else {
                router.push("/projects")
                showToastMsg({ text: "There occured some error loading the content!", type: "error" })
            }
        }, success ? 7000 : 10000)
    }, [])

    return (
        <div className="w-full h-screen z-[1000] backdrop-blur-xs bg-black/10 fixed top-0 left-50">
            <dialog
                open
                className="fixed m-auto rounded-3xl bg-ui-main border-3 border-ui-tertiary/20 shadow-2xl shadow-black/50 z-50 top-30 right-50 animate-fade-in-pop lg:w-180 md:w-140 sm:w-100"
            >
                <div className="flex flex-col items-center gap-1 py-6 px-18 bg-gradient-to-br from-ui-tertiary/10 to-buttons/10 rounded-3xl">

                    <p className="text-3xl font-bold text-texts-primary">
                        {success ? "Project Created Successfully." : "Loading Interface..."}
                    </p>

                    <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-4 opacity-50"></div>
                    <DotLottieReact
                        src="/animations`/ProjectCreationSuccess.lottie"
                        loop
                        autoplay
                        className="p-0 mt-0"
                        style={{ height: "20%", width: "fit-content" }}
                        speed={0.5}
                    />
                    <p className="text-sm text-texts-primary">{tips[tipNo]}</p>
                    <p className="text-sm text-texts-secondary m-auto">
                        {success ? `Redirecting in ${seconds} ...` : "Please wait while we are preparing the editor for you!"}
                    </p>
                </div>
            </dialog>
        </div>
    )
}

export default ProjectStateChangeAnimation;