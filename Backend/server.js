const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");
const dotenv = require("dotenv");
require("./config/env");

dotenv.config();


connectDB();

app.listen(process.env.PORT ,() => {
    console.log("server is running on port " + process.env.PORT);
});