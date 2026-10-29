import { Request, Response } from "express";
import Messages from "../models/messaging/messagesModel.js";
import Chats from "../models/messaging/chatsModel.js";
import Projects from "../models/projectsModel.js";
import mongoose from "mongoose";

// Accepting or reject invites and updating further details according to the action called
export const callToActionForInvites = async (req: Request, res: Response) => {
    if (!req.user) throw Object.assign(new Error("Unauthorised Access! Request Revoked"), { status: 401 })

    const { action, inviteID } = req.body
    const projectID = req.params.id

    if (!action) throw Object.assign(new Error("Invalid Request !"), { status: 400 });

    const updatedInviteStatus = await Messages.findOneAndUpdate(
        { _id: inviteID, project: projectID, inviteStatus: "Pending" },
        { $set: { inviteStatus: action } }
    )

    // Simultaneously add the member in the project and the project's chat room
    if (updatedInviteStatus && action === "Accepted") {

        const addedAsMember = await Projects.findByIdAndUpdate(projectID, { $push: { members: req.user.userID } }, { new: true }).select("chatRoom");
        if (addedAsMember) await Chats.findByIdAndUpdate(addedAsMember.chatRoom, { $push: { participants: req.user.userID } })
    }

    return res.status(200).json({ success: true, message: "Changes Saved Successfully !" });
}

// Reply to the report - reportUpdate
interface TaskFeedBack {
    _id: string,
    title: string,
    feedback: string,
    status: "In progress" | "Completed"
}
export const updateReport = async (req: Request, res: Response) => {
    if (!req.user?.userID) throw Object.assign(new Error("Unauthorised Access! Request Revoked"), { status: 401 });
    const { userID } = req.user;
    const { reportedTasks, reportMessageID }: { reportedTasks: TaskFeedBack[], reportMessageID: string } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const project = await Projects.findById(req.params.id).select("tasks owner");

        project?.tasks.map((task) => {
            const currReportedTask = reportedTasks.find(t => t._id === String(task._id));    //from incoming array
            task.status = currReportedTask?.status || task.status;
            return task;
        });
        await project?.save();

        const findChat = await Chats.findOne({ type: "p2p", p2pKey: [userID, project?.owner].sort().join("_") }, { _id: 1 });
        if (!findChat) throw Object.assign(new Error("Internal Server Error !"), { status: 500 });

        const generatedReportMessage = await Messages.create({
            chatID: findChat._id,
            senderID: userID,
            text: JSON.stringify(reportedTasks),
            project: project?._id,
            reportStatus: "Reported"
        })

        await Messages.findByIdAndUpdate(reportMessageID, { $set: { reportStatus: "Reported" } });
        await session.commitTransaction();

        return res.status(200).json({ success: true, message: "Report Updated Successfully !" });
    } catch (error) {
        session.abortTransaction();
        throw Object.assign(new Error("Internal Server Error !"), { status: 500 });
    } finally {
        session.endSession();
    }
}