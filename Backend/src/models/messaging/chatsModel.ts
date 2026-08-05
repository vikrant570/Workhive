import mongoose from "mongoose";

const lastMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    text: String
}, { _id: false });

interface IChat {
    chatType: "group" | "p2p",
    participants: Array<mongoose.Types.ObjectId>,
    lastMessage: any,
    groupName?: string,
    blocked: boolean,
    p2pKey?: string
}

const chatSchema = new mongoose.Schema<IChat>({
    chatType: {
        type: String,
        enum: ['group', 'p2p'],
        required: true
    },
    participants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }],
        required: true,
        validate: {
            validator: function (value: Array<mongoose.Schema.Types.ObjectId>) {
                return value.length >= 2;
            },
            message: "A chat must have at least 2 participants."
        }
    },
    lastMessage: lastMessageSchema,
    groupName: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.chatType === "group") return !!value;
                if (this.chatType === "p2p") return value == null;
            },
            message: "groupName only allowed for group chats"
        }
    },
    blocked: {
        type: Boolean,
        default: false
    },
    p2pKey: {
        type: String,
        unique: true,
        index: true,
        sparse: true
    }
}, { timestamps: true });

const Chats = mongoose.model("chats", chatSchema);
export default Chats