// JWT + bcrypt utilities
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET || JWT_SECRET.length < 16) {
  console.warn("⚠️  JWT_SECRET is too short. Set a strong secret in production.");
}

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token) => {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
};

// Roles hierarchy: admin > manager > editor > viewer
const ROLE_LEVELS = { admin: 4, manager: 3, editor: 2, viewer: 1 };

export const hasRole = (userRole, minRole) => {
  return (ROLE_LEVELS[userRole] || 0) >= (ROLE_LEVELS[minRole] || 0);
};

export const requireRole = (minRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });
  if (!hasRole(req.user.role, minRole)) return res.status(403).json({ error: "FORBIDDEN" });
  next();
};