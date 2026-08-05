"use client"
import { Activity, useEffect, useState } from "react";
import { LuHexagon, LuSparkles } from "react-icons/lu";

export default function WelcomePopup() {
    const [open, setOpen] = useState<boolean>(false);

    const assignNewTimeStamp = () => {
        localStorage.clear();
        const lastOpened = new Date();
        localStorage.setItem("showWelcomePopup", JSON.stringify(lastOpened));
        setOpen(true);
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lastOpened = localStorage.getItem("showWelcomePopup");

            if (!lastOpened || lastOpened == "undefined") {
                assignNewTimeStamp();
                return;
            };

            // If item is found then it means it was already opened recently, will reopen after the set time.
            const whenOpened = JSON.parse(lastOpened);

            if (whenOpened !== "") {
                const lastOpen = new Date(whenOpened).getTime();
                const now = Date.now();
                const diffHours = (now - lastOpen) / (1000 * 60 * 60);
                diffHours >= 15 && assignNewTimeStamp();
            } else {
                setOpen(true);
            }
        }
    }, []);

    return (
        // The parent Activity tag, defaulting to visible
        <Activity mode={open ? "visible" : "hidden"}>
            <div className="absolute z-[999]">

                {/* Background Div: Full screen, blurred, and acts as the click target */}
                <div
                    id="workhive-backdrop"
                    className="fixed inset-0 bg-ui-main/60 backdrop-blur-md cursor-pointer flex items-center justify-center"
                    onClick={() => { setOpen(false) }}
                >

                    {/* Popup Container: Half screen size (50vw x 50vh) & Centered */}
                    <div
                        className="z-[1000] relative w-[50vw] h-[50vh] bg-ui-secondary border border-ui-tertiary/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden cursor-default"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {/* Ambient Glow Effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-buttons/20 blur-[80px] rounded-full pointer-events-none"></div>

                        {/* Logo & Icon */}
                        <div className="w-20 h-20 mb-6 bg-ui-main border border-ui-tertiary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-buttons/10 relative">
                            <LuHexagon size={40} className="text-buttons fill-buttons/10" />
                            <LuSparkles size={16} className="absolute -top-2 -right-2 text-texts-important animate-pulse" />
                        </div>

                        {/* Welcome Text */}
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-texts-primary mb-4">
                            Welcome to <span className="text-buttons">WorkHive</span>
                        </h1>

                        <p className="text-base md:text-lg text-texts-secondary max-w-md leading-relaxed mb-8">
                            The central operating system for modern teams. Connect seamlessly, collaborate effortlessly, and manage all your projects in one unified workspace.
                        </p>

                        <p className="text-xs text-texts-secondary/50 font-mono uppercase tracking-widest mt-auto absolute bottom-6">
                            Click anywhere to continue
                        </p>
                    </div>
                </div>
            </div>
        </Activity>
    );
}