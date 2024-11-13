const usersDB = {
  users: require("../models/User"),
  setUsers: function (data) {
    this.users = data;
  },
};
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Get Authentication
// @route GET /User
// @access private

const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const foundUser = await usersDB.users.findOne({ email }).lean().exec();

  const currentUser = foundUser;

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const accessToken = jwt.sign(
    {
      userId: foundUser._id,
      userName: foundUser.username,
      userRoles: foundUser.roles,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: foundUser._id,
      userName: foundUser.username,
      userRoles: foundUser.roles,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  delete currentUser?.password;

  res.status(200).json({
    message: "Authentication successful",
    accessToken,
    currentUser,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).send("Logout successful");
});

module.exports = { authenticateUser, logout };
