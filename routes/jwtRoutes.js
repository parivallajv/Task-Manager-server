const express = require("express");
const router = express.Router();
const jwtController = require("../controllers/jwtController");

router.route("/").get(jwtController.verifyToken);

module.exports = router;
