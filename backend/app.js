const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Make sure to load .env variables

const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const authRoutes = require("./routes/auth");
const { verifyToken, isAdmin } = require("./db/middleware/auth-middleware");

const app = express();

// CORS for Vercel frontend (replace with your final Vercel URL after deployment)
app.use(cors({
  origin: ['https://your-frontend.vercel.app'], 
  credentials: true
}));

// Middleware
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Server running successfully here");
});

// Routes
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/orders", verifyToken, isAdmin, orderRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/customer", verifyToken, customerRoutes);
app.use("/auth", authRoutes);

// MongoDB connection
async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "e-comm-store-db",
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Start server after DB connects
const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
