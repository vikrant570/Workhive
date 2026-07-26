"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    LuSearch,
    LuFilter,
    LuUserPlus,
} from "react-icons/lu";

import api from "@/lib/axios";

import ConnectionsList from "@/components/ConnectionsList";
import UserCard from "./components/UserCard";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import handleError from "@/utils/handleError";
import FullContentError from "@/components/global_compns/FullContentError";

// Mocking for now -- To Be Replaced By User Behaviour Based Search 
const suggestions: professionalUserInfo[] = [
    { _id: "201", fullname: "Alice Cooper", username: "@alice_c", workplace: "Spotify", jobTitle: "Backend Dev" },
    { _id: "202", fullname: "Bob Martin", username: "@bob_m", workplace: "Twitter", jobTitle: "DevOps" },
    { _id: "203", fullname: "Charlie Brown", username: "@charlie_b", workplace: "Uber", jobTitle: "Mobile Dev" },
    { _id: "204", fullname: "Diana Prince", username: "@diana_p", workplace: "Oracle", jobTitle: "DB Admin" },
    { _id: "205", fullname: "Evan Wright", username: "@evan_w", workplace: "Salesforce", jobTitle: "Sales Lead" },
];

interface UserSocials {
    user: string,
    connections: professionalUserInfo[],
    connectionRequests: partialUserInfo[],
    blockList: partialUserInfo[]
}

interface Res {
    success: boolean,
    socials: UserSocials
}

interface searchResultException extends professionalUserInfo {
    isConnected: boolean,
    isRequested: boolean
}

