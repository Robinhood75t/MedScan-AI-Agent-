const express = require("express");
const router = express.Router();

const summarize = require("../controllers/summayController");
const upload = require("../middleware/uploadMiddleware");

router.post("/summarize", upload.single("file"), summarize);

module.exports = router;