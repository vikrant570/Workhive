import { Types } from "mongoose";
import Tokens from "../models/auth/tokensModel.js";
import jwt from "jsonwebtoken";

interface decodedToken {
  userID: string;
  exp: number;
}

export const generateRefreshToken = async (
  userID: string, requirement: "new" | "old"
): Promise<{ token: string, age: number } | null> => {

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Unauthorised! Access Revoked.");

  // New Token Assignment
  if (requirement === "new") {
    const token = jwt.sign({ userID }, secret, { expiresIn: "30d" });
    const newRefreshToken = await Tokens.create({
      refreshToken: {
        userID: userID,
        token: token
      }
    });

    if (!newRefreshToken) throw new Error("An Internal Error Occured Please Try Again Later.");

    return { token: token, age: 60 * 60 * 24 * 30 };
  }

  // Old Token Assignment with existing date validity
  else {
    const existingRefreshToken = await Tokens.findOne({ "refreshToken.userID": userID });

    if (existingRefreshToken?.refreshToken && existingRefreshToken.refreshToken.token) {
      const token = existingRefreshToken.refreshToken.token;

      const decoded = jwt.verify(token, secret) as decodedToken;
      const { exp } = decoded;

      const ageInSec = exp - Math.floor(Date.now() / 1000);

      return { token: token, age: ageInSec }
    }
  }

  return null;
};

export const regenerateAccessToken = async (refreshToken: string): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Internal Server Error");

  const decoded = jwt.verify(refreshToken, secret) as decodedToken;
  if (!decoded) throw new Error("Unauthorised! Access denied.");

  if (!refreshToken || decoded.exp - Math.floor(Date.now() / 1000) <= 0) {
    throw new Error("Unauthorised! Access Revoked.");
  }

  const newAccessToken = jwt.sign(
    { userID: decoded.userID },
    secret,
    {
      expiresIn: "24hr",
    }
  );

  return newAccessToken;

};