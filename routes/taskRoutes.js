const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router
  .route("/")
  .get(taskController?.getAllTasks)
  .patch(taskController?.updateTask)
  .post(taskController?.createNewTask)
  .delete(taskController?.deleteTask);

module.exports = router;
