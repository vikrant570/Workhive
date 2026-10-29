import Tokens from "../models/auth/tokensModel.js";
import jwt from "jsonwebtoken";

interface decodedToken {
  userID: string;
  exp: number;
}

export const generateRefreshToken = (userID: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Unauthorised! Access Revoked.");

  const newRefreshToken = jwt.sign({ userID: userID }, secret, { expiresIn: "30d" });
  return newRefreshToken as string;
};

export const regenerateAccessToken = async (userID: string): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Internal Server Error");

  const newAccessToken = jwt.sign({ userID: userID }, secret, { expiresIn: "24hr" });
  return newAccessToken as string;
};