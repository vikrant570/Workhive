import { getNameInitials } from "@/utils/nameInitials";
import Link from "next/link";
import {
    LuArrowLeft,
    LuMail,
    LuGlobe,
    LuGithub,
    LuTwitter,
    LuLinkedin,
    LuUsers,
    LuBriefcase,
    LuFolderDot
} from "react-icons/lu";

import { fetchUserProfile_server } from "@/lib/fetchData.server";
import SocialActionButtonForProfileView from "../components/SocialActionButton";

// --- Mock Data ---
const mockSocialLinks = [
    { type: "github", url: "https://github.com/elenadev" },
    { type: "linkedin", url: "https://linkedin.com/in/elenarodriguez" },
    { type: "portfolio", url: "https://elenadesigns.com" }
];

// --- Helper Functions ---
const getIconForLink = (type: string) => {
    switch (type.toLowerCase()) {
        case 'github': return <LuGithub size={18} />;
        case 'twitter': return <LuTwitter size={18} />;
        case 'linkedin': return <LuLinkedin size={18} />;
        default: return <LuGlobe size={18} />;
    }
};

interface anotherUserProfileView extends fullUserInfo {
    isConnected: boolean,
    isRequested: boolean,
    isBlockedBy: boolean
}

export default async function AnotherUserProfile({ params }: params) {
    const { id } = await params;

    const response = await fetchUserProfile_server(id, "0");

    // Error Handle --
    if (!response.success || !response.profileData) {
        return <div className="text-red-500/80 text-lg ml-150 mt-20 w-full font-semibold">Unable To Fetch Data At The Moment! <br /> Please Try Again Later.</div>
    }

    const profileData = response.profileData as anotherUserProfileView;

    const PropsToBePassed = {
        userID: profileData._id,
        isRequested: profileData.isRequested,
        isConnected: profileData.isConnected,
        isBlockedBy: profileData.isBlockedBy
    }

    return (
        <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans">

            {/* Header / Navigation */}
            <div className="mb-8">
                {/* to be upgraded to memorize last routes */}
                <Link className="flex items-center gap-2 text-texts-secondary hover:text-texts-primary transition-colors font-medium text-sm group mb-6" href={"/"}>
                    <LuArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>
                <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">

                {/* Left Column: Avatar & Quick Actions (Span 4) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Main Profile Card */}
                    <div className="bg-ui-secondary rounded-3xl border border-ui-tertiary/10 p-8 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-buttons/10 blur-3xl rounded-full"></div>

                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ui-tertiary/20 to-ui-main border-4 border-ui-main flex items-center justify-center text-4xl font-bold text-texts-primary shadow-xl z-10 relative">
                                {getNameInitials(String(profileData.fullname))}
                            </div>
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-ui-secondary rounded-full z-20"></div>
                        </div>

                        <h1 className="text-2xl font-bold text-texts-primary mb-1">{profileData.fullname}</h1>
                        <p className="text-buttons text-sm font-medium mb-4">{profileData.username}</p>

                        <div className="flex items-center justify-center gap-2 text-xs text-texts-secondary mb-8">
                            <LuBriefcase size={14} />
                            <span>{profileData.jobTitle} at <span className="text-texts-primary">{profileData.workplace}</span></span>
                        </div>

                        {/* Social CTA Button */}
                        <div className="space-y-3 relative">
                            <SocialActionButtonForProfileView socialBooleans={PropsToBePassed} />
                        </div>
                    </div>

                    {/* Connection Stats - Mock Data For Now */}
                    <div className="bg-ui-secondary rounded-3xl border border-ui-tertiary/10 p-6 flex justify-around">
                        <div className="text-center">
                            <div className="flex justify-center items-center text-purple-400 mb-2">
                                <LuUsers size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-texts-primary">4</h3>
                            <p className="text-xs text-texts-secondary uppercase tracking-wider mt-1">Mutuals</p>
                        </div>
                        <div className="w-px bg-ui-tertiary/10"></div>
                        <div className="text-center">
                            <div className="flex justify-center items-center text-buttons mb-2">
                                <LuFolderDot size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-texts-primary">12</h3>
                            <p className="text-xs text-texts-secondary uppercase tracking-wider mt-1">Shared Projects</p>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-6">

                    {/* About Section */}
                    <div className="bg-ui-secondary rounded-3xl p-8 border border-ui-tertiary/10 shadow-lg">
                        <h2 className="text-lg font-bold text-texts-primary mb-6">About</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-ui-main/50 p-6 rounded-2xl border border-ui-tertiary/5">
                            <div>
                                <p className="text-xs text-texts-secondary uppercase tracking-wider mb-1">First Name</p>
                                <p className="text-texts-primary font-medium">{profileData.fullname.split(" ")[0]}</p>
                            </div>
                            <div>
                                <p className="text-xs text-texts-secondary uppercase tracking-wider mb-1">Last Name</p>
                                <p className="text-texts-primary font-medium">{profileData.fullname.split(" ")[1]}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-texts-secondary uppercase tracking-wider">Bio</p>
                            <p className="text-texts-primary text-sm leading-relaxed bg-ui-main p-5 rounded-2xl border border-ui-tertiary/10">
                                {profileData.bio}
                            </p>
                        </div>
                    </div>

                    {/* Contact & Links Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Email / Contact */}
                        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg flex flex-col justify-center">
                            <h2 className="text-sm font-bold text-texts-secondary uppercase tracking-wider mb-4">Contact Info</h2>
                            <div className="flex items-center gap-4 bg-ui-main p-4 rounded-2xl border border-ui-tertiary/5">
                                <div className="p-3 bg-ui-secondary rounded-xl text-texts-secondary">
                                    <LuMail size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-texts-secondary mb-0.5">Email Address</p>
                                    <a href={`mailto:${profileData.email}`} className="text-sm text-texts-primary font-medium hover:text-buttons transition-colors truncate block">
                                        {profileData.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Social Links (Conditionally Rendered) */}
                        {mockSocialLinks && mockSocialLinks.length > 0 && (
                            <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg">
                                <h2 className="text-sm font-bold text-texts-secondary uppercase tracking-wider mb-4">Web Links</h2>
                                <div className="space-y-3">
                                    {mockSocialLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 bg-ui-main p-3 rounded-2xl border border-ui-tertiary/5 hover:border-buttons/30 group transition-all"
                                        >
                                            <div className="text-texts-secondary group-hover:text-buttons transition-colors">
                                                {getIconForLink(link.type)}
                                            </div>
                                            <span className="text-sm text-texts-primary font-medium capitalize flex-1">{link.type}</span>
                                            <span className="text-xs text-texts-secondary opacity-0 group-hover:opacity-100 transition-opacity">Visit</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};