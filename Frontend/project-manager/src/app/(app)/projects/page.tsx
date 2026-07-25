import { fetchProjectsList_server } from "@/lib/fetchData.server";
import ProjectsList from "../../../components/ProjectsList";
import { Suspense } from "react";
import { CgSpinner } from "react-icons/cg";

export default async function MyProjectsList() {
    const setProjectsJSX = async () => {
        try {
            const data = await fetchProjectsList_server("full");
            if (!data.success)
                throw new Error("Failed To Fetch Data !")

            return <ProjectsList projects={data?.projects} />;
        } catch (error) {
            return <div className="text-alerts text-lg m-auto mt-20 w-full font-semibold">Unable To Fetch Data At The Moment! <br /> Please Try Again Later.</div>
        }
    }

    return (
        <div className="bg-ui-main min-h-screen p-8 ml-55 text-texts-primary">
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-texts-secondary text-sm mt-1">Projects in which you are member</p>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-buttons to-transparent mt-2"></div>
            </div>
            <Suspense fallback={<CgSpinner size={25} className="m-auto mt-10 animate-spin" />}>
                {setProjectsJSX()}
            </Suspense>
        </div>
    )
}