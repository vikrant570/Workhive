import { Request, Response } from "express";
import Chats from "../models/messaging/chatsModel.js";
import Messages from "../models/messaging/messagesModel.js";
import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import Users from "../models/auth/usersModel.js";
import userSocials from "../models/userSocialsModel.js";

//Get All Chats (List)
export const getAllChats = async (req: Request, res: Response) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });
  const { userID } = req.user;

  let myChats: Array<any> = [];

  // If requested for sending project invitation
  const group = req.body?.group as { name: string, admin: string };

  const participants: Array<{ _id: string }> = req.body.participants;

  if (isValidObjectId(group?.admin) && participants.length > 0) {
    const destructuredParticipants = participants.map(p => p._id);

    await Promise.all(
      destructuredParticipants.map(async (p) => {
        const chat = await Chats.aggregate([
          { $match: { p2pKey: [String(userID), String(p)].sort().join("_") } },
          {
            $project: {
              participants: {
                $filter: {
                  input: "$participants",
                  as: "p",
                  cond: { $ne: ["$$p", new mongoose.Types.ObjectId(userID)] }
                }
              }
            }
          }
        ]);

        if (!chat) {
          throw new Error("No Chat History Found !");
        } else {
          // chat[0] because aggregate returns an array.
          myChats.push(chat[0]);
        }
      })
    );

    if (myChats) return res.status(200).json({ success: true, myChats });
  };

  //Normal chat page req
  myChats = await Chats.find({ participants: userID }, { createdAt: 0 })
    .sort({
      updatedAt: -1,
    })
    .populate({
      path: "participants",
      match: { _id: { $ne: userID } },
      select: "fullname"
    })
    .populate({
      path: "lastMessage.sender",
      select: "fullname"
    })

  if (!myChats) throw Object.assign(new Error("Unable to fetch chats now!"), { status: 404 });
  res.status(200).json({ success: true, chats: myChats });
}

//CREATE NEW CHAT
export const createNewChat = async (participants: string[], checked: boolean = false, groupName?: string) => {
  const chatType = participants.length === 2 ? "p2p" : "group";

  if (!checked) {
    const query = chatType === "group" && groupName ?
      { participants: { $all: participants, $size: participants.length }, "group.name": groupName }
      : { participants: { $all: participants, $size: participants.length } }

    const alreadyExists = await Chats.findOne(query);

    if (alreadyExists) {
      await alreadyExists.populate({
        path: "participants",
        select: "fullname"
      })

      return alreadyExists;
    }
  }

  const newChat = await Chats.create({
    chatType,
    participants,
    ...(chatType === "p2p" && { p2pKey: [String(participants[0]), String(participants[1])].sort().join("_") }),
    ...(groupName && { group: { name: groupName, admin: participants[0] } })
  });

  if (!newChat) throw new Error("Failed to send message !");

  await newChat.populate({
    path: "participants",
    select: "fullname"
  })

  return newChat;
};

// DELETE EXISTING CHAT
export const deleteExistingChat = async (req: Request, res: Response) => {
  const chatID = req.body.chatID;
  const userID = req.user?.userID;

  if (!chatID)
    return res.status(400).json({ success: false, message: "Bad request!" });

  const findExistingChat = await Chats.findOne({ _id: chatID });

  //Only delete if user is the participant
  if (findExistingChat && userID && findExistingChat.participants.some((participant: any) =>
    participant?.toString() === userID
  )) {
    await Chats.findOneAndUpdate({ _id: chatID }, { $pull: { participants: userID } });

    return res.status(204).json({ success: true, message: "Chat deleted!" });
  }

  return res.status(401).json({ success: false, message: "Unauthorized!" });
};

interface sentMessageInterface {
  message: {
    _id: mongoose.Types.ObjectId,
    text: string,
    senderID: mongoose.Types.ObjectId,
    chatID: mongoose.Types.ObjectId
  },
  sender: {
    name: string
    for: string
  }
}

export const sendMessage = async (type: "p2p" | "group", chatID: string, message: string, senderID: string): Promise<sentMessageInterface> => {
  // If its a project invite, the message field will contain a project's ObjectId
  const isProjectInvite = isValidObjectId(message);
  const projectID = isProjectInvite ? new mongoose.Types.ObjectId(message) : null;

  const findChat = async () => {
    const query = type === "p2p" ? { p2pKey: [senderID, chatID].sort().join('_') } : { _id: chatID };

    const chat = await Chats.findOne(query);
    return chat || null;
  }

  const chat = await findChat();

  if (!chat || (type == "p2p" && chat.blocked)) throw new Error("You can't send messages to this chat anymore!");

  const sentMessage = await Messages.create({
    chatID: chat._id,
    senderID,
    text: (isProjectInvite ? "Project Invitation" : message),
    ...(isProjectInvite && { project: projectID }),
    ...(isProjectInvite && { inviteStatus: "Pending" }),
    delivered: true
  });

  if (!sentMessage) throw new Error("Failed to send message!");

  chat.lastMessage = { sender: senderID, text: sentMessage.text };
  chat.unread = chat.unread.map((u: any) => {
    if (u.user.toString() !== senderID) {
      u.count = true;
    }
    return u;
  });
  await chat.save();

  chat.participants.forEach((p) => {
    if (String(p) !== senderID) {
      userSocials.findOneAndUpdate({ user: p }, { $inc: { "notifications.messages": 1 } })
    }
  })

  const senderDetails = await Users.findOne({ _id: senderID }, { fullname: 1 });
  const finalResponse = { message: sentMessage, sender: { name: senderDetails?.fullname || "Someone", for: type === "group" ? chat.group?.name : "" } }

  return finalResponse;
}