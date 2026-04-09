const express = require("express");
const userRoutes = require("./routes/userRoute");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);

module.exports = app;