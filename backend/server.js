// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import rateLimit from "express-rate-limit";
// import helmet from "helmet";
// import mongoose from "mongoose";

// import authRoutes from "./routes/auth.js";
// import fundRoutes from "./routes/funds.js";
// import mfapiRoutes from "./routes/mfapi.js";
// import proxyRoutes from "./routes/proxyRoutes.js";
// import swaggerRoutes from "./routes/swagger.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Middleware
// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ✅ Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// // ✅ MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// // ✅ Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/funds", fundRoutes);
// app.use("/api/mf", mfapiRoutes);
// app.use("/api/proxy", proxyRoutes);
// app.use("/api/docs", swaggerRoutes); // ✅ Swagger route

// // ✅ Health Check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Mutual Funds API is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// // ✅ Redirect `/docs` to Swagger UI
// app.get("/docs", (req, res) => {
//   res.redirect("/api/docs");
// });

// // ✅ Root Info Endpoint
// app.get("/", (req, res) => {
//   res.json({
//     name: "FundFlow API",
//     version: "1.0.0",
//     description: "RESTful API for mutual funds platform",
//     documentation: `${req.protocol}://${req.get("host")}/api/docs`,
//     endpoints: {
//       health: "/api/health",
//       auth: "/api/auth",
//       funds: "/api/funds",
//       docs: "/api/docs",
//     },
//   });
// });

// // ✅ Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: "Something went wrong!",
//     error:
//       process.env.NODE_ENV === "development"
//         ? err.message
//         : "Internal server error",
//   });
// });

// // ✅ 404 Handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: "Route not found",
//     availableEndpoints: {
//       health: "/api/health",
//       auth: "/api/auth",
//       funds: "/api/funds",
//       docs: "/api/docs",
//     },
//   });
// });

// // ✅ Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📱 API available at http://localhost:${PORT}/api`);
//   console.log(`📚 Swagger Docs at http://localhost:${PORT}/api/docs`);
// });

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import fundRoutes from "./routes/funds.js";
import swaggerRoutes from "./routes/swagger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Render deployments
app.set("trust proxy", 1);

// Helmet: Secure headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://fund-flow-frontend.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected`);
    console.log(`📚 Swagger Docs at http://localhost:${PORT}/api/docs`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/docs", swaggerRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Redirect /docs → Swagger
app.get("/docs", (req, res) => {
  res.redirect("/api/docs");
});

// Root Route
app.get("/", (req, res) => {
  res.json({
    name: "FundFlow API",
    version: "1.0.0",
    documentation: `${req.protocol}://${req.get("host")}/api/docs`,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" });
  }
  res.status(500).json({
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    hint: "Check /api/health, /api/auth, /api/funds, or /api/docs",
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
