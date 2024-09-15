const express = require("express");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/itemRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const connectDB = require("./config/db");
connectDB();
// Use Routes
app.use("/api/auth", userRoutes);
app.use("/api/items", itemRoutes);
