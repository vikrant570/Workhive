import { Request, Response } from "express";
import Chats from "../models/messaging/chatsModel.js";
import Messages from "../models/messaging/messagesModel.js";
import mongoose, { isValidObjectId } from "mongoose";

//Get All Chats (List)
export const getAllChats = async (req: Request, res: Response) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });
  const { userID } = req.user;

  let myChats: Array<any> = [];

  // If requested for sending project invitation
  const { projectSetup } = req.query;
  const participants: Array<{ _id: string }> = req.body.participants;

  if (projectSetup && projectSetup == "1" && participants.length > 0) {
    const destructuredParticipants = participants.map(p => p._id);

    await Promise.all(
      destructuredParticipants.map(async (p) => {
        const chat = await Chats.aggregate([
          {
            $match: {
              p2pKey: [String(userID), String(p)].sort().join("_")
            }
          },
          {
            $project: {
              participants: {
                $filter: {
                  input: "$participants",
                  as: "id",
                  cond: { $ne: ["$$id", new mongoose.Types.ObjectId(userID)] }
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

  //Requested For List Preview Of Chats
  myChats = await Chats.find({ participants: userID }, { createdAt: 0 })
    .sort({
      updatedAt: -1,
    })
    .populate({
      path: "participants",
      match: { _id: { $ne: userID } }, // Gives all the participants except the user
      select: "fullname"               // populate only fullname
    })
    .populate({
      path: "lastMessage.sender",
      select: "fullname"
    })

  if (!myChats) throw Object.assign(new Error("Unable to fetch chats now!"), { status: 404 });
  res.status(200).json({ success: true, chats: myChats });
}

//CREATE NEW CHAT
export const createNewChat = async (participants: string[], checked: boolean = false) => {
  const chatType = participants.length === 2 ? "p2p" : "group";

  if (!checked) {
    const alreadyExists = await Chats.findOne({ participants: { $all: participants, $size: participants.length } }, { _id: 1 });
    if (alreadyExists) throw new Error("Chat already exists!")
  }

  const newChat = await Chats.create({
    chatType,
    participants,
    ...(chatType === "p2p" && { p2pKey: [String(participants[0]), String(participants[1])].sort().join("_") })
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

// SEND MESSAGE TO ANYONE
export const sendMessage = async (chatID: string, message: string, senderID: string) => {
  // If its a project invite, the message field will contain a project's ObjectId
  const isProjectInvite = isValidObjectId(message);
  const projectID = isProjectInvite ? new mongoose.Types.ObjectId(message) : null;

  const isBlocked = async (): Promise<boolean> => {
    const chat = await Chats.findOne({ _id: chatID }, { participants: 1, blocked: 1 });

    if (chat?.participants.length == 2 && chat.blocked == true) {
      return true;
    }

    return false;
  }

  if (await isBlocked()) throw new Error("You can't send messages to this chat anymore!");

  const sentMessage = await Messages.create({
    chatID,
    senderID,
    text: (isProjectInvite ? "Project Invitation" : message),
    ...(isProjectInvite && { project: projectID }),
    delivered: true
  });

  if (!sentMessage) throw new Error("Failed to send message!");

  await Chats.findOneAndUpdate({ _id: chatID }, { lastMessage: { sender: senderID, text: sentMessage.text } });
  return sentMessage;
}