import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import {
  acceptConnectionRequest,
  blockConnection,
  ignoreConnectionRequest,
  removeConnection,
  sendConnectionRequest,
  unblockConnection,
  withdrawConnectionRequest
} from "../controllers/socialsController.js";
import userSocials from "../models/userSocialsModel.js";
import routeHandler from "../middlewares/globalErrWrap.js";
import Users from "../models/auth/usersModel.js";
import { Types } from "mongoose";
const router = express.Router();

// Handle all (accept / reject / block / send) connection requests
router.post("/handleConnectionRequest", isLoggedIn, routeHandler(
  async (req, res) => {
    if (!req.user) throw Object.assign(new Error("Unauthorized !"), { status: 401 })
    interface Connection {
      action: "request" | "accept" | "ignore" | "remove" | "block" | "withdraw" | "unblock";
      userToBeActedUpon: string;
    }
    // userToBeActedUpon will be us only for the sendConnectionRequest, because someone will update our connectionRequests list by sending connection request
    const connectionToBeHandled: Connection = req.body;
    const myID = String(req.user.userID);

    try {
      switch (connectionToBeHandled.action) {
        case "request":
          await sendConnectionRequest(
            myID,
            connectionToBeHandled.userToBeActedUpon
          );
          break;

        case "accept":
          await acceptConnectionRequest(
            myID,
            connectionToBeHandled.userToBeActedUpon
          );
          break;

        case "ignore":
          await ignoreConnectionRequest(
            myID,
            connectionToBeHandled.userToBeActedUpon
          );
          break;

        case "remove":
          await removeConnection(
            myID,
            connectionToBeHandled.userToBeActedUpon
          );
          break;

        case "block":
          await blockConnection(
            myID,
            connectionToBeHandled.userToBeActedUpon
          );
          break;

        case "withdraw":
          await withdrawConnectionRequest(
            myID,
            connectionToBeHandled.userToBeActedUpon
          )
          break;

        case "unblock":
          await unblockConnection(
            myID,
            connectionToBeHandled.userToBeActedUpon
          )
          break;

        default:
          throw Object.assign(new Error("Invalid request"), { status: 400 })
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, message: (error as Error).message || "Unable to process your request!" })
    }

    res.status(201).json({ success: true, message: "Action Performed Sucessfully" })
  }
));

//View Socials
router.get("/", isLoggedIn, routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized !"), { status: 401 });

  const { view } = req.query;
  let socials;
  let responseKey: string = "";

  if (view === "") throw Object.assign(new Error("Unable to fetch user details!"), { status: 404 });

  switch (view) {
    case "project":
      responseKey = "members",
        socials = await userSocials.findOne(
          { user: req.user.userID },
          { connections: 1 })
          .populate({
            path: "connections",
            select: "fullname username"
          });
      break;

    case "home":
      responseKey = "socials"
      socials = await userSocials.findOne(
        { user: req.user.userID },
        { connections: { $slice: 3 }, connectionRequests: { $slice: 2 } }
      )
        .populate({
          path: "connections",
          select: "fullname username"
        })
        .populate({
          path: "connectionRequests",
          select: "fullname username"
        })
      break;

    case "full":
      responseKey = "socials"
      socials = await userSocials.findOne({ user: req.user.userID }, { sentConnectionRequests: 0, blockedBy: 0 })
        .populate({
          path: "connections",
          select: "fullname username workplace jobTitle"
        })
        .populate({
          path: "connectionRequests",
          select: "fullname username"
        })
        .populate({
          path: "blockList",
          select: "fullname username"
        })
        .lean();
    default:
      break;
  }


  if (!socials) throw Object.assign(new Error("Unable to fetch user details!"), { status: 404 });
  return res.status(200).json({
    success: true,
    [responseKey]: socials
  })
}));

