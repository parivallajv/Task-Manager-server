const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

router
  .route("/")
  .get(noteController?.getAllNotes)
  .patch(noteController?.updateNote)
  .post(noteController?.createNewNote)
  .delete(noteController?.deleteNote);

module.exports = router;
