import api from "@/lib/axios";
import { inviteMembers, socket, socketRes } from "./chatGateway";
import { Task, Project } from "@/app/(app)/projects/[id]/page";
import { ProjectFormData } from "@/app/(app)/projects/create/page";

// Define types for arguments
const commonErrors = (data: any) => {
  if (data.tasks?.length === 0) throw new Error("You can't initiate a project with no tasks!");
  if (data.tasks && (data.tasks as Task[]).filter(task => task.assignedTo._id === "").length > 0) throw new Error("There are some unassigned tasks!");
  if (data.members && data.members.length === 0) throw new Error("You can't intiate a project with no members!");
}

interface ProjectDataProps {
  projectID?: string;
  formData: ProjectFormData;
  selectedMembers: Array<{ _id: string }>;
  tasks: Task[];
  files: Pick<File, "name" | "size">[];
}

export const createNewProject = async ({ formData, selectedMembers, tasks, files }: ProjectDataProps) => {
  if (!formData.title || !formData.deadline || selectedMembers.length === 0 || tasks.length === 0) {
    throw new Error("Please fill out all required fields!");
  }

  const projectData = {
    title: formData.title.trim(),
    deadline: new Date(formData.deadline),
    priority: formData.priority,
    tasks: tasks.map((t) => ({
      title: t.title.trim(),
      assignedTo: t.assignedTo,
    })),
    members: selectedMembers.map((m) => m._id),
    attachments: files
  }

  commonErrors(projectData);

  //Calling api route to create project
  const response = await api.post("/projects", projectData, { withCredentials: true });
  if (!response || !response.data.success) throw new Error("Server Isn't Responding! Try Later.");

  const invite = await inviteMembers(selectedMembers, response.data.projectID);
  if (!invite) alert("Project Was Created Successfully. But Failed To Send Invites!");

  return response;
};


export const editProject = async (originalData: Project, { projectID, formData, selectedMembers, tasks, files }: ProjectDataProps) => {
  if (!projectID || projectID === "") throw new Error("Unable to process your request! Missing credentials.");

  if (formData.status === "Cancelled") {
    const res = await api.delete(`/projects/${projectID}`, { withCredentials: true });
    return res.data
  }

  const data: Map<string, any> = new Map();

  const basicDetails = Object.entries(formData) as ["title" | "priority" | "deadline", string][];
  basicDetails.forEach(([key, value]) => {
    if (originalData[key] !== value) data.set(key, value)
  })

  // comparing members
  if (JSON.stringify(originalData.members) !== JSON.stringify(selectedMembers)) {
    const updatedMembers: Record<"added" | "removed", string[]> = {
      added: [],
      removed: []
    }

    const prevMembers: Set<string> = new Set(originalData.members.map(m => m._id));

    selectedMembers.forEach(member => {
      if (!prevMembers.has(member._id)) {
        updatedMembers.added.push(member._id);
      }
      prevMembers.delete(member._id)
    })

    if (prevMembers.size > 0) {
      prevMembers.forEach(id => updatedMembers.removed.push(id))
    }

    data.set("addedMembers", updatedMembers.added);
    data.set("removedMembers", updatedMembers.removed);
  }

  // comparing tasks
  if (JSON.stringify(originalData.tasks) !== JSON.stringify(tasks)) {
    const updatedTasks: Record<"added" | "updated", Task[]> = {
      added: [],
      updated: []
    }

    const prevTasks: Map<string, Task> = new Map(originalData.tasks.map(t => [t._id, t]));

    tasks.forEach(task => {
      if (!isNaN(new Date(task._id).getTime())) {
        updatedTasks.added.push(task);
      }
      else {
        const prevTaks = prevTasks.get(task._id);
        if (JSON.stringify(prevTaks) !== JSON.stringify(task)) {
          updatedTasks.updated.push(task);
        }
      }
      prevTasks.delete(task._id)
    })

    data.set("addedTasks", updatedTasks.added)
    data.set("updatedTasks", updatedTasks.updated)
  }
  // firstly create logic to upload / retrieve / read / and discard files
}


export const askReport = async (assignedTo: string, taskTitle: string, projectTitle: string) => {
  return new Promise((resolve, reject) => {
    if (!socket) throw new Error("Unable To Connect To The Server! Try Again Later");

    socket.emit("askReport", assignedTo, taskTitle, projectTitle, (res: socketRes) => {
      if (res.status === "ok") resolve(true);
      else reject(new Error(res.message || "Failed to send report progress request!"));
    })
  })
}