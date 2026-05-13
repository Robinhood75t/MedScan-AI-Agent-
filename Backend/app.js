const express = require("express");
const userRoutes = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/userRoute");
const summaryRoutes = require("./routes/summaryRoute");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/summary",summaryRoutes);
app.use("/api/users", userRoutes);


module.exports = app;