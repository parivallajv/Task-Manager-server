const User = require("../models/User");
const Tasks = require("../models/Task");

const asyncHandler = require("express-async-handler");
const { getUserIdType } = require("../middleware/helper");

// @desc Get all notes
// @route GET /Notes
// @access private

const getAllTasks = asyncHandler(async (req, res) => {
  const { role, userId } = req.query;

  const idType = getUserIdType(Number(role));
  const users = await User.find({ [idType]: userId })
    .select("-password")
    ?.lean();

  const userIds = users?.map((item) => item?._id);
  const tasks = await Tasks.find({ userId: { $in: userIds } })
    .select("-password")
    ?.lean();
  if (!tasks) {
    return res.status(400).json({ message: "No notes not found" });
  }
  res.json(tasks);
});

const getTasks = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const tasks = await Tasks.find({ userId }).select("-password")?.lean();
  if (!tasks) {
    return res.status(400).json({ message: "No notes not found" });
  }
  res.json(tasks);
});

// @desc Create new note
// @route POST /Note
// @access private

const createNewTask = asyncHandler(async (req, res) => {
  const { username, userId, title, description, dueDate, status } = req.body;
  if (!username || !title || !description) {
    return res.status(404).json({ message: "All fields are required" });
  }

  const taskObject = { username, title, description, dueDate, status, userId };
  const task = await Tasks.create(taskObject);
  if (task) {
    res.status(201).json({ message: "Task created successfully" });
  } else {
    res.status(400).status({ message: "Invalid task data" });
  }
});

// @desc update notes
// @route PATCH /Note
// @access private

const updateTask = asyncHandler(async (req, res) => {
  const { id, username, title, description, dueDate, completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  const note = await Tasks.findById(id).exec();

  const duplicate = await Tasks.findOne({ description }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note" });
  }
  if (username) note.username = username;
  if (title) note.title = title;
  if (description) note.description = description;
  if (completed) note.status = completed;
  if (dueDate) note.dueDate = dueDate;

  const updatedNote = await note.save();
  return res.json({
    message: `${updatedNote.username} note updated successfully`,
  });
});

// @desc delete notes
// @route DELETE /Note
// @access private

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Id found" });
  }

  const note = await Tasks.findById(id).lean().exec();
  if (!note) {
    return res.status(400).json("User not found");
  }
  const result = await Tasks.deleteOne();
  return res.json({ message: `${result.user} deleted successfully` });
});

module.exports = {
  getAllTasks,
  getTasks,
  createNewTask,
  updateTask,
  deleteTask,
};
