import {
    LuTrendingUp, LuUsers, LuCircleCheck, LuClock,
    LuEllipsis, LuChartPie, LuArrowUpRight, LuArrowDownRight, LuBriefcase
} from "react-icons/lu";
import { CgSpinner } from "react-icons/cg";

import ProjectPreview from "../projects/components/ProjectsList";
import { Suspense } from "react";

// API Imports
import { fetchProjectsList_server } from "@/lib/fetchData.server";

// Mock Data
const activities = [
    { text: "You completed 7 projects this week", type: "success" },
    { text: "Recieved 79+ messages this week", type: "info" },
    { text: "Completion rate fell down by 10%", type: "warning" },
    { text: "Your last report wasn't submitted properly", type: "danger" },
    { text: "New team member added to Project X", type: "neutral" }
];
const stats = [
    { label: "Total Projects", value: "12", icon: LuBriefcase, trend: "+2", trendUp: true },
    { label: "Active Tasks", value: "48", icon: LuCircleCheck, trend: "-5", trendUp: false },
    { label: "Team Members", value: "24", icon: LuUsers, trend: "+4", trendUp: true },
    { label: "Efficiency", value: "92%", icon: LuTrendingUp, trend: "+1.5%", trendUp: true },
];

export default async function DashBoard() {

    const setProjectsJSX = async () => {
        try {
            const data = await fetchProjectsList_server("dashboard"); ``
            if (!data.success)
                throw new Error("Failed To Fetch Data !")

            return <ProjectPreview projects={data?.projects} />;
        } catch (error) {
            return <div className="text-alerts text-sm font-semibold">Unable To Fetch Data At The Moment! <br /> Please Try Again Later.</div>
        }
    }

    return (
        <div className=" bg-ui-main min-h-screen p-8 ml-55 text-texts-primary">

            {/* Header */}
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-texts-secondary text-sm mt-1">Overview of your workload and performance.</p>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-buttons to-transparent mt-2"></div>
            </div>

            {/* 1. Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 hover:border-buttons/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-ui-main rounded-xl border border-ui-tertiary/10 text-texts-secondary group-hover:text-buttons group-hover:border-buttons/20 transition-colors">
                                <stat.icon size={20} />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {stat.trend}
                                {stat.trendUp ? <LuArrowUpRight size={12} className="ml-1" /> : <LuArrowDownRight size={12} className="ml-1" />}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-texts-secondary">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="container-dashboard">

                {/* Left Column (Projects) - Spans 2 cols */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Projects Section */}
                    <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <LuBriefcase size={20} className="text-buttons" /> Active Projects
                            </h2>
                            <button className="text-xs text-buttons hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            <Suspense fallback={<CgSpinner size={25} className="m-auto mt-10 animate-spin" />}>
                                {setProjectsJSX()}
                            </Suspense>
                        </div>
                    </div>

                    {/* Task Overview */}
                    <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <LuChartPie size={20} className="text-purple-500" /> Project Overview
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-ui-main border border-ui-tertiary/5 flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-2 font-bold">12</div>
                                <span className="text-sm font-medium text-texts-secondary">To Do</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-ui-main border border-ui-tertiary/5 flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-2 font-bold">8</div>
                                <span className="text-sm font-medium text-texts-secondary">In Progress</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-ui-main border border-ui-tertiary/5 flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-2 font-bold">24</div>
                                <span className="text-sm font-medium text-texts-secondary">Completed</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Activity & More) */}
                <div className="space-y-4">
                    {/* Activity Log - REPLACED ICONS WITH SINGLE INDICATOR */}
                    <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Activity Log</h2>
                            <button className="p-1 rounded hover:bg-ui-main text-texts-secondary"><LuEllipsis size={16} /></button>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-[90%] before:w-0.5 before:bg-ui-tertiary/10">
                            {activities.map((act, i) => (
                                <div key={i} className="relative pl-8">
                                    <p className="text-sm text-texts-primary font-medium leading-tight">{act.text}</p>
                                    <p className="text-xs text-texts-secondary mt-1">2 hours ago</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-gradient-to-br from-ui-secondary to-ui-tertiary/5 rounded-3xl p-6 border border-ui-tertiary/10">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <LuClock size={18} className="text-red-400" /> Upcoming Deadlines
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 p-3 rounded-xl bg-ui-main/50 border border-ui-tertiary/5">
                                <div className="w-10 h-10 rounded-lg bg-ui-secondary flex flex-col items-center justify-center text-xs font-bold border border-ui-tertiary/10">
                                    <span className="text-red-400">OCT</span>
                                    <span>28</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-texts-primary">Submit Q3 Report</p>
                                    <p className="text-xs text-texts-secondary">Due by 5:00 PM</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 p-3 rounded-xl bg-ui-main/50 border border-ui-tertiary/5">
                                <div className="w-10 h-10 rounded-lg bg-ui-secondary flex flex-col items-center justify-center text-xs font-bold border border-ui-tertiary/10">
                                    <span className="text-buttons">NOV</span>
                                    <span>02</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-texts-primary">Client Meeting</p>
                                    <p className="text-xs text-texts-secondary">10:00 AM - Zoom</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
};