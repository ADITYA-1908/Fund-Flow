import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import fundRoutes from "./routes/funds.js";
import mfapiRoutes from "./routes/mfapi.js";
import proxyRoutes from "./routes/proxyRoutes.js";
import swaggerRoutes from "./routes/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/mf", mfapiRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api/docs", swaggerRoutes); // ✅ Swagger route

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Mutual Funds API is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Redirect `/docs` to Swagger UI
app.get("/docs", (req, res) => {
  res.redirect("/api/docs");
});

// ✅ Root Info Endpoint
app.get("/", (req, res) => {
  res.json({
    name: "FundFlow API",
    version: "1.0.0",
    description: "RESTful API for mutual funds platform",
    documentation: `${req.protocol}://${req.get("host")}/api/docs`,
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      funds: "/api/funds",
      docs: "/api/docs",
    },
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ✅ 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableEndpoints: {
      health: "/api/health",
      auth: "/api/auth",
      funds: "/api/funds",
      docs: "/api/docs",
    },
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`📚 Swagger Docs at http://localhost:${PORT}/api/docs`);
});
