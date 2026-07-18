// Main Express app
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import publicRoutes from "./routes/public.js";
import authRoutes from "./routes/auth.js";
import inquiryRoutes from "./routes/inquiries.js";
import adminRoutes from "./routes/admin/index.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

// ===== Security =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // الـ frontend منفصل
}));

// CORS
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // mobile/curl
    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes("*")) {
      return cb(null, true);
    }
    cb(new Error("CORS: origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// Rate limit (للنماذج المفتوحة)
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 طلب / 15 دقيقة
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 محاولات دخول / 15 دقيقة
  message: { error: "TOO_MANY_ATTEMPTS", message: "حاول بعد 15 دقيقة" },
});

// ===== Parsers =====
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ===== Health check =====
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ===== Public routes (لا تحتاج مصادقة) =====
app.use("/api", publicRoutes);
app.use("/api/inquiries", inquiryLimiter, inquiryRoutes);
app.use("/api/auth", authLimiter, authRoutes);

// ===== Admin routes (تحتاج مصادقة) =====
app.use("/api/admin", adminRoutes);

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", path: req.path });
});

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.code || "INTERNAL_ERROR",
    message: err.message || "حدث خطأ في السيرفر",
  });
});

export default app;