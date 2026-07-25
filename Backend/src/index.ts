import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./websockets/webSocketSetup";

//Routes
import userGateway from "./routes/userGateway";
import projectGateway from "./routes/projectGateway";
import chats from "./routes/chats";
import socials from "./routes/socialsGateway";

// .env file setup and config using a safer side
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

//Custom Middlewares
import isLoggedIn from "./middlewares/isLoggedIn";

const app = express();

// Built In Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(
  cors({
    origin: ["http://localhost:3000", "192.168.18.124:3000"],
    credentials: true,
  })
);

//Base Endpoints
app.use("/manager/auth", userGateway);
app.use("/manager/projects", isLoggedIn, projectGateway);
app.use("/manager/chats", isLoggedIn, chats);
app.use("/manager/socials", isLoggedIn, socials);

//Global Error handler
interface Error {
  status: number,
  message: string
}
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something Went Wrong !"
  })
})

export default app;