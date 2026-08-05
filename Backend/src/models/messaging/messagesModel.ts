import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        index: true,
        required: true
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true,
        maxlength: 300
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects'
    },
    delivered: {
        type: Boolean,
        default: false
    },
    inviteStatus: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Expired', 'Pending']
    }
}, { timestamps: true });

const Messages = mongoose.model('messages', messageSchema);
export default Messages;