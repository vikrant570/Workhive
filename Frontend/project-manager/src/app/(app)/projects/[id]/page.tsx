import {
   LuCalendar, LuCircle, LuCircleAlert, LuCircleCheck,
   LuClock, LuDownload, LuEllipsisVertical, LuFileText,
   LuFlag, LuImage, LuPaperclip, LuUser, LuUsers, LuPencilLine
} from "react-icons/lu";

//Imports 
import { parseDate } from "@/utils/dateTimeFormatter";
import ConnectionsList from "@/components/ConnectionsList";
import { fetchSingleProject_server } from "@/lib/fetchData.server";
import CtaProjectBtn from "@/app/(app)/projects/components/CtaProjectBtn";
import FullContentError from "@/components/global_compns/FullContentError";

// Interfaces
interface Task {
   title: string;
   assignedTo: {
      fullname: string
   }
   status: string;
}
interface Member {
   _id: string,
   fullname: string;
   username: string;
}
interface Project {
   _id: string;
   title: string;
   owner: {
      fullname: string,
      username: string
   },
   createdAt: Date;
   deadline: Date;
   priority: string;
   members: Member[];
   tasks: Task[];
   attachments: string[];
   status: string;
   progress: number;
   inviteStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Expired'
}
interface NextApiRes {
   success: boolean,
   project?: Project,
   message?: string
}

// --- Helper Functions ---

// 1. Status Badge Helper
const getStatusBadge = (status: string) => {
   switch (status.toLowerCase()) {
      case "completed":
         return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
               <LuCircleCheck size={12} /> Completed
            </span>
         );
      case "in progress":
         return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
               <LuClock size={12} /> In Progress
            </span>
         );
      case "cancelled":
         return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
               <LuCircleAlert size={12} /> Cancelled
            </span>
         );
      default:
         return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-ui-tertiary/10 text-texts-secondary border border-ui-tertiary/20">
               <LuCircle size={12} /> Pending
            </span>
         );
   }
};

// 2. Attachment Icon Helper
const getAttachmentIcon = (filename: string) => {
   const ext = filename!.split('.')[1].toLowerCase();
   if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) return <LuImage size={18} className="text-purple-400" />;
   if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return <LuFileText size={18} className="text-blue-400" />;
   return <LuPaperclip size={18} className="text-texts-secondary" />;
};

