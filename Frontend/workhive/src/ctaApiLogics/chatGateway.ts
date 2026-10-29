import api from "@/lib/axios";
import io from "socket.io-client";

let socketInstance: ReturnType<typeof io> | null = null;

export const getSocket = () => {
  if (typeof window !== "undefined" && !socketInstance) {
    const serverURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const backend = serverURL?.replace("/manager", "") || "";
    //@ts-expect-error
    socketInstance = io(backend, { withCredentials: true });
  }
  return socketInstance;
};

export const socket = getSocket();

export interface socketRes {
  status: string,
  code: string,
  message?: string
  _id: string
}

//Sending Message TO Someone
export const sendMessage = async (type: "p2p" | "group", chatID: string, message: string): Promise<{ success: boolean, _id: string }> => {
  if (!socket) throw new Error("Unable To Connect To The Server! Try Again Later");

  return new Promise((resolve) => {
    socket.emit("sendMessage", type, chatID, message, (response: socketRes) => {
      resolve({ success: response.status == "ok", _id: response._id });
    });
  })
}

export const createNewChat = async (connectionIDs: string[], group?: { name: string, admin: string }) => {
  const response = await api.post("/chats/create", { connectionIDs, groupName: group?.name || undefined }, { withCredentials: true });
  return response.data.newChat;
}

interface Chat {
  _id: string,
  participants: Array<string>
}

interface chatRes {
  success: boolean,
  myChats: Chat[]
}

// Final Action: Sends Invites
const sendInvites = async (chats: Chat[], projectID: string) => {
  if (!socket) throw new Error("Unable To Connect To The Server! Try Again Later");

  try {
    await Promise.all(
      chats.map((chat) => {
        // Waiting For Acknowledgement For Every Invitation Sent Successfully
        return new Promise((resolve, reject) => {
          socket.emit("sendMessage", "p2p", chat.participants[0], projectID, (response: socketRes) => {
            if (response.status === "ok") {
              resolve(response);
            } else {
              reject(new Error("Failed To Send Project Invite!"));
            }
          });
        });
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

export const inviteMembers = async (participants: Array<{ _id: string }>, projectID: string, group: { name: string, admin: string }) => {
  try {
    // Getting all chats for sending invites
    const res = await api.post("/chats", { participants: participants, group: group || undefined }, { withCredentials: true });
    if (!res.data.success) return false;

    const chats = (res.data as chatRes).myChats;

    if (chats.length == participants.length) {
      const success = await sendInvites(chats, projectID);
      return success;
    }

    // Logic to create new chats which doesn't exist ---
    const existingChatParticipants = new Set(chats.map(chat => chat.participants[0]));

    const remainingInvitees = participants.map(p => {
      const exists = existingChatParticipants.has(p._id);
      if (!exists) return p._id;
    })

    await Promise.all(
      remainingInvitees.map(async (inviteeID) => {
        if (inviteeID) {
          const newChat: Chat = await createNewChat([inviteeID], undefined);
          if (!newChat) return new Error("Something Went Wrong! Can't Send Invite.")
          chats.push(newChat)
        }
      })
    );

    const success = await sendInvites(chats, projectID);
    return success;

  } catch (error) {
    return false;
  }
}