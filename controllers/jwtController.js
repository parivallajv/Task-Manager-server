const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid token", data: [] });
    req.user = user;
    next();
  });
});

module.exports = { verifyToken };
