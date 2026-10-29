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
    group: {
        name: string,
        admin: mongoose.Types.ObjectId
    },
    blocked: boolean,
    p2pKey?: string,
    unread: Array<{
        user: mongoose.Types.ObjectId,
        count: number
    }>
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
                return value.length >= 1;
            },
            message: "A chat must have at least 1 participants."
        }
    },
    lastMessage: lastMessageSchema,
    group: {
        name: {
            type: String,
            validate: {
                validator: function (value) {
                    if (this.chatType === "group") return !!value;
                    if (this.chatType === "p2p") return value == null;
                },
                message: "groupName only allowed for group chats"
            }
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    },
    blocked: {
        type: Boolean
    },
    p2pKey: {
        type: String,
        unique: true,
        index: true,
        sparse: true
    },
    unread: {
        type: [{
            _id: false,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            count: {
                type: Boolean,
                default: false
            }
        }]
    }
}, { timestamps: true });

const Chats = mongoose.model("chats", chatSchema);
export default Chats