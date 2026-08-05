"use client"
import { useUserContext } from "@/contexts/UserContext";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import api from "@/lib/axios";
import handleError from "@/utils/handleError";
import Link from "next/link";
import { Activity, useEffect, useState } from "react";
import { LuSearch, LuArrowRight } from "react-icons/lu";
import ConnectionsList from "../../../../components/ConnectionsList";

interface userSocialsInterface {
    user: string,
    connections: professionalUserInfo[],
    connectionRequests: professionalUserInfo[]
}

const HomePageSocialsHandling = () => {
    const [userSocials, setUserSocials] = useState<userSocialsInterface | null>(null);
    const [errMessage, setErrMessage] = useState<string | null>(null);
    const { user } = useUserContext();
    const { showToastMsg } = useToastMsgContext();

    useEffect(() => {
        const fetchUserSocials = async () => {
            try {
                const res = await api.get("/socials?view=home", { withCredentials: true });
                setUserSocials(res.data.socials)
            } catch (err) {
                const errToShow = handleError(err, "axios") as string;
                setErrMessage(errToShow);
                showToastMsg({ text: errToShow, type: 'error' });
            }
        };

        fetchUserSocials();
    }, []);

    if (errMessage) {
        // CASE : A - User is not logged in.
        if (!user) {
            return (
                <Link
                    href="/auth"
                    className="group flex flex-col sm:flex-row items-center justify-center gap-3 w-full bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/20 shadow-md"
                >
                    <span className="bg-buttons text-texts-primary font-bold text-lg px-5 py-1.5 rounded-xl shadow-lg transition-colors duration-150 hover:bg-buttons/70 hover:shadow-buttons/10">
                        Login
                    </span>
                    <span className="text-texts-primary font-medium text-lg tracking-wide">
                        to connect with other people!
                        <span
                            className="inline-block ml-1"
                            role="img"
                            aria-label="rocket"
                        >
                            🚀
                        </span>
                    </span>
                </Link>
            )
        } else {
            // CASE : B - Failed to fetch new data.
            return (
                <div className="text-red-500/80 text-lg text-center w-full bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10">
                    {
                        errMessage || "Unable To Fetch Data At The Moment! <br /> Please Try Again Later."
                    }
                </div>
            )
        }
    }

    return (
        userSocials &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">My Connections</h3>
                    <Activity mode={errMessage ? "hidden" : "visible"}>
                        <button className="text-xs text-buttons flex items-center gap-1 hover:underline">
                            Show All <LuArrowRight size={12} />
                        </button>
                    </Activity>
                </div>

                {/* -- Connections List -- */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {
                        userSocials && userSocials.connections.map((connection) =>
                            <ConnectionsList connection={connection} view="home" key={connection._id} />
                        )
                    }
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Connect Search */}
                <div className="bg-gradient-to-br from-ui-secondary to-ui-tertiary/5 backdrop-blur-md rounded-3xl p-6 border border-ui-tertiary/10">
                    <h3 className="font-bold text-lg mb-4">Connect With People</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Alias..."
                            className="w-full bg-ui-main/80 border border-ui-tertiary/20 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-buttons/50 transition-colors"
                        />
                        <button className="absolute right-2 top-2 p-1.5 bg-buttons text-ui-main rounded-lg hover:bg-buttons/90 transition-colors">
                            <LuSearch size={16} />
                        </button>
                    </div>
                </div>

                {/* Requests List */}
                <div className="flex-1 bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-lg mb-4">Requests</h3>
                        <button className="text-xs text-buttons flex items-center gap-1 hover:underline">
                            {/* Create a show request popup that loads all the requests,           --- 054
                            here &&  socials || go to socials directly from here and there show all directly*/}
                            Show All <LuArrowRight size={12} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {
                            userSocials && userSocials.connectionRequests.map((connection) =>
                                <ConnectionsList connection={connection} view={"socials"} key={connection._id} />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageSocialsHandling;