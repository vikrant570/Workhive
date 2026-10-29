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

    socket.join(userID);
    const groupChats = await Chats.find({ participants: userID, chatType: "group" }, { _id: 1 });

    if (groupChats && groupChats?.length > 0) {
      groupChats.forEach((chat) => {
        socket.join(String(chat._id));
      })
    }

    // If its a project invite, the message field will contain a project's ObjectId
    // chatID contains either a chatID if the type is group, or a participant's ID if the type is p2p
    socket.on("sendMessage", async (
      type: "p2p" | "group",
      chatID: string,
      message: string,
      callback: (data: CallbackParams) => void) => {
      try {
        const res = await sendMessage(type, chatID, message, userID);
        const msg = res.message;

        if (callback && msg._id) {
          callback({
            status: "ok",
            code: "SUCCESS",
            _id: String(msg._id),
          });
        }

        if (type === "p2p") {
          io.to(chatID).emit("messageReceived", res);
        } else {
          socket.to(chatID).emit("messageReceived", res);
        }

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
  });
}

export default chatController