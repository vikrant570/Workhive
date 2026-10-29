"use client"
import { LuCircleAlert, LuHouse, LuRefreshCcw } from "react-icons/lu";
import { SetStateAction } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    page: string,
    error: string,
    setError?: React.Dispatch<SetStateAction<string | null>>
}

const FullContentError = ({ page, error, setError }: Props) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans bt">
            <h1 className="font-bold text-3xl">{page}</h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-4 opacity-50"></div>

            <div className="min-h-[55vh] flex items-center justify-center">
                <div className="bg-ui-tertiary/5 rounded-3xl px-8 py-7 w-fit text-center border-2 border-ui-tertiary/40">
                    <div className="w-12 h-12 rounded-full bg-alerts/10 border-2 border-alerts text-alerts flex items-center justify-center mx-auto mb-4">
                        <LuCircleAlert size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-texts-primary mb-2">Failed To Load {page}</h2>
                    <p className="text-sm text-alerts leading-relaxed">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm mt-3">
                        <button
                            onClick={() => { setError ? setError(null) : router.refresh() }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-texts-important/90 text-ui-main rounded-xl font-semibold hover:bg-texts-important/80 hover:scale-105 transition-all shadow-lg shadow-buttons/10 active:scale-95"
                        >
                            <LuRefreshCcw size={18} />
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-ui-secondary border border-ui-tertiary/20 text-texts-secondary rounded-xl font-medium hover:text-texts-primary hover:border-buttons/50 transition-all hover:bg-ui-tertiary/5"
                        >
                            <LuHouse size={18} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullContentError;