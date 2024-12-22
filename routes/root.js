const express = require("express");
const router = express.Router();
const path = require("path");
const resetContoller = require("../controllers/resetPasswordController");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router
  .route("/request_reset_password")
  .post(resetContoller?.requestPasswordReset);

router.route("/reset_password").post(resetContoller?.resetPassword);

module.exports = router;
