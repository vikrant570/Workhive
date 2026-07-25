import jwt from "jsonwebtoken";
import { IONext, IOSocket } from "../types/socket";
import { IncomingMessage } from "http";
import { AccessCookieData } from "../types";

interface RequestCookies extends IncomingMessage {
  cookies: { [key: string]: string };
}

const authmw = (socket: IOSocket, next: IONext) => {
  const token = (socket.request as RequestCookies).cookies.access;
  if (!token)
    return next(new Error("Authentication failed please sign in again !"));

  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as AccessCookieData;
  socket.data.user = decoded;
  next();
};

export default authmw;