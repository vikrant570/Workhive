import app from "./index"
import http from 'http'
import mongoose from "mongoose";
import { initWebSocket } from "./websockets/webSocketSetup";

const server = http.createServer(app);
const PORT = process.env.PORT

initWebSocket(server)

server.listen(PORT, async () => {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log(`Server started at http://localhost:${PORT}`)
})