const express = require("express");
const router = express.Router();

const summarize = require("../controllers/summayController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/summarize", authMiddleware, upload.single("file"), summarize);

module.exports = router;