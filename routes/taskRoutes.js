const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken } = require("../controllers/jwtController");

router.use(verifyToken);

router
  .route("/")
  .get(taskController?.getAllTasks)
  .patch(taskController?.updateTask)
  .post(taskController?.createNewTask)
  .delete(taskController?.deleteTask);

router.route("/userId").get(taskController?.getTasks);

module.exports = router;
