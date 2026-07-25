"use client";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
   LuCalendar, LuCircle, LuCircleAlert, LuCircleCheck,
   LuClock, LuEllipsisVertical, LuFileText, LuFlag,
   LuImage, LuPaperclip, LuPlus, LuSave, LuUpload,
   LuUser, LuUsers, LuX
} from "react-icons/lu";

import api from "@/lib/axios";
import handleError from "@/utils/handleError";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";
import { fetchSingleProject_client } from "@/lib/fetchData.client";
import ConnectionsList from "@/components/ConnectionsList";
import FullContentError from "@/components/global_compns/FullContentError";

// Interfaces
interface Task {
   title: string;
   assignedTo: {
      _id?: string;
      fullname: string;
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
   createdAt: Date | string;
   deadline: Date | string;
   priority: "high" | "medium" | "low";
   members: Member[];
   tasks: Task[];
   attachments: string[];
   status: string;
   progress: number;
   inviteStatus?: 'Pending' | 'Accepted' | 'Rejected' | 'Expired'
}
interface NextApiRes {
   success: boolean,
   project?: Project,
   message?: string
}
interface EditableTask extends Task {
   tempId: number;
}

interface ProjectFormData {
   title: string;
   owner: {
      fullname: string;
      username: string;
   };
   createdAt: string;
   deadline: string;
   priority: "high" | "medium" | "low";
   members: Member[];
   tasks: EditableTask[];
   attachments: string[];
   status: string;
   progress: number;
}

// Converts API dates into the yyyy-mm-dd format required by date inputs.
const dateToInput = (date: Date | string) => {
   if (!date) return "";
   return new Date(date).toISOString().split("T")[0];
};

// 054 Prepare it for empty data (because its a patch request )
// Builds the editable state object from project data or safe empty defaults.
const buildFormData = (project?: Project): ProjectFormData => ({
   title: project?.title || "",
   owner: {
      fullname: project?.owner?.fullname || "",
      username: project?.owner?.username || "",
   },
   createdAt: dateToInput(project?.createdAt || new Date()),
   deadline: dateToInput(project?.deadline || new Date()),
   priority: project?.priority || "medium",
   members: project?.members || [],
   tasks: project?.tasks.map((task, i) => ({
      ...task,
      tempId: Date.now() + i
   })) || [],
   attachments: project?.attachments || [],
   status: project?.status || "In Progress",
   progress: project?.progress || 0,
});

// Returns the small colored status pill used beside every task row.
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

// Picks a visual icon based on the file extension shown in attachments.
const getAttachmentIcon = (filename: string) => {
   const ext = filename.split('.').pop()?.toLowerCase() || '';
   if (['jpg', 'png', 'jpeg', 'gif', 'heic'].includes(ext)) return <LuImage size={18} className="text-purple-400" />;
   if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return <LuFileText size={18} className="text-blue-400" />;
   return <LuPaperclip size={18} className="text-texts-secondary" />;
};

// Main edit screen. It can use a passed project prop or fetch by route id.
export const EditProjectForm = () => {
   const [project, setProject] = useState<Project>();

   const router = useRouter();
   const params = useParams<{ id: string }>();
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { showToastMsg } = useToastMsgContext();

   const [error, setError] = useState<string>("");
   const projectID = params?.id;

   // Hydrates the form either from the prop or from the route fallback fetch.
   useEffect(() => {
      try {
         const fetchProject = async () => {
            const response = await fetchSingleProject_client(params.id);
            if (response && response.success) {
               setProject((response as NextApiRes)?.project);
            }
         }

         fetchProject();
      } catch (err) {
         setError(handleError(err, "axios") as string);
      }
   }, [params?.id]);

   if (error !== "") {
      return <FullContentError error={error} page={"Project"} />
   }

   const [formData, setFormData] = useState<ProjectFormData>(buildFormData(project));

   // Re-Build Form Data On Multiple Renders
   useEffect(() => {
      if (project) {
         setFormData(buildFormData(project));
      }
   }, [project]);

   const [originalData, setOriginalData] = useState<ProjectFormData>(buildFormData(project));
   const [files, setFiles] = useState<File[]>([]);
   const [openTaskMenu, setOpenTaskMenu] = useState<number | null>(null);
   const [isSaving, setIsSaving] = useState<boolean>(false);


   // Snapshot comparison keeps the Save button disabled until something changes.
   const currentSnapshot = useMemo(() => JSON.stringify(formData), [formData]);
   const originalSnapshot = useMemo(() => JSON.stringify(originalData), [originalData]);
   const hasChanges = currentSnapshot !== originalSnapshot || files.length > 0;

   // Empty hook for custom video-upload error handling.
   const handleVideoUploadError = () => {

   }

   // Checks both mime type and extension because some browsers omit file.type.
   const isVideoFile = (file: File) => {
      const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return file.type.startsWith("video/") || videoExtensions.includes(ext);
   }

   // Adds only accepted files and rejects videos before they reach state.
   const addFiles = (incomingFiles: File[]) => {
      const acceptedFiles = incomingFiles.filter(file => {
         if (isVideoFile(file)) {
            handleVideoUploadError();
            return false;
         }
         return true;
      });

      setFiles(prev => [...prev, ...acceptedFiles]);
   };

   // Handles normal file picker uploads.
   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(Array.from(e.target.files));
      e.target.value = "";
   };

