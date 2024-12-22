const User = require("../models/User");
const Notes = require("../models/Notes");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all notes
// @route GET /Notes
// @access private

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find().select("-password")?.lean();
  if (!notes) {
    return res.status(400).json({ message: "No notes not found" });
  }
  res.json(notes);
});

// @desc Create new note
// @route POST /Note
// @access private

const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text, completed } = req.body;
  if (!user || !title || !text || typeof completed !== "boolean") {
    return res.status(404).json({ message: "All fields are required" });
  }
  const duplicate = await Notes.findOne({ user }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate not allowed" });
  }

  const noteObject = { user, title, text, completed };
  const note = await Notes.create(noteObject);
  if (note) {
    res.status(201).json({ message: "Note created successfully" });
  } else {
    res.status(400).status({ message: "Invalid note data" });
  }
});

// @desc update notes
// @route PATCH /Note
// @access private

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
    const note = await Notes.findById(id).exec();
    
  const duplicate = await Notes.findOne({ text }).lean().exec();
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

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Id found" });
  }

  const note = await Notes.findById(id).lean().exec();
  if (!note) {
    return res.status(400).json("User not found");
  }
  const result = await Notes.deleteOne();
  return res.json({ message: `${result.user} deleted successfully` });
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
