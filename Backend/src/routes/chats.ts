import express from "express";
const router = express.Router();
import Messages from "../models/messaging/messagesModel.js";
import routeHandler from "../middlewares/globalErrWrap.js";
import { createNewChat, getAllChats } from "../controllers/chatsDBcontroller.js";
import Chats from "../models/messaging/chatsModel.js";
import userSocials from "../models/userSocialsModel.js";

// Get all chats - List
router.post("/", routeHandler(getAllChats));

// Get a fullchat (All Messages)
router.get("/:chatID", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });

  const { chatID } = req.params;
  const { cursor } = req.query;

  const query: any = {
    chatID: chatID,
  };

  // Finding older messages than cursor
  if (cursor && cursor != "") {
    query._id = { $lt: cursor };
  }

  const messages = await Messages.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: "project",
      select: "title",
      strictPopulate: false
    })
    .limit(25)

  const sortedMessages = messages.reverse();
  await Chats.findOneAndUpdate({ _id: chatID }, { $set: { "unread.$[elem].count": false } }, { arrayFilters: [{ "elem.user": req.user.userID }] });
  await userSocials.findOneAndUpdate({ user: req.user.userID }, { $set: { "notifications.messages": 0 } })

  res.status(200).json({
    success: true,
    messages: sortedMessages,
    hasMore: messages.length === 25
  });
}));

// Creata a New Chat
router.post("/create", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });
  const { userID } = req.user;
  const groupName = req.body?.groupName;

  const participants: Array<string> = req.body.connectionIDs;
  participants.push(String(userID));

  try {
    const newChat = await createNewChat(participants, false, groupName || undefined);

    return res.status(201).json({
      success: true,
      newChat: (groupName ? newChat._id : newChat)
    });

  } catch (err) {
    if (err) throw Object.assign(new Error("Something Went Wrong!"), { status: 500 })
  }
}));

router.patch("/resetUnreadCount", routeHandler(async (req, res) => {
  const { chatID } = req.body;
  const userID = req?.user?.userID;

  await Chats.findByIdAndUpdate(chatID, { $set: { "unread.$[elem].count": false } }, { arrayFilters: [{ "elem.user": userID }] });

  res.status(200).json({ success: true })
}))

router.post("/setupRoute", routeHandler(async (req, res) => {
  // For testing, automation purposes
}))

export default router;