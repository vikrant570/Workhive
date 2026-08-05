import { fetchUserProfile_server } from "@/lib/fetchData.server";
import { cookies } from "next/headers";
import Link from "next/link";
import { LuArrowLeft, LuChevronDown, LuHexagon, LuLogIn } from "react-icons/lu";

const navBarContents = [
    { title: "Home", href: "" },
    { title: "About Us", href: "about" },
    { title: "What's New", href: "updates" },
    { title: "Get Started", href: "getstarted" }
]

interface NextApiRes {
    profileData: partialUserInfo,
    success: boolean
}

export default async function PublicPageHeader() {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.has("refresh");

    const HeaderProfileElement = async () => {
        try {
            if (!isLoggedIn) throw new Error("User not logged In!");
            const response: NextApiRes = await fetchUserProfile_server("0", "1");

            const { profileData } = response;

            return (
                <Link
                    href={"/profile"}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-ui-main border border-ui-tertiary/10 hover:border-ui-tertiary/30 transition-all duration-300 group shadow-sm"
                >
                    <div className="w-8 h-8 min-w-[32px] bg-ui-secondary rounded-full flex items-center justify-center font-medium text-texts-primary text-sm group-hover:scale-105 transition-transform duration-300">
                        {profileData.fullname?.[0] || "U"}
                    </div>
                    <p className="text-sm font-medium text-texts-primary truncate max-w-[150px]">
                        {profileData.username}
                    </p>
                    <LuChevronDown size={14} className="text-texts-secondary group-hover:text-texts-primary transition-colors duration-300 ml-1" />
                </Link>
            )
        } catch (error) {
            return (
                <Link
                    href={"/auth"}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-ui-main text-texts-secondary hover:text-texts-primary hover:bg-ui-secondary border border-ui-tertiary/10 hover:border-ui-tertiary/30 transition-all duration-300 text-sm font-medium shadow-sm"
                >
                    <span className="truncate">SignIn</span>
                    <LuLogIn size={14} />
                </Link>
            )
        }
    }

    return (
        <header className="w-full mx-auto px-6 py-6 flex justify-between items-center sticky top-0 bg-ui-main/80 backdrop-blur-md z-50 border-b border-ui-tertiary/5">
            <div className="flex items-center gap-2">
                <LuHexagon size={28} className="text-buttons fill-buttons/20" />
                <span className="text-lg font-bold tracking-tight text-texts-primary">WORKHIVE</span>
            </div>
            <nav className="flex items-center gap-2">
                {
                    navBarContents.map((item, i) => (
                        <Link
                            href={`/${item.href}`}
                            key={i}
                            className="text-texts-secondary text-sm font-medium px-4 py-2 rounded-full hover:text-texts-primary hover:bg-buttons/10 transition-all duration-300"
                        >
                            {item.title}
                        </Link>
                    ))
                }
                <div className="flex items-center gap-3">
                    {HeaderProfileElement()}
                </div>
            </nav>
            <Link className="flex items-center gap-2 text-texts-secondary hover:text-texts-primary transition-colors font-medium text-sm group" href="/">
                <LuArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </Link>
        </header>
    )
}