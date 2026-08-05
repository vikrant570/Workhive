import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./websockets/webSocketSetup.js";

//Routes
import userGateway from "./routes/userGateway.js";
import projectGateway from "./routes/projectGateway.js";
import chats from "./routes/chats.js";
import socials from "./routes/socialsGateway.js";

// .env file setup and config using a safer side
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

//Custom Middlewares
import isLoggedIn from "./middlewares/isLoggedIn.js";

const app = express();

// Built In Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
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
  let errorMessage = err.message;

  res.status(err.status || 500).json({
    success: false,
    message: errorMessage || "Something Went Wrong !"
  })
})

export default app;