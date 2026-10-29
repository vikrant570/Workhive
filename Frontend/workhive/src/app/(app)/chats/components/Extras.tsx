import { LuLock, LuMessagesSquare } from "react-icons/lu";

interface Props {
    fallback: "fullPage" | "onlyMessages"
}

export const EmptyChatPlaceholder = ({ fallback }: Props) => {
    return (
        <div className={`bg-ui-secondary border-r border-white/30 h-screen ${fallback === "fullPage" ? "w-full ml-55" : "w-3xl"} flex flex-col items-center justify-center relative`}>
            {/* Center Content */}
            <div className="flex flex-col items-center text-center max-w-sm px-6">
                <div className="w-24 h-24 bg-ui-main rounded-full flex items-center justify-center mb-6 shadow-lg shadow-buttons/10">
                    <LuMessagesSquare size={44} className="text-buttons opacity-80" />
                </div>

                <h2 className="text-xl font-semibold text-texts-primary mb-2">
                    WorkHive Workspace
                </h2>

                <p className="text-texts-secondary text-sm leading-relaxed">
                    Select a conversation from the sidebar to start collaborating, or create a new project chat.
                </p>
            </div>

            {/* Bottom Security Note */}
            <div className="absolute bottom-8 flex items-center gap-1.5 text-texts-secondary/50 text-xs font-medium">
                <LuLock size={12} />
                <span>Secure, real-time collaboration</span>
            </div>

        </div>
    );
}

export const AvatarColorPallete = () => (
    <>
        <div className="bg-indigo-500/70 hidden"></div>
        <div className="bg-buttons hidden"></div>
        <div className="bg-texts-important hidden"></div>
        <div className="bg-red-500 hidden"></div>
        <div className="bg-purple-500/80 hidden"></div>
        <div className="bg-yellow-500 hidden"></div>
        <div className="bg-alerts hidden"></div>
        <div className="bg-ui-tertiary hidden"></div>
    </>
)