const Socials = () => {
    const [UserSocials, setUserSocials] = useState<UserSocials>();
    const [requestsLength, setRequestsLength] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const { showToastMsg } = useToastMsgContext();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<searchResultException[] | null>(null);
    const searchResultRef = useRef<HTMLDivElement>(null);

    // Storing Timer For Sending Call To Backend For Searching User
    const searchCallTimer = useRef<ReturnType<typeof setTimeout>>(null);

    //Local error logic
    const handleErorLocally = (err: any, full: boolean) => {
        const errorMessage = handleError(err, "axios") as string;

        showToastMsg({ text: errorMessage, type: 'error' });
        if (full)
            setError(errorMessage);
    }

    // Fetching Data On Initial Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/socials?view=full", { withCredentials: true });
                setUserSocials((res.data as Res).socials);
                setRequestsLength((res.data as Res).socials.connectionRequests.length);
            } catch (err) {
                handleErorLocally(err as any, true);
            }
        }
        fetchData();
    }, []);

    // Search Results For Typed Usernames (partial & full)
    const searchPeopleToConnect = async () => {
        try {
            const res = await api.get("/socials/search", { params: { searchTerm: searchTerm }, withCredentials: true });
            setSearchResults((res.data.socials));
        } catch (err) {
            handleErorLocally(err as any, false);
        }
    }

    // Search bar typing controller
    useEffect(() => {
        // Clear Previous Timeout First - Won't Send Request If Timeout Was Cleared Before Execution
        if (searchCallTimer.current)
            clearTimeout(searchCallTimer.current);

        // Won't Call Api If Search Term Is Empty
        if (searchTerm.length === 0) {
            setSearchResults(null);
            return;
        }

        searchCallTimer.current = setTimeout(() => {
            searchPeopleToConnect();
        }, 800)
    }, [searchTerm])

    // Clearing Search Results if user click outside of the search box
    const handleglobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (searchResults && !searchResultRef.current?.contains(e.target as Node)) {
            setSearchResults(null);
        }
    }

    if (error !== "") {
        return <FullContentError page="Socials" error={error} />
    }

    return (
        <div className="max-w-screen min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans" onClick={(e) => handleglobalClick(e)}>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Socials</h1>
                <p className="text-texts-secondary text-sm">Connect with colleagues, manage requests, and expand your network.</p>
                <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-6 opacity-50"></div>
            </div>

            {/* 1. Search Bar */}
            <section className="mb-4 bg-gradient-to-br from-ui-secondary to-ui-tertiary/5 p-4 rounded-2xl border-1 border-ui-tertiary/10">
                <h2 className="text-xl font-bold mb-2">Find people to connect</h2>
                <div className="w-full md:w-1/2 flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by name, jobTitle, or company..."
                            className="w-full bg-ui-secondary border border-ui-tertiary/10 rounded-xl py-3 pl-10 pr-4 text-sm text-texts-primary focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <LuSearch size={18} className="absolute left-3 top-3 text-texts-secondary" />
                    </div>
                    <button className="px-4 bg-ui-secondary border border-ui-tertiary/10 rounded-xl text-texts-secondary hover:bg-buttons hover:text-ui-main transition-colors">
                        <LuFilter size={18} />
                    </button>
                </div>
            </section>

            {/* 2. Search Results (All relevant users) */}
            {
                searchResults && searchResults.length != 0 &&
                <section
                    className="max-w-fit absolute p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 z-[999] bg-ui-secondary rounded-2xl shadow-2xl shadow-ui-tertiary/10 border-2 border-ui-tertiary/20"
                    ref={searchResultRef}
                >
                    {
                        searchResults.map((user) => <UserCard key={user._id} user={user} view='searchResults' isConnected={user.isConnected} isRequested={user.isRequested} />)
                    }
                </section>
            }

            {/* 3. My Connections Carousel */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">My Connections</h2>
                    <span className="text-sm text-texts-secondary">{UserSocials?.connections.length} People</span>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-scroll gap-4 pb-4 snap-x scroll-smooth hide-scrollbar">
                    {UserSocials?.connections.map((user) => (
                        <UserCard user={user} key={user._id} view={"connections"} />
                    ))}
                </div>
            </section>

            {/* 4. Requests & Suggestions */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                {/* Column 1: Connection Requests */}
                <div className={`bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-[400px] flex flex-col ${requestsLength !== 0 ? "" : "items-center justify-center text-center"}`}>
                    {
                        requestsLength > 0 ? (
                            <><div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Requests <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full">{requestsLength}</span>
                                </h2>
                                <button className="text-xs text-buttons hover:underline">See All</button>
                            </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                    {/* Dynamic Connections List */}
                                    {UserSocials?.connectionRequests.map((connection) => (
                                        // Prop Exception for
                                        <ConnectionsList connection={connection} view="socials" key={connection._id} setRequestsLength={setRequestsLength} />
                                    ))}
                                </div>
                            </>
                        )
                            :
                            <>
                                <div className="w-20 h-20 bg-ui-main rounded-full flex items-center justify-center mb-5 shadow-2xl shadow-buttons/20 border border-ui-tertiary/5">
                                    <LuUserPlus size={36} className="text-buttons opacity-90" />
                                </div>

                                <h3 className="text-lg font-medium text-texts-primary mb-2">
                                    No Connection Requests Currently
                                </h3>
                                <div className="h-0.5 w-1/2 bg-gradient-to-r from-buttons to-transparent"></div>

                                <p className="text-texts-secondary text-sm max-w-[260px] leading-relaxed mt-2">
                                    When people want to connect and collaborate with you on WorkHive, their requests will appear here.
                                </p>
                            </>
                    }
                </div>

                {/* Column 2: Suggestions */}
                <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Suggestions
                        </h2>
                        <button className="text-xs text-buttons hover:underline">Refresh</button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {suggestions.map((sug) => (
                            <div key={sug._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-ui-main/50 transition-colors border border-transparent hover:border-ui-tertiary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-ui-main flex items-center justify-center text-buttons font-bold border border-ui-tertiary/10">
                                        {sug.fullname[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-texts-primary">{sug.fullname}</p>
                                        <p className="text-[10px] text-texts-secondary">{sug.jobTitle} at {sug.workplace}</p>
                                    </div>
                                </div>
                                <button
                                    className="px-3 py-1.5 rounded-lg bg-ui-main border border-ui-tertiary/20 text-xs font-bold text-texts-primary hover:bg-buttons hover:text-ui-main hover:border-buttons transition-all flex items-center gap-1"
                                // onClick={() => { socialActionsHandle("request", sug._id, setErrToastMs, setReqSent) }}  --- uncomment when suggestions are functional 054 
                                >
                                    <LuUserPlus size={14} /> Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
            {
                UserSocials?.blockList && UserSocials.blockList.length > 0 &&
                <section className="bg-gradient-to-tl  from-ui-tertiary/5 to-buttons/5 rounded-3xl p-5 border border-ui-tertiary/10">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        BlockList
                    </h2>
                    <div className="flex flex-row flex-wrap max-w-fit items-center justify-start gap-3">
                        {UserSocials.blockList.map((user) => (
                            <UserCard user={user} view="blockList" key={user._id} />
                        ))}
                    </div>
                </section>
            }
        </div >
    );
};

export default Socials;
