const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const blockchainRoutes = require("./routes/blockchainRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "SIH26183 Crypto Fraud Analytics Backend is running!"
  });
});

// MongoDB connection test
app.get("/api/db-test", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    res.json({
      success: true,
      message: "MongoDB connected successfully!",
      state: mongoose.connection.readyState
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

app.use(errorMiddleware);
startServer();