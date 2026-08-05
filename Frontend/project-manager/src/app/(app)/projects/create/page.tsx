"use client";
import { useState, useRef, ChangeEvent, useEffect, Activity, Suspense } from "react";
import {
  LuCalendar,
  LuPlus,
  LuX,
  LuUpload,
  LuFileText,
  LuImage as ImageIcon,
  LuTrash2,
  LuCircleCheck,
  LuBriefcase,
  LuUsers,
  LuPaperclip,
  LuSave,
  LuChevronDown,
  LuBuilding
} from "react-icons/lu";
import { createNewProject, editProject } from "@/ctaApiLogics/projectGateway";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

import MemberDropDown from "../components/MemberDropDown";
import ProjectStateChangeAnimation from "../components/StateAnimation";

import handleError from "@/utils/handleError";
import { fetchConnectionsList_client, fetchSingleProject_client } from "@/lib/fetchData.client";
import { parseDateForFormInput } from "@/utils/dateTimeFormatter";

import { Project, Task } from "../[id]/page";

// --- Interfaces  ---
export interface ProjectFormData {
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "Completed" | "Cancelled" | "In progress"
}

interface Res {
  success: boolean,
  message: string
  projectID: string,
  isOwner: boolean
}

const CreateProjectContent = () => {
  const { showToastMsg } = useToastMsgContext();

  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1" ? true : false;
  const projectID = searchParams.get("p_id")

  const [creationSuccess, setCreationSuccess] = useState<{ success: boolean, _id: string } | null>(null);
  // --- State ---
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    deadline: "",
    priority: "medium",
    status: "In progress"
  });
  const [originalData, setOriginalData] = useState<Project>()

  const [userConnections, setUserConnections] = useState<partialUserInfo[]>([]);

  // Fetching Connections To Display Them In Member Selection Tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchConnectionsList_client("project");
        setUserConnections(res.members.connections);
      } catch (error) {
        showToastMsg({ text: handleError(error, "axios") as string, type: "error" })
      }
    }
    fetchData();
  }, []);

  const [selectedMembers, setSelectedMembers] = useState<partialUserInfo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<Pick<File, "name" | "size">[]>([]);

  // Task Input State
  const [currentTask, setCurrentTask] = useState<{ title: string; assignedToId: string }>({
    title: "",
    assignedToId: ""
  });

  // UI State for custom dropdowns
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState<boolean>(false);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState<boolean>(false);
  const textInputStyle = "w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-2.5 text-texts-primary text-sm focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all";
  const labelStyle = "text-xs font-bold text-texts-secondary uppercase tracking-wider"

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Project Data If the request if for an editing
  useEffect(() => {
    const getExistingProjectData = async () => {
      try {
        if (!projectID || !isEditMode) return;

        const res = await fetchSingleProject_client(projectID);
        const project = res.project as Project;

        console.log(typeof project.deadline)

        if (!res.isOwner) {
          router.push(`/projects/${projectID}?isInvite=0`);
          return;
        }

        setFormData({
          title: project.title,
          deadline: project.deadline,
          priority: project.priority,
          status: project.status
        })

        setSelectedMembers(project.members);
        setTasks(project.tasks);
        setFiles(project.attachments.map(att => ({
          name: att,
          size: 12313143   //Size will come from backend after uploading to cloudinary
        })));
        setOriginalData(res.project);
      }
      catch (error) {
        showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
      }
    }

    getExistingProjectData();
  }, [isEditMode, projectID]);

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Member Handler
  const toggleMember = (member: partialUserInfo) => {
    if (selectedMembers.find(m => m._id === member._id)) {
      setSelectedMembers(prev => prev.filter(m => m._id !== member._id));
      // Unassign tasks if the member is removed
      setTasks(prev => prev.map(t =>
        t.assignedTo._id === member._id
          ? { ...t, assignedTo: { _id: "", fullname: "" } }
          : t
      ));
    } else {
      setSelectedMembers(prev => [...prev, member]);
    }
    setIsMemberDropdownOpen(false);
  };

  // Task Handlers
  const addTask = () => {
    if (!currentTask.title.trim() || !currentTask.assignedToId) return;

    const assignedUser = selectedMembers.find(m => m._id === currentTask.assignedToId);

    if (!assignedUser) return;

    const newTask: Task = {
      _id: Date.now().toString(),
      title: currentTask.title,
      assignedTo: { _id: assignedUser._id, fullname: assignedUser.fullname },
      status: "In progress"
    };

    setTasks(prev => [...prev, newTask]);
    setCurrentTask({ title: "", assignedToId: "" }); // Reset inputs
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  // File Handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.')[1].toLowerCase() || '';
    if (['jpg', 'png', 'jpeg', 'heic'].includes(ext)) return <ImageIcon size={18} className="text-purple-400" />;
    return <LuFileText size={18} className="text-blue-400" />;
  };

  // Final API Call For Submission
  const router = useRouter()

  const handleSubmit = async () => {
    const mode = isEditMode ? "edit" : "create";

    try {
      const callToActionProject = async () => {
        if (mode == "create") {
          return await createNewProject({ formData, selectedMembers, tasks, files });
        }
        else {
          if (!projectID || !originalData) {
            showToastMsg({ text: "Your access to this page is denied!", type: "error" })
            router.push("/projects")
            return
          }
          return await editProject(originalData, { projectID, formData, selectedMembers, tasks, files })
        }
      }

      const response = await callToActionProject();

      const data = (response?.data as Res);
      if (!data.success) {
        showToastMsg({ text: data.message, type: "error" });
        return;
      }

      setCreationSuccess({ success: true, _id: data.projectID });
    }
    catch (error) {
      showToastMsg({ text: handleError(error, "axios") as string, type: "error" });
    }
  }

  return (
    <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary">
      {
        creationSuccess && creationSuccess.success && <ProjectStateChangeAnimation projectID={creationSuccess._id} state={"success"} />
      }
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Project</h1>
        <p className="text-texts-secondary text-sm">Define the scope, assign the team, and set the timeline.</p>
        <div className="h-0.5 w-full bg-gradient-to-r from-buttons to-transparent mt-6 opacity-50"></div>
      </div>

      {/* Main Content - Flex Column Layout */}
      <div className="flex flex-col gap-8 pb-24">

        {/* 1. Project Settings Card */}
        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg w-full">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
            <LuBriefcase size={20} className="text-buttons" /> Project Essentials
          </h2>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className={labelStyle}>Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Q3 Marketing Campaign"
                className={textInputStyle}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deadline */}
              <div className="space-y-2">
                <label className={labelStyle}>Deadline</label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline.split("T")[0] || ""}
                    min={parseDateForFormInput(new Date())}
                    required
                    onChange={handleInputChange}
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-3 text-texts-primary focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all appearance-none"
                  />
                  <LuCalendar size={18} className="absolute right-4 top-3.5 text-texts-secondary pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className={labelStyle}>Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${formData.priority === p
                        ? p === 'high' ? 'bg-red-500/10 border-red-500 text-red-500'
                          : p === 'medium' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                            : 'bg-green-500/10 border-green-500 text-green-500'
                        : 'bg-ui-main border-ui-tertiary/20 text-texts-secondary hover:border-ui-tertiary/50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-7">
          {/* 2. Members Selection Card */}
          <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
              <LuUsers size={20} className="text-purple-400" /> Team Members
            </h2>

            {/* Dropdown Trigger */}
            <div className="relative mb-4">
              <button
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="w-full flex items-center justify-between bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-3 text-texts-primary hover:border-buttons/50 transition-all text-left"
              >
                <span className={selectedMembers.length === 0 ? "text-texts-secondary" : ""}>
                  {selectedMembers.length > 0 ? "Add more members..." : "Select team members..."}
                </span>
                <LuChevronDown size={18} className={`transition-transform duration-200 ${isMemberDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isMemberDropdownOpen && userConnections && <MemberDropDown toggleMember={toggleMember} selectedMembers={selectedMembers} members={userConnections} />}
            </div>

            {/* Selected Members List */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-texts-secondary uppercase tracking-wider mb-2">Selected ({selectedMembers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <div key={member._id} className="flex items-center gap-2 bg-ui-main border border-ui-tertiary/20 px-2 py-1.5 rounded-lg">
                      <span className="text-sm font-medium">{member.fullname}</span>
                      <button onClick={() => toggleMember(member)} className="p-0.5 rounded hover:bg-red-500/20 text-texts-secondary hover:text-red-500 transition-colors">
                        <LuX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Departments Input */}
          <div className="space-y-2 bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
              <LuBuilding size={20} className="text-purple-400" /> Departments
            </h2>
            <input
              type="text"
              placeholder="e.g. Finances"
              className={textInputStyle}
            />
          </div>
        </div>


        {/* 3. File LuUpload Card */}
        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg w-full">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
            <LuPaperclip size={20} className="text-blue-400" /> Attachments
          </h2>

          <div
            className="border-2 border-dashed border-ui-tertiary/20 rounded-2xl p-8 text-center hover:border-buttons/50 hover:bg-ui-main/30 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-ui-main rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
              <LuUpload size={20} className="text-buttons" />
            </div>
            <p className="text-sm font-medium text-texts-primary mb-1">Click to upload documents</p>
            <p className="text-xs text-texts-secondary">SVG, PNG, JPG or GIF (max. 10MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".jpg,.jpeg,.png,.heic,.pdf,.pptx,.xlsx,.csv,.txt"
              onChange={handleFileChange}
            />
          </div>

          {/* Files List */}
          {<Activity mode={files.length > 0 ? "visible" : "hidden"}>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-ui-main border border-ui-tertiary/10 hover:border-buttons/30 transition-all group">
                  <div className="p-2 rounded-lg bg-ui-secondary">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-texts-primary truncate">{file.name}</p>
                    <p className="text-[10px] text-texts-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1.5 text-texts-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LuX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Activity>
          }
        </div>

        {/* 4. Task Management Tab */}
        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg w-full">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
            <LuCircleCheck size={20} className="text-green-400" /> Tasks & Assignments
          </h2>

          {/* Task Creation Form */}
          <div className="bg-ui-main/50 rounded-xl p-4 border border-ui-tertiary/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

              {/* Input */}
              <div className="md:col-span-7 space-y-2">
                <label className={labelStyle}>Sub-task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Homepage Mockups"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
                  className={textInputStyle}
                />
              </div>

              {/* Assignee Custom Dropdown */}
              <div className="md:col-span-4 space-y-2">
                <label className={labelStyle}>Assign To</label>
                <div className="relative">
                  <button
                    onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-2.5 text-texts-primary text-sm flex items-center justify-between hover:border-buttons/50 transition-all text-left"
                  >
                    <span className={!currentTask.assignedToId ? "text-texts-secondary" : ""}>
                      {currentTask.assignedToId
                        ? selectedMembers.find(m => m._id === currentTask.assignedToId)?.fullname || "Select Member"
                        : "Select Member"
                      }
                    </span>
                    <LuChevronDown size={14} className={`transition-transform duration-200 ${isAssignDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isAssignDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-ui-main border border-ui-tertiary/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                      {selectedMembers.length > 0 ? (
                        selectedMembers.map(m => (
                          <div
                            key={m._id}
                            onClick={() => {
                              setCurrentTask(prev => ({ ...prev, assignedToId: m._id }));
                              setIsAssignDropdownOpen(false);
                            }}
                            className="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-ui-secondary transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-ui-secondary border border-ui-tertiary/20 flex items-center justify-center text-[10px] font-bold">
                              {m.fullname[0]}
                            </div>
                            <span className="text-sm">{m.fullname}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-texts-secondary text-center">
                          Select some members first
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Button */}
              <div className="md:col-span-1">
                <button
                  onClick={addTask}
                  disabled={!currentTask.title || !currentTask.assignedToId}
                  className="w-full h-[42px] bg-buttons text-ui-main rounded-xl flex items-center justify-center hover:bg-buttons/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <LuPlus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-ui-main border border-ui-tertiary/10 hover:border-buttons/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-ui-secondary flex items-center justify-center text-buttons font-bold text-sm">
                      {selectedMembers.find(m => m._id === task.assignedTo._id)?.fullname[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-texts-primary">{task.title}</p>
                      <p className="text-xs text-texts-secondary flex items-center gap-1">
                        Assigned to <span className="text-texts-primary">{selectedMembers.find(m => m._id === task.assignedTo._id)?.fullname}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTask(task._id)}
                    className="p-2 text-texts-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-ui-tertiary/10 rounded-xl text-texts-secondary text-sm">
              No tasks added yet. Add tasks above.
            </div>
          )}
        </div>

      </div>

      {/* Floating Action Bar */}
      {
        !creationSuccess &&
        <div className="fixed bottom-0 right-0 flex flex-row justify-between items-center bg-ui-tertiary/5 bg-opacity-60 backdrop-blur-2xl w-fit p-2 gap-2 rounded-xl z-90">
          <Link className="px-6 py-2.5 rounded-xl border border-ui-tertiary/20 text-texts-secondary font-medium hover:bg-ui-main hover:text-texts-primary transition-colors" href="/home">
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-buttons text-ui-main rounded-xl font-bold hover:bg-buttons/90 hover:shadow-lg hover:shadow-buttons/20 transition-all flex items-center gap-2"
          >
            <LuSave size={18} /> {isEditMode ? "Save Changes" : "Create"}
          </button>
        </div>
      }

    </div>
  );
};

export default function CreateNewProject() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ui-main p-8 ml-55 flex items-center justify-center text-texts-primary font-bold">
        <ProjectStateChangeAnimation state={"loading"} projectID={""} />
      </div>}
    >
      <CreateProjectContent />
    </Suspense>
  );
}