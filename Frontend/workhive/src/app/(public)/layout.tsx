import PublicPageHeader from "@/components/fixednav_compns/PublicPageHeader";
import Link from "next/link";
import { LuHexagon } from "react-icons/lu";


const Footer = () => (
    <footer className="w-full border-t border-ui-tertiary/10 py-12 bg-gradient-to-t from-buttons/5 to-ui-secondary">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <LuHexagon size={24} className="text-texts-secondary" />
                <span className="font-bold text-texts-secondary">WORKHIVE</span>
            </div>
            <div className="text-texts-secondary text-sm">
                © 2024 WorkHive Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
                <Link href="/privacypolicy" className="text-texts-secondary hover:text-buttons transition-colors">Privacy</Link>
                <Link href="#" className="text-texts-secondary hover:text-buttons transition-colors">Terms</Link>
                <Link href="/contact" className="text-texts-secondary hover:text-buttons transition-colors">Contact</Link>
            </div>
        </div>
    </footer>
)

export default function GuestSideLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicPageHeader />
            <div className="min-h-screen bg-ui-main text-texts-primary selection:bg-buttons/30 mx-10 mt-3 mb-7">
                {children}
            </div>
            <Footer />
        </>
    )
}