import { IOServer } from "../types/socket";
import Chats from "../models/messaging/chatsModel";
import { sendMessage } from "../controllers/chatsDBcontroller";

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
  });
}

export default chatController