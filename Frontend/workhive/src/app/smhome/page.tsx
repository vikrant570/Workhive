import { LuMonitor, LuSmartphone, LuArrowRight, LuHexagon } from "react-icons/lu";

const MobileLandingPage = () => {
    return (
        <main className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center px-6 relative">

            <h1 className="text-texts-primary text-3xl font-bold tracking-widest absolute top-12"> WORKHIVE </h1>
            <img src="/favicon.ico" alt="" className="w-60 h-60 m-0 p-0" />

            <div className="max-w-md w-full p-10 rounded-[32px] bg-transparen border-2 border-buttons/20 flex flex-col items-center text-center gap-6 ">

                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="p-4 rounded-2xl bg-texts-primary">
                        <LuSmartphone size={32} className="text-ui-secondary" />
                    </div>

                    <LuArrowRight size={24} className="text-buttons" />

                    <div className="p-4 rounded-2xl bg-ui-secondary border-2 border-ui-tertiary/20">
                        <LuMonitor size={36} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-buttons tracking-tight">
                    Desktop Recommended
                </h1>

                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    We are actively crafting the mobile experience. To access the full suite of professional features and manage your workflow seamlessly, please open this platform on a desktop environment.
                </p>

            </div>
        </main >
    );
}

export default MobileLandingPage;