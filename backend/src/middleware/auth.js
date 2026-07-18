// Auth middleware
import { verifyToken } from "../auth.js";

export const authMiddleware = (req, res, next) => {
  // 1) من header (للـ API clients)
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  // 2) من cookie (للـ browser requests)
  if (!token && req.cookies?.["admin-token"]) {
    token = req.cookies["admin-token"];
  }

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }

  req.user = payload;
  next();
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }
  if (!token && req.cookies?.["admin-token"]) {
    token = req.cookies["admin-token"];
  }
  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
};