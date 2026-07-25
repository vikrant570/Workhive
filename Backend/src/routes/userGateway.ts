import Users from "../models/auth/usersModel";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtp, sendFinalMail } from "../utils/mailer";
import OTP from "../models/auth/otpsModel";
import routeHandler from "../middlewares/globalErrWrap";
import otpCrossCheck from "../utils/otpCrossCheck";
import assignCookiesOnAuth from "../utils/assignNewCookies";
import { initiateSocials } from "../controllers/socialsController";

const router = express.Router();

// Endpoint for requesting registration (Verify Email using OTP)
router.post(
  "/initiate",
  routeHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }, { password: 1 }).lean();

    //check if user requested for a register request or a login.
    if (!password) {
      // Check if user already exists
      if (user)
        throw Object.assign(new Error("User already exists!"), { status: 409 });
      //Call the function for sending otp
      const mailed: { success: boolean, code: number } = await sendOtp(email);

      if (mailed.code === 11000) {
        throw Object.assign(new Error("Please wait before trying again!"), { status: 400 })
      }

      return res.json({
        success: true,
        message: "OTP sent successfully.",
      });
    }

    // Case-2 If user has requested for login
    else {
      if (!user)
        throw Object.assign(new Error("User doesn't exist!"), { status: 404 });

      const isValid = await bcrypt.compare(password, user?.password as string);
      if (!isValid)
        throw Object.assign(new Error("Invalid Credentials!"), {
          status: 400,
        });

      const mailed: { success: boolean, code: number } = await sendOtp(email);
      // If any problem in sending email
      if (!mailed.success) return res.status(400).json({ success: false, message: "Cannot send OTP try again later!" })
      return res.json({
        success: true,
        message: "OTP sent successfully.",
      });
    }
  })
);

// Endpoint for final regsitration after OTP verification
router.post(
  "/register",
  routeHandler(async (req, res) => {
    const { fullname, username, email, password, workplace } = req.body;
    //Cross Check OTP using ACK Token
    otpCrossCheck(req, email);
    const hashedPassword = await bcrypt.hash(password as string, 10); // Hash the password

    // Create new user
    const newUser = await Users.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      workplace,
    });

    //Assign Cookies for instant access after registration
    await assignCookiesOnAuth(res, String(newUser._id), email, "register");

    //Send a welcome mail to new user after successfull registration.
    sendFinalMail(fullname, email, "register");
    res.clearCookie("otpAuth");

    // Initiate Socials Automatically On Any Registration
    await initiateSocials(String(newUser._id));

    return res.status(201).json({
      success: true,
      message: "Registration Successfull",
    });
  })
);

//Endpoint for OTP Verification for both login and registrations.
router.post(
  "/verify-otp",
  routeHandler(async (req, res) => {
    const { otp, email } = req.body;
    const isValid = await OTP.findOne({ user: email, otp: otp });

    if (isValid) {
      const acknowledgement = jwt.sign({ email }, `${process.env.JWT_SECRET}`, {
        expiresIn: "2m",
      });
      //Sending a acknowledgement to cross check whether the user has verified the otp or not for security bases.
      res.cookie("otpAuth", acknowledgement, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 2,
      });

      return res
        .status(200)
        .json({ success: true, message: "OTP Verified Successfully." });
    }
    throw Object.assign(new Error("Invalid OTP!"), { status: 403 });
  })
);

//Endpoint for logging in after verification
router.post(
  "/login",
  routeHandler(async (req, res) => {
    const { email } = req.body;

    const user = await Users.findOne({ email }, { _id: 1, fullname: 1, email: 1 }).lean();
    if (!user)
      throw Object.assign(new Error("Login revoked !"), { status: 404 });
    const userID = user?._id.toString();

    //Cross checking OTP verification using ACK Token
    otpCrossCheck(req, email);

    await assignCookiesOnAuth(res, userID, email, "login");

    //Remove the otp auth token
    res.clearCookie("otpAuth");

    await sendFinalMail(`${user?.fullname}`, `${user?.email}`, "login");
    return res.status(200).json({
      success: true,
      message: "Login Successfull.",
    });
  })
);

export default router;