   // Handles drag-and-drop uploads on the attachments box.
   const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer.files));
   };

   // Removes newly selected files before they are saved.
   const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
   };

   // Removes already saved attachments from the outgoing attachments list.
   const removeExistingAttachment = (index: number) => {
      setFormData(prev => ({
         ...prev,
         attachments: prev.attachments.filter((_, i) => i !== index)
      }));
   };

   // Updates editable task fields while preserving the rest of the task object.
   const updateTask = (taskId: number, key: "title" | "status", value: string) => {
      setFormData(prev => ({
         ...prev,
         tasks: prev.tasks.map(task => task.tempId === taskId ? { ...task, [key]: value } : task)
      }));
   };

   // Updates only the displayed assignee name inside a task.
   const updateTaskAssignee = (taskId: number, fullname: string) => {
      setFormData(prev => ({
         ...prev,
         tasks: prev.tasks.map(task => task.tempId === taskId ? {
            ...task,
            assignedTo: { ...task.assignedTo, fullname }
         } : task)
      }));
   };

   // Placeholder action for the task dropdown's report request.
   const handleAskReport = (task: EditableTask) => {
      void task;
      setOpenTaskMenu(null);
   };

   // Marks a task as cancelled from the dropdown action.
   const handleAbandonTask = (taskId: number) => {
      updateTask(taskId, "status", "Cancelled");
      setOpenTaskMenu(null);
   };

   // Aggregates all edited sections and sends the update request.
   const handleSave = async () => {
      if (!hasChanges || isSaving) return;

      try {
         setIsSaving(true);

         // Mirrors createProject's final payload shape, with existing and new files split.
         const projectData = {
            title: formData.title,
            owner: formData.owner,
            createdAt: new Date(formData.createdAt),
            deadline: new Date(formData.deadline),
            priority: formData.priority,
            status: formData.status,
            progress: formData.progress,
            tasks: formData.tasks.map((t) => ({
               title: t.title,
               assignedTo: t.assignedTo,
               status: t.status,
            })),
            members: formData.members,
            attachments: formData.attachments,
            newAttachments: files
         }

         if (!projectData.title || !projectData.members || !projectData.priority || !projectData.deadline || !projectData.tasks) {
            throw new Error("incomplete");
         }

         const response = await api.patch(`/projects/${projectID}`, projectData, { withCredentials: true });
         if (!response || !response.data.success) throw new Error("Server Isn't Responding! Try Later.");

         setOriginalData(formData);
         setFiles([]);
         router.refresh();
      } catch (error: any) {
         if (error.message === "incomplete") {
            showToastMsg({ text: "Please fill out all required fields !", type: 'error' });
         } else {
            showToastMsg({ text: handleError(error, "axios") as string, type: 'error' });
         }
      } finally {
         setIsSaving(false);
      }
   }


   return (
      <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary font-sans relative">
         <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`absolute top-12 right-8 px-4 py-2 rounded-xl text-md font-bold transition-colors shadow-lg flex items-center gap-2 z-20 ${hasChanges && !isSaving
               ? "bg-buttons text-ui-main hover:bg-buttons/90 shadow-buttons/20 cursor-pointer"
               : "bg-ui-tertiary/20 text-texts-secondary cursor-not-allowed"
               }`}
         >
            <LuSave size={18} /> Save Changes
         </button>

         {/* 1. Header Section */}
         <div className="mb-8 pr-44">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="w-full max-w-xl">
                  <input
                     type="text"
                     value={formData.title}
                     onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                     className="w-full bg-transparent text-3xl font-bold tracking-tight mb-2 focus:outline-none focus:text-buttons transition-colors"
                  />
                  <div className="flex items-center gap-3 text-sm text-texts-secondary">
                     <div className="grid grid-cols-3 gap-2">
                        {(['high', 'medium', 'low'] as const).map((p) => (
                           <button
                              key={p}
                              onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                              className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-all ${formData.priority === p
                                 ? p === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' : p === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                                 : 'bg-ui-secondary text-texts-secondary border-ui-tertiary/10 hover:border-buttons/40'
                                 }`}
                           >
                              {p}
                           </button>
                        ))}
                     </div>
                     <span className="w-1 h-1 rounded-full bg-ui-tertiary/50"></span>
                     <span>ID: #{projectID.slice(17, 23)}</span>
                  </div>
               </div>
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-6 opacity-50"></div>
         </div>


         {/* 2. Key Metrics Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Owner Card - Non Editable */}
            <div className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-ui-main border border-ui-tertiary/20 flex items-center justify-center text-lg font-bold text-texts-primary">
                  {project?.owner.fullname[0]}
               </div>
               <div>
                  <p className="text-base font-bold text-texts-primary">{project?.owner.fullname}</p>
                  <p className="text-xs text-texts-secondary tracking-wider font-semibold">{project?.owner.username}</p>
               </div>
            </div>

            <div className="bg-ui-secondary p-5 rounded-2xl border border-ui-tertiary/10 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-texts-secondary uppercase tracking-wider font-semibold flex items-center gap-1">
                     <LuCalendar size={12} /> Timeline
                  </p>
                  <span className="text-xs font-mono text-buttons bg-buttons/10 px-1.5 py-0.5 rounded">Editable</span>
               </div>
               <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center text-sm font-medium">
                  <input
                     type="date"
                     value={formData.createdAt}
                     onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value }))}
                     className="min-w-0 bg-ui-main/70 border border-ui-tertiary/10 rounded-lg px-2 py-1.5 text-texts-primary focus:outline-none focus:border-buttons"
                  />
                  <span className="text-texts-secondary">to</span>
                  <input
                     type="date"
                     value={formData.deadline}
                     onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                     className="min-w-0 bg-ui-main/70 border border-ui-tertiary/10 rounded-lg px-2 py-1.5 text-texts-important focus:outline-none focus:border-buttons"
                  />
               </div>
            </div>

            {/* Progress Card - 054 - Dynamically Caluclated */}
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
            <div className="lg:col-span-2 h-full">
               <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                     <h2 className="text-xl font-bold flex items-center gap-2">
                        <LuCircleCheck size={20} className="text-buttons" /> Project Tasks
                     </h2>
                     <span className="bg-ui-main text-xs font-bold px-2 py-1 rounded-md text-texts-secondary border border-ui-tertiary/10">
                        {formData.tasks.length} Total
                     </span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                     {formData.tasks.map((task) => (
                        <div key={task.tempId} className={`p-4 rounded-2xl border transition-colors flex items-center justify-between group ${task.status === 'Cancelled' ? 'bg-ui-main/30 border-transparent opacity-80' : 'bg-ui-main border-ui-tertiary/5 hover:border-buttons/30'
                           }`}>
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-ui-tertiary'}`}></div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-w-0">
                                 <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => updateTask(task.tempId, "title", e.target.value)}
                                    className={`w-full bg-ui-secondary/60 border border-ui-tertiary/10 rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-buttons ${task.status === 'Cancelled' ? 'line-through text-texts-secondary' : 'text-texts-primary'}`}
                                 />
                                 <div className="relative">
                                    <LuUser size={10} className="absolute left-3 top-3 text-texts-secondary" />
                                    <input
                                       type="text"
                                       value={task.assignedTo.fullname}
                                       onChange={(e) => updateTaskAssignee(task.tempId, e.target.value)}
                                       className="w-full bg-ui-secondary/60 border border-ui-tertiary/10 rounded-lg pl-7 pr-3 py-2 text-xs text-texts-secondary focus:outline-none focus:border-buttons"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 pl-4">
                              <select
                                 value={task.status}
                                 onChange={(e) => updateTask(task.tempId, "status", e.target.value)}
                                 className="bg-transparent focus:outline-none"
                              >
                                 <option className="bg-ui-main" value="Pending">Pending</option>
                                 <option className="bg-ui-main" value="In Progress">In Progress</option>
                                 <option className="bg-ui-main" value="Completed">Completed</option>
                                 <option className="bg-ui-main" value="Cancelled">Cancelled</option>
                              </select>
                              {getStatusBadge(task.status)}
                              <div className="relative">
                                 <button
                                    onClick={() => setOpenTaskMenu(openTaskMenu === task.tempId ? null : task.tempId)}
                                    className="p-1 text-texts-secondary hover:text-texts-primary hover:bg-ui-secondary rounded transition-colors opacity-0 group-hover:opacity-100"
                                 >
                                    <LuEllipsisVertical size={16} />
                                 </button>
                                 {openTaskMenu === task.tempId && (
                                    <div className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-ui-main border border-ui-tertiary/20 shadow-xl z-30 overflow-hidden">
                                       <button
                                          onClick={() => handleAskReport(task)}
                                          className="w-full text-left px-3 py-2 text-xs text-texts-primary hover:bg-ui-secondary transition-colors"
                                       >
                                          Ask report
                                       </button>
                                       <button
                                          onClick={() => handleAbandonTask(task.tempId)}
                                          className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                                       >
                                          Abandon task
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-1 h-full">
               <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 h-full flex flex-col">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 shrink-0">
                     <LuUsers size={20} className="text-purple-400" /> Team Members
                  </h2>
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                     {formData.members.map((member) => (
                        <ConnectionsList connection={member} view='edit_project' key={member._id} />
                     ))}
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
               </div>

               <div
                  className="border-2 border-dashed border-ui-tertiary/20 rounded-2xl p-8 text-center hover:border-buttons/50 hover:bg-ui-main/30 transition-all cursor-pointer group mb-6"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
               >
                  <div className="w-12 h-12 bg-ui-main rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                     <LuUpload size={20} className="text-buttons" />
                  </div>
                  <p className="text-sm font-medium text-texts-primary mb-1">Click or drag files to upload documents</p>
                  <p className="text-xs text-texts-secondary">Images, PDFs, docs, sheets and text files only</p>
                  <input
                     type="file"
                     ref={fileInputRef}
                     className="hidden"
                     multiple
                     accept=".jpg,.jpeg,.png,.heic,.gif,.pdf,.doc,.docx,.pptx,.xlsx,.csv,.txt"
                     onChange={handleFileChange}
                  />
               </div>

               {formData.attachments.length === 0 && files.length === 0 ? (
                  <p className="text-sm text-texts-secondary italic">No attachments added yet.</p>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                     {formData.attachments.map((file, i) => (
                        <div key={`${file}-${i}`} className="relative flex items-center gap-3 p-3 rounded-xl bg-ui-main/50 border border-ui-tertiary/5 hover:bg-ui-main hover:border-buttons/20 transition-all group">
                           <button
                              onClick={() => removeExistingAttachment(i)}
                              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <LuX size={12} />
                           </button>
                           <div className="p-2 rounded-lg bg-ui-secondary text-texts-secondary group-hover:text-buttons transition-colors">
                              {getAttachmentIcon(file)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-medium text-texts-primary truncate">{file}</p>
                              <p className="text-[10px] text-texts-secondary">Existing file</p>
                           </div>
                        </div>
                     ))}

                     {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative flex items-center gap-3 p-3 rounded-xl bg-ui-main border border-ui-tertiary/10 hover:border-buttons/30 transition-all group">
                           <button
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <LuX size={12} />
                           </button>
                           <div className="p-2 rounded-lg bg-ui-secondary">
                              {getAttachmentIcon(file.name)}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-medium text-texts-primary truncate">{file.name}</p>
                              <p className="text-[10px] text-texts-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                        </div>
                     ))}

                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-ui-main/50 border border-dashed border-ui-tertiary/20 text-sm text-texts-secondary hover:text-buttons hover:border-buttons/40 transition-all"
                     >
                        <LuPlus size={16} /> Add more files
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
};

export default EditProjectForm;
