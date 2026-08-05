import { IOServer } from "../types/socket.js";
import Chats from "../models/messaging/chatsModel.js";
import { createNewChat, sendMessage } from "../controllers/chatsDBcontroller.js";

interface CallbackParams {
  status: string,
  code: string,
  message?: any,
  _id: string
}

const chatController = (io: IOServer) => {
  io.on("connection", async (socket) => {
    const userID = socket.data.user?.userID;

    if (!userID) return;

    const allChats = await Chats.find(
      { participants: { $in: [userID] } },
      { _id: 1 }
    );
    //Join all rooms wherever the user is involved in the chat
    allChats.forEach((chat) => {
      socket.join(String(chat!._id));
    });

    //WHEN SOMEONE SENDS A MESSAGE
    // If its a project invite, the message field will contain a project's ObjectId
    socket.on("sendMessage", async (
      chatID: string,
      message: string,
      callback: (data: CallbackParams) => void) => {
      try {
        const msg = await sendMessage(chatID, message, userID);

        if (callback && msg) {
          callback({
            status: "ok",
            code: "SUCCESS",
            _id: String(msg._id)
          });
        }

        socket.to(chatID).emit("messageReceived", msg);
        //Send a push notification to those who are offline
        //Adding logic later....

      } catch (error: any) {
        if (callback) {
          callback({
            status: "failed",
            code: "ERROR",
            message: error?.message || "Failed to send message!",
            _id: ""
          });
        }
      }
    });

    socket.on("askReport", async (memberID, taskTitle, projectTitle, callback) => {
      try {
        let chat = await Chats.findOne({ p2pKey: [userID, memberID].sort().join("_") }, { _id: 1, participants: 1, blocked: 1 }).lean();

        if (!chat) {
          const newChat = await createNewChat([userID, memberID], true);
          socket.join(String(newChat._id));
          chat = newChat;
        }

        if (chat.blocked) {
          callback({
            status: "failed",
            code: "BLOCKED"
          })
        }

        const chatID = String(chat._id);
        const msg = `Asking progress report for [${taskTitle}[ ongoing under the project | ${projectTitle}.`

        const msgResponse = await sendMessage(chatID, msg, userID);

        if (callback && msgResponse) {
          callback({
            status: "ok",
            code: "SUCCESS"
          });
        }

        socket.to(chatID).emit("messageReceived", msgResponse);
        //Add push notification logic here later
      }
      catch (error: any) {
        if (callback) {
          callback({
            status: "failed",
            code: "ERROR",
            message: error?.message || "Failed to send message!"
          });
        }
      }
    });
  });
}

export default chatController