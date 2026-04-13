const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");
const cors = require("cors");
const dotenv = require("dotenv");
require("./config/env");

dotenv.config();
app.use(cors({
    origin: "http://localhost:8080"
}));

connectDB();

app.listen(process.env.PORT ,() => {
    console.log("server is running on port " + process.env.PORT);
});