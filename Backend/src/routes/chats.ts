import express from "express";
const router = express.Router();
import Messages from "../models/messaging/messagesModel";
import routeHandler from "../middlewares/globalErrWrap";
import { createNewChat, getAllChats } from "../controllers/chatsDBcontroller";
import Chats from "../models/messaging/chatsModel";

// Get all chats - List
router.post("/", routeHandler(getAllChats));

// Get a fullchat (All Messages)
router.get("/:chatID", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });

  const { chatID } = req.params;
  const { cursor } = req.query; //_id of the top-most message

  //Dynamic query, for the first load and then load per scroll
  const query: any = {
    chatID: chatID,
  };

  // Finding older messages if the user reached the top
  if (cursor && cursor != "") {
    query._id = { $lt: cursor }; // $lt means "Less Than" (older than in MongoDB ObjectID terms)
  }

  const messages = await Messages.find(query)
    .sort({ createdAt: -1 }) // Get newest 25 messages first
    .limit(25)
    .populate({
      path: "project",
      select: "title",
      strictPopulate: false
    });

  if (!messages || messages == undefined) {
    return res.status(200).json({ success: false, message: "Chat Doesn't Exist!" });
  }

  //Reversing The Array To Get Oldest-Newest Order Of The Messages 
  const sortedMessages = messages.reverse();

  res.status(200).json({
    success: true,
    messages: sortedMessages,
    // Tell frontend if there are likely more messages to fetch
    hasMore: messages.length === 25
  });
}));

// Creata a New Chat
router.post("/create", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });
  const { userID } = req.user;
  const { projectSetup } = req.query;

  // Taking All Particpants Requested To Add In A Chat
  const participants: string[] = req.body.connectionIDs;

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

export default router;