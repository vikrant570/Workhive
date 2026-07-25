"use client";
import { useState, useRef, ChangeEvent, useEffect, Activity } from "react";
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
  LuChevronDown
} from "react-icons/lu";
import { createNewProject } from "@/ctaApiLogics/projectGateway";

import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import handleError from "@/utils/handleError";
import { useToastMsgContext } from "@/contexts/ToastMsgContext";

// --- Interfaces  ---

interface User {
  _id: string;
  fullname: string;
  username?: string; // Optional for UI display,
}
interface Task {
  title: string;
  assignedTo: string;
}
// Extended Task interface for Frontend State (needs unique ID for rendering lists)
interface LocalTask extends Task {
  tempId: number;
  status: string; // UI specific
}
interface ProjectFormData {
  title: string;
  deadline: string; // Keeping as string for Input type='date', converted to Date on submit if needed
  priority: "high" | "medium" | "low";
}
interface Res {
  success: boolean,
  projectID: string,
  isOwner: boolean
}

const CreateNewProject = () => {
  const [error, setError] = useState<string>("");
  const { showToastMsg } = useToastMsgContext();

  const [creationSuccess, setCreationSuccess] = useState<boolean>(false);
  // --- State ---
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    deadline: "",
    priority: "medium",
  });
  const [userConnections, setUserConnections] = useState<User[]>([]);

  // Fetching Connections To Display Them In Member Selection Tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/socials?view=project", { withCredentials: true });
        setUserConnections(res.data.connectionsList.connections);
      } catch (error) {
        if (axios.isAxiosError(error)) setError(error.response?.data.message || "Server Not Responding !")
        else setError("Something Went Wrong !")
      }
    }
    fetchData();
  }, []);

  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<LocalTask[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  // Task Input State
  const [currentTask, setCurrentTask] = useState<{ title: string; assignedToId: string }>({
    title: "",
    assignedToId: ""
  });

  // UI State for custom dropdowns
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState<boolean>(false);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Member Handlers
  const toggleMember = (user: User) => {
    if (selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers(prev => prev.filter(m => m._id !== user._id));
      // Unassign tasks if the member is removed
      setTasks(prev => prev.map(t =>
        t.assignedTo === user._id
          ? { ...t, assignedTo: "" }
          : t
      ));
    } else {
      setSelectedMembers(prev => [...prev, user]);
    }
    setIsMemberDropdownOpen(false);
  };

  const removeMember = (userId: string) => {
    setSelectedMembers(prev => prev.filter(m => m._id !== userId));
  };

  // Task Handlers
  const addTask = () => {
    if (!currentTask.title.trim() || !currentTask.assignedToId) return;

    const assignedUser = selectedMembers.find(m => m._id === currentTask.assignedToId);

    if (!assignedUser) return;

    const newTask: LocalTask = {
      tempId: Date.now(),
      title: currentTask.title,
      assignedTo: assignedUser._id,
      status: "In progress"
    };

    setTasks(prev => [...prev, newTask]);
    setCurrentTask({ title: "", assignedToId: "" }); // Reset inputs
  };

  const removeTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.tempId !== taskId));
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
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      // Create The Project 
      const response = await createNewProject(formData, selectedMembers, tasks, files);
      const data = (response?.data as Res);

      setCreationSuccess(data.success);
      setTimeout(() => { router.push(`/projects/${data?.projectID}?isOwner=1&isInvite=0`) }, 2500);

    } catch (error: any) {
      if (error.message === "incomplete") {
        showToastMsg({ text: "Please fill out all required fields !", type: 'error' });
      } else {
        setError(handleError(error, "axios") as string)
      }
      return;
    }
  }

  if (error !== "") throw new Error(error)

  return (
    <div className="min-h-screen bg-ui-main p-8 ml-55 text-texts-primary">
      {
        <Activity mode={creationSuccess ? "visible" : "hidden"}>
          <dialog
            open
            className="fixed m-auto rounded-3xl bg-ui-main border-2 border-buttons/20 z-50 top-80 animate-fade-in-pop"
          >
            <div className="flex items-center gap-3 p-6 bg-gradient-to-br from-ui-tertiary/10 to-buttons/10 rounded-3xl">
              <div className="w-8 h-8 rounded-lg  flex items-center justify-center text-xs font-bold">
                <LuCircleCheck size={50} className="text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-texts-primary">Project Created Successfully.</p>
                <p className="text-md text-texts-secondary ">Redirecting.</p>
              </div>
            </div>
          </dialog>
        </Activity>
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
              <label className="text-xs font-bold text-texts-secondary uppercase tracking-wider">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Q3 Marketing Campaign"
                className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-3 text-texts-primary focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-texts-secondary uppercase tracking-wider">Deadline</label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-3 text-texts-primary focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all appearance-none"
                  />
                  <LuCalendar size={18} className="absolute right-4 top-3.5 text-texts-secondary pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-texts-secondary uppercase tracking-wider">Priority</label>
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

        {/* 2. Members Selection Card */}
        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg w-full">
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
            {isMemberDropdownOpen && userConnections && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-ui-main border border-ui-tertiary/20 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                {userConnections.map(user => {
                  const isSelected = selectedMembers.some(m => m._id === user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => toggleMember(user)}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-ui-secondary transition-colors ${isSelected ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ui-secondary border border-ui-tertiary/20 flex items-center justify-center text-xs font-bold">
                          {user.fullname[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.fullname}</p>
                          <p className="text-[10px] text-texts-secondary">{user.username}</p>
                        </div>
                      </div>
                      {isSelected && <LuCircleCheck size={16} className="text-green-500" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Members List */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-texts-secondary uppercase tracking-wider mb-2">Selected ({selectedMembers.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(member => (
                  <div key={member._id} className="flex items-center gap-2 bg-ui-main border border-ui-tertiary/20 pl-2 pr-1 py-1 rounded-lg">
                    <span className="text-xs font-medium">{member.fullname}</span>
                    <button onClick={() => removeMember(member._id)} className="p-0.5 rounded hover:bg-red-500/20 text-texts-secondary hover:text-red-500 transition-colors">
                      <LuX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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

        {/* 4. Task Management Card (Last & Expandable) */}
        <div className="bg-ui-secondary rounded-3xl p-6 border border-ui-tertiary/10 shadow-lg w-full">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-texts-primary">
            <LuCircleCheck size={20} className="text-green-400" /> Tasks & Assignments
          </h2>

          {/* Task Creation Form */}
          <div className="bg-ui-main/50 rounded-xl p-4 border border-ui-tertiary/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

              {/* Input */}
              <div className="md:col-span-7 space-y-2">
                <label className="text-xs font-bold text-texts-secondary uppercase tracking-wider">Sub-task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Homepage Mockups"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-ui-main border border-ui-tertiary/20 rounded-xl px-4 py-2.5 text-texts-primary text-sm focus:outline-none focus:border-buttons focus:ring-1 focus:ring-buttons transition-all"
                />
              </div>

              {/* Assignee Custom Dropdown */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-bold text-texts-secondary uppercase tracking-wider">Assign To</label>
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
                          Select team members first
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
                <div key={task.tempId} className="flex items-center justify-between p-3 rounded-xl bg-ui-main border border-ui-tertiary/10 hover:border-buttons/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-ui-secondary flex items-center justify-center text-buttons font-bold text-sm">
                      {selectedMembers.find(m => m._id === task.assignedTo)?.fullname[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-texts-primary">{task.title}</p>
                      <p className="text-xs text-texts-secondary flex items-center gap-1">
                        Assigned to <span className="text-texts-primary">{selectedMembers.find(m => m._id === task.assignedTo)?.fullname}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTask(task.tempId)}
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
      <div className="fixed bottom-0 left-0 right-0 bg-ui-secondary/80 backdrop-blur-md border-t border-ui-tertiary/10 p-4 ml-50 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-end gap-4">
          <Link className="px-6 py-2.5 rounded-xl border border-ui-tertiary/20 text-texts-secondary font-medium hover:bg-ui-main hover:text-texts-primary transition-colors" href="/">
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-buttons text-ui-main rounded-xl font-bold hover:bg-buttons/90 hover:shadow-lg hover:shadow-buttons/20 transition-all flex items-center gap-2"
          >
            <LuSave size={18} /> Create Project
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateNewProject;