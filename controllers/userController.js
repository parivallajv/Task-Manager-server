const User = require("../models/User");
const Notes = require("../models/Task");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { getUserIdType } = require("../middleware/helper");

// @desc Get all users
// @route GET /Users
// @access private

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, userId } = req.query;

  const idType = getUserIdType(Number(role));
  const users = await User.find({ [idType]: userId })
    .select("-password")
    ?.lean();

  if (!users) {
    return res.status(400).json({ message: "No user not found", data: [] });
  }
  res.status(200).json({ data: users });
});

// @desc Create new users
// @route POST /User
// @access private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, password, roles, adminId, managerId } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "All fields are required" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate not allowed" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = {
    username,
    email,
    password: hashedPassword,
    roles,
    adminId,
    managerId,
  };
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(400).status({ message: "Invalid user data" });
  }
});

// @desc update users
// @route PATCH /User
// @access private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, email, password, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?.id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate user" });
  }

  const isUsernameChanged = user.username !== username;
  if (isUsernameChanged) {
    const note = await Notes.findOne({ username: user?.username }).exec();
    note.username = username;
    await note.save();
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  user.email = email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  return res.json({
    message: `${updatedUser.username} values updated successfully`,
  });
});

// @desc delete users
// @route DELETE /User
// @access private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Id not found" });
  }
  const notes = await Notes.findOne({ user: id }).lean().exec();
  if (notes) {
    return res.status(400).json("User has assigned note ");
  }
  const user = await User.findById(id).lean().exec();
  if (!user) {
    return res.status(400).json("User not found");
  }
  const result = await User.findByIdAndDelete(id);
  return res.json({ message: `${result.username} deleted successfully` });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
