import express from "express";
const router = express.Router();
import Projects from "../models/projectsModel.js"
import Messages from "../models/messaging/messagesModel.js";
import routeHandler from "../middlewares/globalErrWrap.js";
import { createNewChat, getAllChats } from "../controllers/chatsDBcontroller.js";

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
  const { projectSetup } = req.query;

  // Taking All Particpants Requested To Add In A Chat
  const participants: Array<string> = req.body.connectionIDs;

  try {
    const newChat = await createNewChat([String(userID), ...participants]);

    return res.status(201).json({
      success: true,
      newChat: (projectSetup && projectSetup == "1" ? newChat._id : newChat)
    });

  } catch (err) {
    if (err) throw Object.assign(new Error("Something Went Wrong!"), { status: 500 })
  }
}));

router.post("/setupRoute", routeHandler(async (req, res) => {
  // For testing, automation purposes
}))

export default router;