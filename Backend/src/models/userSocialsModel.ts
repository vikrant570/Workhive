import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const userSocialSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "users",
  },
  connections: {
    type: [
      {
        type: ObjectId,
        ref: "users",
      },
    ],
  },
  connectionRequests: {
    type: [
      {
        type: ObjectId,
        ref: 'users'
      }
    ],
  },
  blockList: {
    type: [{
      type: ObjectId,
      ref: 'users'
    }]
  },
  blockedBy: {
    type: [{
      type: ObjectId,
      ref: 'users'
    }]
  },
  sentConnectionRequests: {
    type: [
      {
        type: ObjectId,
        ref: 'users'
      }
    ]
  }
});

userSocialSchema.index({ username: 'text', fullname: 'text' });

const userSocials = mongoose.model("userSocials", userSocialSchema);
export default userSocials;