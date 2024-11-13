const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../controllers/jwtController");

router.post("/", userController?.createNewUser);

router.use(verifyToken);

router
  .route("/")
  .get(userController?.getAllUsers)
  .patch(userController?.updateUser)
  .delete(userController?.deleteUser);

module.exports = router;
