const express = require("express");
const multer = require("multer");
// upload middleware

const upload = multer({
    dest: "uploads/",
    limits: {fileSize: 5 * 1024 * 1024}
})

module.exports = upload;