import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateRefreshToken, regenerateAccessToken } from "../utils/renewTokens";
import { AccessCookieData } from "../types/index";
import Tokens from "../models/auth/tokensModel";
import { Types } from "mongoose";

interface decodedToken {
  exp: number
}

export const refreshTokenValidity = (token: string): string => {
  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as decodedToken;
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenAge = decoded.exp;

  const shouldRegenerate = (tokenAge - currentTime) <= 60 * 60 * 24 * 2;
  return shouldRegenerate ? "generate" : "no-op";
}

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access;
  const refreshToken = req.cookies.refresh;
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new Error("Unauthorised! Access Revoked.")

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      success: false,
      message: "User Logged Out, Please Login Again!"
    })
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, secret) as AccessCookieData;
      req.user = decoded;
      return next()
    }

    // Code Continued -> If access token is not found
    const decodedRefresh = jwt.verify(refreshToken, secret) as { userID: string };

    const isAuthentic = await Tokens.findOne({
      "refreshToken.userID": new Types.ObjectId(decodedRefresh.userID),
      "refreshToken.token": refreshToken
    });

    if (!isAuthentic) throw new Error("Authentication Error !");

    // Refresh Token Authenticyt verified, generating new and deleting old token

    const newAccessToken = await regenerateAccessToken(refreshToken);
    const newRefreshTokenNeeded = refreshTokenValidity(refreshToken);

    if (newRefreshTokenNeeded === "generate") {
      // Refresh Token About To Expire -> Renewal needed
      res.clearCookie("refresh");

      const renewedRefreshToken = await generateRefreshToken(decodedRefresh.userID, "new");
      if (!renewedRefreshToken) throw new Error("Internal Server Error!");

      res.cookie("refresh", renewedRefreshToken.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * renewedRefreshToken.age
      });
    };

    res.cookie("access", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });

    const decoded = jwt.verify(newAccessToken, secret) as AccessCookieData;
    req.user = decoded;
    return next()

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Authentication failed! Please Login Again." });
  }
};

export default isLoggedIn;
