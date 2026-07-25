"use client"
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { fetchUserProfile_client } from "@/lib/fetchData.client";
import handleError from "@/utils/handleError";
import { getNameInitials } from "@/utils/nameInitials";
import { useEffect, useState } from "react";
import {
    LuBell, LuCircleCheck, LuShield, LuUser,
    LuCamera, LuGlobe, LuMail, LuSave,
    LuGithub, LuTwitter, LuBriefcase
} from "react-icons/lu";


const MyProfile = () => {
    const [user, setUser] = useState<fullUserInfo>();
    const { showToastMsg } = useToastMsgContext();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetchUserProfile_client("0", "0");
                setUser(response.profileData as fullUserInfo);
            } catch (err) {
                showToastMsg({
                    text: handleError((err as any), "axios") as string,
                    type: "error"
                });
            }
        }
        fetchUserProfile();
    }, [])

    return (
        user &&
        <div className="p-6 w-10/12 ml-55">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-white capitalize">
                    Profile
                </h1>
                <div className="flex gap-3">
                    <button className="p-2 bg-ui-secondary rounded-lg border border-ui-tertiary/20 hover:bg-slate-700 transition-colors relative">
                        <LuBell size={20} className="text-texts-secondary/70" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
                    </button>
                </div>
            </div>

            {/* Profile Header - No Tabs, No Banner */}
            <div className="bg-ui-secondary rounded-2xl border border-ui-tertiary/20 overflow-hidden relative group w-full">
                <div className="px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Avatar - Fully Rounded */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-ui-tertiary/20 border-4 border-ui-secondary p-1 shadow-xl">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                    {getNameInitials(user.fullname)}
                                </div>
                            </div>
                            <button className="absolute bottom-2 -right-0 bg-ui-secondary border border-ui-tertiary/40 p-2 rounded-full text-buttons/55 hover:text-white hover:bg-buttons/70 transition-colors shadow-lg">
                                <LuCamera size={16} />
                            </button>
                        </div>

                        {/* Name & Actions */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white">{user?.fullname.trim()}</h2>
                            <p className="text-texts-secondary/70 flex items-center justify-center md:justify-start gap-2">
                                {user?.jobTitle} <b>&bull;</b> {user?.workplace}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-ui-tertiary/20 hover:bg-ui-tertiary/50 border border-ui-tertiary/10 text-texts-primary/80 rounded-lg text-sm font-medium transition-colors">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-buttons/70 hover:bg-buttons text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                <LuSave size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="flex flex-col mt-5 gap-5">
                {/* Left Column: Personal Info Form */}
                <div className="bg-ui-secondary rounded-2xl border border-ui-tertiary/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <LuUser size={20} className="text-indigo-400" /> Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-texts-secondary/70 uppercase tracking-wide">First Name</label>
                            <input type="text" defaultValue={user?.fullname.split(" ")[0]} className="w-full bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-texts-secondary/70 uppercase tracking-wide">Last Name</label>
                            <input type="text" defaultValue={user?.fullname.split(" ")[1] || ""} className="w-full bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-medium text-texts-secondary/70 uppercase tracking-wide">Bio</label>
                            <textarea rows={4} defaultValue={user?.bio?.trim() || ""} className="w-full bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"></textarea>
                            <p className="text-xs text-texts-primary/60 text-right">250 characters left</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-texts-secondary/70 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <LuMail size={16} className="absolute left-3 top-3 text-texts-primary/60" />
                                <input type="email" defaultValue={user?.email || ""} className="w-full bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg pl-10 pr-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-texts-secondary/70 uppercase tracking-wide">Workplace</label>
                            <div className="relative">
                                <LuBriefcase size={16} className="absolute left-3 top-3 text-texts-primary/60" />
                                <input type="text" defaultValue={user?.workplace || ""} className="w-full bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg pl-10 pr-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-ui-secondary rounded-2xl border border-ui-tertiary/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <LuGlobe size={20} className="text-emerald-400" /> Social Links
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-buttons/15 rounded-lg border border-ui-tertiary/40">
                                <LuGlobe size={20} className="text-texts-secondary/70" />
                            </div>
                            <input type="text" placeholder="Your Website" defaultValue="https://johndoe.design" className="flex-1 bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-buttons/15 rounded-lg border border-ui-tertiary/40">
                                <LuGithub size={20} className="text-texts-secondary/70" />
                            </div>
                            <input type="text" placeholder="GitHub Profile" defaultValue="github.com/johndoe" className="flex-1 bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-buttons/15 rounded-lg border border-ui-tertiary/40">
                                <LuTwitter size={20} className="text-texts-secondary/70" />
                            </div>
                            <input type="text" placeholder="Twitter Handle" className="flex-1 bg-ui-tertiary/5 border border-ui-tertiary/40 rounded-lg px-4 py-2.5 text-texts-primary focus:outline-none focus:border-indigo-500 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-ui-secondary rounded-2xl border border-ui-tertiary/20 p-6">
                    <h3 className="font-semibold text-white mb-4">Account Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-buttons/15/50 rounded-lg border border-ui-tertiary/20">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-400">
                                    <LuCircleCheck size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-texts-primary">Email Verified</p>
                                    <p className="text-xs text-texts-secondary/80">Verified 2 months ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-buttons/15/50 rounded-lg border border-ui-tertiary/20">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-indigo-500/20 rounded text-indigo-400">
                                    <LuShield size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-texts-primary">2FA Enabled</p>
                                    <p className="text-xs text-texts-secondary/80">Enhanced security active</p>
                                </div>
                            </div>
                            <button className="text-xs text-buttons hover:text-buttons/50 font-medium">Manage</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;