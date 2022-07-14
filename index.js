require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const connection = require("./db");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

// Database connection
connection();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server started at port ${port}`));
