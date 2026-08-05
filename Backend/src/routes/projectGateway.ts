import express from "express";
import Projects from "../models/projectsModel.js";
import routeHandler from "../middlewares/globalErrWrap.js";
const router = express.Router();

//For viewing list of projects
router.get("/", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Please login/register first !"), { status: 401 });

  const userID = req.user.userID;
  const limit = req.query.view === "dashboard" ? 4 : 50;

  //Sending projects length according to the page view
  const projects = await Projects.find({ members: userID }, { members: 0 })
    .populate({
      path: "owner",
      select: "fullname"
    })
    .populate({
      path: "departments.head",
      select: "fullname"
    })
    .limit(limit)

  if (!projects) throw Object.assign(new Error("No projects found!"), { status: 404 });

  return res.status(200).json({ success: true, projects: projects });
}));

//For viewing a single project
router.get("/:id", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Please login/register first !"), { status: 400 });

  // Also show the project in which you are a particpant
  const project = await Projects.findOne({
    _id: req.params.id,
    members: req.user.userID
  })
    .populate({
      path: "members",
      select: "fullname"
    })
    .populate({
      path: "tasks.assignedTo",
      select: "fullname"
    })
    .populate({
      path: "owner",
      select: "fullname username"
    })

  if (!project) throw Object.assign(new Error("Project not found !"), { status: 404 });

  const isOwner = project.owner?._id?.toString() === req.user.userID;
  return res.status(200).json({ success: true, isOwner: isOwner, project: project });
}));

//For Creating a Entirely New Project.
router.post("/", routeHandler(async (req, res) => {
  const { title, members, priority, deadline, tasks, attachments } = req.body;

  if (!title || !members || !priority || !deadline || !tasks || !req.user?.userID) {
    throw Object.assign(new Error("All fields are required !"), { status: 400 })
  }

  const newProject = await Projects.create({
    title,
    members: [req.user.userID, ...members],
    priority,
    tasks,
    owner: req.user?.userID,
    deadline: new Date(deadline),
    attachments: attachments || [],
  });

  if (!newProject) throw Object.assign(new Error("Failed to create project !"), { status: 400 })

  res.status(201).json({ success: true, message: "Project Created Successfully.", projectID: newProject._id });
}));

//For Modifying a Project
router.patch("/:id", routeHandler(async (req, res) => {
  if (!req.user) throw Object.assign(new Error("Please login/register first !"), { status: 400 })

  const userID = req.user?.userID
  const projectId = req.params.id
  const changes = req.body

  const editedProject = await Projects.findOneAndUpdate({ _id: projectId, owner: userID }, { $set: changes });

  if (!editedProject) throw Object.assign(new Error("Failed to save changes !"), { status: 400 });

  return res.status(200).json({ success: true, message: "Changes Saved Successfully !" });
}));

//For Deleting a Project
router.delete("/:id", routeHandler(async (req, res) => {
  const projectId: string = req.params.id;
  // Find the project to ensure it exists and belongs to the user
  if (!req.user) throw Object.assign(new Error("Unauthorized !"), { status: 401 })

  const project = await Projects.findOneAndDelete({
    _id: projectId,
    owner: req.user?.userID,
  });

  if (!project) throw Object.assign(new Error("Failed to delete project !"), { status: 404 })

  res.status(200).json({
    success: true,
    message: "Project deleted successfully.",
  });
}));

export default router;