export default async function ProjectDisplay({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ isOwner: string, isInvite?: string }> }) {
   const { id } = await params;
   const { isOwner, isInvite } = await searchParams;

   let project: Project;

   const data: NextApiRes = await fetchSingleProject_server(id);

   // Accept Project Invite --
   const acceptProjectInvite = async () => {

   }

   if (data.success && data.project) {
      project = data.project;
   } else {
      return <FullContentError page="Project" error={data.message || "An Unknown error Occured !"} />
   }

   return (
      <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans">
         {/* 1. Header Section */}
         <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               {/* -- Page Header -- */}
               <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">{project?.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-texts-secondary">
                     <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${project?.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        project?.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                           'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                        {project?.priority} Priority
                     </span>
                     <span className="w-1 h-1 rounded-full bg-ui-tertiary/50"></span>
                     <span>ID: #{project._id.slice(17, 23)}</span>
                  </div>
               </div>

               {/* -- Call To Action Button - (Edit / Accpet / Null) -- */}
               <CtaProjectBtn isOwner={isOwner || ""} isInvite={isInvite || ""} projectId={id} />

            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-6 opacity-50"></div>
         </div>

         {/* 2. Key Metrics Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Owner Card */}
            <div className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-ui-main border border-ui-tertiary/20 flex items-center justify-center text-lg font-bold text-texts-primary">
                  {project?.owner.fullname[0]}
               </div>
               <div>
                  <p className="text-base font-bold text-texts-primary">{project?.owner.fullname}</p>
                  <p className="text-xs text-texts-secondary tracking-wider font-semibold">{project?.owner.username}</p>
               </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-texts-secondary uppercase tracking-wider font-semibold flex items-center gap-1">
                     <LuCalendar size={12} /> Timeline
                  </p>
                  <span className="text-xs font-mono text-buttons bg-buttons/10 px-1.5 py-0.5 rounded">3 Days Left</span>
               </div>
               <div className="flex justify-between text-sm font-medium">
                  <span>{parseDate(new Date(project?.createdAt))}</span>
                  <span className="text-texts-secondary">→</span>
                  <span className="text-texts-important">{parseDate(new Date(project?.deadline))}</span>
               </div>
            </div>

            {/* Progress Card */}
            <div className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-texts-secondary uppercase tracking-wider font-semibold flex items-center gap-1">
                     <LuFlag size={12} /> Overall Progress
                  </p>
                  <span className="text-lg font-bold text-buttons">{project?.progress}%</span>
               </div>
               <div className="w-full h-2 rounded-full bg-ui-main overflow-hidden">
                  <div
                     className="h-full rounded-full bg-gradient-to-r from-buttons to-indigo-500 transition-all duration-1000 ease-out"
                     style={{ width: `${project?.progress}%` }}
                  ></div>
               </div>
            </div>
         </div>

         {/* 3. Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* Left Column: Tasks (Spans 2 cols) */}
            <div className="lg:col-span-2 h-full">
               <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                     <h2 className="text-xl font-bold flex items-center gap-2">
                        <LuCircleCheck size={20} className="text-buttons" /> Project Tasks
                     </h2>
                     <span className="bg-ui-main text-xs font-bold px-2 py-1 rounded-md text-texts-secondary border border-ui-tertiary/10">
                        {project?.tasks.length} Total
                     </span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                     {project?.tasks.map((task, i) => (
                        <div key={i} className={`p-4 rounded-2xl border transition-colors flex items-center justify-between group ${task.status === 'Cancelled' ? 'bg-ui-main/30 border-transparent opacity-60' : 'bg-ui-main border-ui-tertiary/5 hover:border-buttons/30'
                           }`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-ui-tertiary'}`}></div>
                              <div>
                                 <p className={`font-medium ${task.status === 'Cancelled' ? 'line-through text-texts-secondary' : 'text-texts-primary'}`}>
                                    {task.title}
                                 </p>
                                 <p className="text-xs text-texts-secondary flex items-center gap-1 mt-0.5">
                                    <LuUser size={10} /> {task.assignedTo.fullname}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              {getStatusBadge(task.status)}
                              <button className="p-1 text-texts-secondary hover:text-texts-primary hover:bg-ui-secondary rounded transition-colors opacity-0 group-hover:opacity-100">
                                 <LuEllipsisVertical size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Column: Members (Now Full Height of Row) */}
            <div className="lg:col-span-1 h-full">

               {/* Team Members */}
               <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-full flex flex-col">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 shrink-0">
                     <LuUsers size={20} className="text-purple-400" /> Team Members
                  </h2>
                  {/* Added max-h-[400px] to match tasks tab height limit and overflow-y-auto for scrolling */}
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                     {/* Dynamic Connections List */}
                     {project.members.map(((connection) => (
                        <ConnectionsList connection={connection} view='project_view' key={connection._id} />
                     )))}
                  </div>
               </div>

            </div>

         </div>

         {/* 4. Bottom Section: Attachments */}
         <div className="w-full">
            <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                     <LuPaperclip size={20} className="text-blue-400" /> Attachments
                  </h2>
                  {project?.attachments && project?.attachments.length > 0 && (
                     <button className="text-xs text-buttons hover:underline">Download All</button>
                  )}
               </div>

               {project?.attachments.length === 0 ? (
                  <p className="text-sm text-texts-secondary italic">No attachments added yet.</p>
               ) : (
                  <div className="flex flex-row flex-wrap gap-3">
                     {project?.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-ui-main/50 border border-ui-tertiary/5 hover:bg-ui-main hover:border-buttons/20 transition-all cursor-pointer group">
                           <div className="p-2 rounded-lg bg-ui-secondary text-texts-secondary group-hover:text-buttons transition-colors">
                              {getAttachmentIcon(file)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-medium text-texts-primary truncate">{file}</p>
                              <p className="text-[10px] text-texts-secondary">2.4 MB</p>
                           </div>
                           <button className="p-1.5 text-texts-secondary hover:text-buttons transition-colors">
                              <LuDownload size={14} />
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
};