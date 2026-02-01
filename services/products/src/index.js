const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "products-service" });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected - Products Service");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3002;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Products Service running on port ${PORT}`);
  });
});

module.exports = app;
