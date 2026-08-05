import app from "./index.js"
import http from 'http'
import mongoose from "mongoose";
import { initWebSocket } from "./websockets/webSocketSetup.js";

const server = http.createServer(app);
const PORT = process.env.PORT;
const DB = process.env.DB_URL;
const isDevelopment = process.env.NODE_ENV === "development";

if (!DB || !PORT) {
    throw new Error("Please provide DB URL and PORT");
}

initWebSocket(server)

mongoose.connect(DB)
    .then(() => {
        isDevelopment && console.log("Database connected");
        server.listen(PORT, () => isDevelopment && console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        isDevelopment && console.error("Database connection failed:", err);
        process.exit(1);
    });