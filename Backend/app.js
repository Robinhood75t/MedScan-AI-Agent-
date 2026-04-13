const express = require("express");
const userRoutes = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summaryRoute");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/summary",summaryRoutes);
app.use("/api/users", userRoutes);


module.exports = app;