const express = require("express");
const router = express.Router();
const resetContoller = require("../controllers/resetPasswordController");

router.route("/").post(resetContoller?.authenticateUser);

module.exports = router;
