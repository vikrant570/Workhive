import api from "@/lib/axios";
import { inviteMembers } from "./chatGateway";

// Define types for arguments
interface Member {
  _id: string;
}

interface Task {
  title: string;
  assignedTo: string;
}

interface ProjectFormData {
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
}

// Explicitly type function arguments for formData and supporting arrays
export const createNewProject = async (
  formData: ProjectFormData,
  selectedMembers: Member[],
  tasks: Task[],
  files: File[]
) => {

  if ( !formData.title || !formData.deadline || selectedMembers.length === 0 || tasks.length === 0) {
    throw new Error("incomplete");
  }

  const projectData = {
    title: formData.title,
    deadline: new Date(formData.deadline),
    priority: formData.priority,
    tasks: tasks.map((t) => ({
      title: t.title,
      assignedTo: t.assignedTo,
    })),
    members: selectedMembers.map((m) => m._id),
    attachments: files
  }

  if (!projectData.title || !projectData.members || !projectData.priority || !projectData.deadline || !projectData.tasks) {
    throw new Error("There occured some problem creating the project!")
  }

  //Calling api route to create project
  const response = await api.post("/projects", projectData, { withCredentials: true });
  if(!response || !response.data.success) throw new Error("Server Isn't Responding! Try Later.");

  const invite = await inviteMembers(selectedMembers, response.data.projectID);
  if(!invite) alert("Project Was Created Successfully. But Failed To Send Invites!");

  return response;
};