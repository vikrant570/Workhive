import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";
import authmw from "./authmw.js";
import chatController from "./chatWScontroller.js";

// Helper to convert Express middleware to Socket.IO middleware
const wrap = (middleware: any) => (socket: any, next: any) =>
    middleware(socket.request, {} as any, next);


export const initWebSocket = (server: any) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });
    //Setup cookie parser
    io.use(wrap(cookieParser()));

    //HandShake Auth
    io.use(authmw);
    chatController(io)
}