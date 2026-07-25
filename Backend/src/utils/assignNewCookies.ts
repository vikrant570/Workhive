import { generateRefreshToken } from "./renewTokens";
import { Response } from 'express';
import Tokens from "../models/auth/tokensModel";
import jwt from 'jsonwebtoken';
import { refreshTokenValidity } from "../middlewares/isLoggedIn";
import { Types } from "mongoose";

// For Login and Register ---
const assignCookiesOnAuth = async (res: Response, userID: string, email: string, action: string) => {

  const AccessToken = jwt.sign(
    { userID: userID },
    `${process.env.JWT_SECRET}`,
    { expiresIn: "24hr" }
  );

  const decideRefreshTokenCreation = async (): Promise<"new" | "old"> => {
    let decision: "new" | "old" = "old";

    // New Tokens are must - [Registration]
    if (action == "register") {
      decision = "new";
    }

    // Check for existence as well as validity
    else if (action == "login") {
      const alreadyExists = await Tokens.findOne({ "refreshToken.userID": new Types.ObjectId(userID) });

      if (!alreadyExists?.refreshToken || !alreadyExists.refreshToken.token) {
        decision = "new";
      } else {
        const isValid = refreshTokenValidity(alreadyExists.refreshToken.token);

        if (isValid == "generate") {
          await Tokens.findOneAndDelete({ "refreshToken.userID": new Types.ObjectId(userID) });
          decision = "new";
        } else if (isValid == "no-op") {
          decision = "old";
        }
      }
    }

    return decision;
  }

  const requirement = await decideRefreshTokenCreation();

  const refreshingToken = await generateRefreshToken(userID, requirement);

  if (!AccessToken || !refreshingToken) throw Object.assign(new Error("Failed To Authenticate !"), { status: 400 });

  // Setting Access cookie
  res.cookie("access", AccessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, //24hrs
    sameSite: "lax",
    secure: false,
  });

  //Setting Refreshing Token
  res.cookie("refresh", refreshingToken.token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * refreshingToken.age, // Age of token residing in database OR 30d if new token
    secure: false,
  });
};

export default assignCookiesOnAuth;