// Search For People To Connect
router.get("/search", isLoggedIn, routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Unauthorized!"), { status: 401 });

  const { searchTerm } = req.query as { searchTerm: string };
  const userID = req.user.userID;

  // Projects user's BlockList and BlockedBy list
  const currUserSocialDetails = await userSocials.findOne({ user: userID }, { _id: 0, blockList: 1, blockedBy: 1, connections: 1, sentConnectionRequests: 1 }).lean();

  if (!currUserSocialDetails) throw Object.assign(new Error("Unable to fetch user details!"), { status: 404 });

  const resultsToExclude = [
    ...currUserSocialDetails?.blockList,
    ...currUserSocialDetails?.blockedBy,
    new Types.ObjectId(userID)
  ];

  const regex = new RegExp(searchTerm, 'i');
  const searchResults = await Users.aggregate([
    // Exclude all in the blocklists
    {
      $match: {
        _id: { $nin: resultsToExclude },
        $or: [{ username: { $regex: regex } }, { fullname: { $regex: regex } }]
      }
    },
    // set a badge for a connection (true/false)
    {
      $addFields: {
        isConnected: { $in: ['$_id', currUserSocialDetails.connections] },
        isRequested: { $in: ['$_id', currUserSocialDetails.sentConnectionRequests] }
      }
    },
    {
      $project: {
        jobTitle: 1,
        fullname: 1,
        username: 1,
        workplace: 1,
        isConnected: 1,
        isRequested: 1
      }
    },
    {
      $limit: 17
    }
  ]);

  return res.status(200).json({ success: true, socials: searchResults });
}))

// View Profiles
router.get("/profile", isLoggedIn, routeHandler(async (req, res) => {
  const userID = req.user?.userID;
  if (!userID) throw Object.assign(new Error("Authentication failed !"), { status: 401 });

  // id and parl are always received (set up in fronted)
  // id -> userID ||  "0"
  // parl -> "1" || "0" 
  const { id, parl } = req.query;

  const setResponse = async () => {
    if (id === "0") {
      // User is asking for his own profile
      const profile = await Users.findOne({ _id: userID }).lean();
      return profile || null;
    }

    // User is asking to view someones profile but we have to check first whether the user id blocked or not by another user
    else {
      const anotherUserSocials = await userSocials.aggregate([
        { $match: { user: new Types.ObjectId(id as string) } },
        {
          $addFields: {
            userStatus: {
              $switch: {
                branches: [
                  { case: { $in: [new Types.ObjectId(userID), "$connections"] }, then: "connected" },
                  { case: { $in: [new Types.ObjectId(userID), "$connectionRequests"] }, then: "requested" },
                  { case: { $in: [new Types.ObjectId(userID), "$blockList"] }, then: "blockedYou" },
                  { case: { $in: [new Types.ObjectId(userID), "$blockedBy"] }, then: "blockedBy" }
                ],
                default: "none"
              }
            }
          }
        },
        {
          $project: { userStatus: 1 }
        }
      ]);

      const connectionStatus = anotherUserSocials[0].userStatus;

      if (connectionStatus === "blockedYou") return null;

      // If not blocked then check wheter the user has requested full profile or partial profile 
      const filter = parl == "1" ? true : false;

      if (filter === true) {
        return (await Users.findOne({ _id: id }, { username: 1, fullname: 1 }).lean() || null);
      }
      else {
        const fullProfile = await Users.findOne({ _id: id }).lean();
        if (!fullProfile) return null;

        // Adding boolean fields for frontend rendering
        const mutatedResponse = {
          ...fullProfile,
          isConnected: connectionStatus == "connected",
          isRequested: connectionStatus == "requested",
          isBlockedBy: connectionStatus == "blockedBy"
        }

        return mutatedResponse;
      }
    }
  }

  const response = await setResponse();

  if (!response) throw Object.assign(new Error("Can't fetch User's details !"), { status: 404 });
  return res.status(200).json({ success: true, profileData: response })
}))

// Future Feature Based On User Behaviour
router.get("/suggestions", isLoggedIn, routeHandler(async (req, res) => {

}));

router.post("/testingRoute", isLoggedIn, routeHandler(async (req, res) => {
  console.log(req.body);
  res.status(200).json({ success: true, message: "Tested" })
}))

export default router;