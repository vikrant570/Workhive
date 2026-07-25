import app from "./index"
import http from 'http'
import mongoose from "mongoose";
import { initWebSocket } from "./websockets/webSocketSetup";

const server = http.createServer(app);
const PORT = process.env.PORT;
const DB = process.env.DB_URL;

if (!DB || !PORT) {
    throw new Error("Please provide DB URL and PORT");
}

initWebSocket(server)

server.listen(PORT, async () => {
    await mongoose.connect(DB);
})