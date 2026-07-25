"use client"
import { LuCircleAlert } from "react-icons/lu";

interface Props {
    page: string,
    error: string
}

const FullContentError = ({ page, error }: Props) => {
    return (
        <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans">
            <h1>{page}</h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-6 opacity-50"></div>

            <div className="min-h-[55vh] flex items-center justify-center">
                <div className="bg-ui-secondary border border-alerts/20 rounded-3xl px-8 py-7 max-w-md w-full text-center shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-alerts/10 text-alerts flex items-center justify-center mx-auto mb-4">
                        <LuCircleAlert size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-texts-primary mb-2">Unable to load socials</h2>
                    <p className="text-sm text-texts-secondary leading-relaxed">{error}</p>
                </div>
            </div>
        </div>
    )
}

export default FullContentError;