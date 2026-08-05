import { Types } from "mongoose";
import userSocials from "../models/userSocialsModel.js";
import Chats from "../models/messaging/chatsModel.js";

export const sendConnectionRequest = async (
  userID: string,
  userToBeActedUpon?: string | Types.ObjectId
) => {
  if (!userToBeActedUpon) throw new Error("Bad Request!");

  const response1 = await userSocials.findOneAndUpdate(
    { user: userToBeActedUpon },
    { $addToSet: { connectionRequests: userID } }
  );

  const response2 = await userSocials.findOneAndUpdate(
    { user: userID },
    { $addToSet: { sentConnectionRequests: userToBeActedUpon } }
  )

  if (!response1 || !response2) throw new Error("Unable to process your request");
};

export const acceptConnectionRequest = async (
  userID: string,
  userToBeActedUpon: string | Types.ObjectId
) => {
  const response1 = await userSocials.findOneAndUpdate(
    { user: userID },
    {
      $addToSet: { connections: userToBeActedUpon },
      $pull: { connectionRequests: userToBeActedUpon },
    }
  );

  const response2 = await userSocials.findOneAndUpdate(
    { user: userToBeActedUpon },
    {
      $pull: { sentConnectionRequests: userID },
      $addToSet: { connections: userID }
    }
  )

  if (!response1 || !response2) throw new Error("Unable to process your request");
};

export const ignoreConnectionRequest = async (
  userID: string,
  userToBeActedUpon: string | Types.ObjectId
) => {
  const response1 = await userSocials.findOneAndUpdate(
    { user: userID },
    { $pull: { connectionRequests: userToBeActedUpon } }
  );

  const response2 = await userSocials.findOneAndUpdate(
    { user: userToBeActedUpon },
    { $pull: { sentConnectionRequests: userID } }
  );

  if (!response1 || !response2) throw new Error("Unable to process your request");
};

export const removeConnection = async (
  userID: string,
  userToBeActedUpon: string | Types.ObjectId
) => {
  const response1 = await userSocials.findOneAndUpdate(
    { user: userID },
    { $pull: { connections: userToBeActedUpon } }
  );

  const response2 = await userSocials.findOneAndUpdate(
    { user: userToBeActedUpon },
    { $pull: { connections: userID } }
  )

  if (!response1 || !response2) throw new Error("Unable to process your request");
};

export const blockConnection = async (
  userID: string,
  userToBeActedUpon: string | Types.ObjectId
) => {
  const response1 = await userSocials.findOneAndUpdate(
    { user: userID },
    {
      $pull: {
        connections: userToBeActedUpon,
        connectionRequests: userToBeActedUpon,
        sentConnectionRequests: userToBeActedUpon
      },
      $addToSet: { blockList: userToBeActedUpon },
    }
  );

  // Also update the person's blocked by list
  const response2 = await userSocials.findOneAndUpdate(
    { user: userToBeActedUpon },
    {
      $pull: {
        connections: userID,
        connectionRequests: userID,
        sentConnectionRequests: userID
      },
      $addToSet: { blockedBy: userID }
    }
  )

  // Set the chat status to blocked too
  const chat = await Chats.findOne({ p2pKey: [String(userID), String(userToBeActedUpon)].sort().join("_") })

  if (chat) {
    chat.blocked = true;
    await chat.save();
  }

  if (!response1 || !response2) throw new Error("Unable to process your request");
};

export const initiateSocials = async (userID: string) => {
  const response = await userSocials.create({
    user: userID,
    connections: [],
    connectionRequests: [],
    blockList: [],
    blockedBy: [],
    sentConnectionRequests: []
  });

  if (!response) throw new Error("Unable to process your request");
}

export const withdrawConnectionRequest = async (
  userID: string, userToBeActedUpon: string
) => {
  const response1 = await userSocials.findOneAndUpdate({ user: userID }, {
    $pull: { sentConnectionRequests: userToBeActedUpon }
  })

  const response2 = await userSocials.findOneAndUpdate({ user: userToBeActedUpon }, {
    $pull: { connectionRequests: userID }
  })

  if (!response1 || !response2) throw new Error("Unable to process your request")
}

export const unblockConnection = async (
  userID: string,
  userToBeActedUpon: string
) => {
  const response1 = await userSocials.findOneAndUpdate({ user: userID }, {
    $pull: { blockList: userToBeActedUpon }
  })

  const response2 = await userSocials.findOneAndUpdate({ user: userToBeActedUpon }, {
    $pull: { blockedBy: userID }
  });

  const respectiveChat = await Chats.findOne({ p2pKey: [String(userID), String(userToBeActedUpon)].sort().join("_") })

  if (respectiveChat) {
    respectiveChat.blocked = false;
    await respectiveChat.save();
  }

  if (!response1 || !response2) throw new Error("Unable to process your request!")
}