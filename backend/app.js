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

const contactRoutes = require("./routes/contact");
const profileRoutes = require("./routes/profile");
const { verifyToken, isAdmin } = require("./db/middleware/auth-middleware");

const app = express();

// CORS for local development and Vercel frontend
const allowedOrigins = [
  'http://localhost:4200',
  'https://e-comm-mean-stack.vercel.app',
  'https://saarvi.vercel.app'
];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Middleware
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

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
app.use("/profile", verifyToken, profileRoutes);
app.use("/auth", authRoutes);
app.use("/api/contact", contactRoutes);

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
