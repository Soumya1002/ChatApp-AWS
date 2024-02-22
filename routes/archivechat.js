const express = require("express");
const userAuthentication = require("../middleware/auth");
const chatController = require("../controllers/archivechat"); // Assuming your controller file is named archivechat.js

const router = express.Router();

router.post("/", userAuthentication.authenticateToken, chatController.postChat);

router.get("/", userAuthentication.authenticateToken, chatController.getArchivedChat); // Corrected function name

module.exports = router;
