const User = require("../models/User");
const Tasks = require("../models/Task");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all notes
// @route GET /Notes
// @access private

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Tasks.find().select("-password")?.lean();
  if (!tasks) {
    return res.status(400).json({ message: "No notes not found" });
  }
  res.json(tasks);
});

// @desc Create new note
// @route POST /Note
// @access private

const createNewTask = asyncHandler(async (req, res) => {
  const { username, title, description, dueDate, status } = req.body;
  if (!username || !title || !description) {
    return res.status(404).json({ message: "All fields are required" });
  }
  const duplicate = await Tasks.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate not allowed" });
  }

  const taskObject = { username, title, description, dueDate, status };
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
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  const note = await Tasks.findById(id).exec();

  const duplicate = await Tasks.findOne({ text }).lean().exec();
  if (duplicate && duplicate?.id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note" });
  }

  note.user = user;
  note.title = title;
  user.text = text;
  user.completed = completed;

  const updatedNote = await note.save();
  return res.json({
    message: `${updatedNote.user} note updated successfully`,
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

module.exports = { getAllTasks, createNewTask, updateTask, deleteTask };
