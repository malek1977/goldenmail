// Auth routes — تسجيل دخول، logout، me
import express from "express";
import { db } from "../db.js";
import { signToken, verifyPassword, hashPassword, verifyToken } from "../auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const COOKIE_NAME = "admin-token";

// ===== POST /api/auth/login =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "البريد وكلمة المرور مطلوبان" });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Cookie للـ browser
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // تحديث آخر دخول
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // تسجيل النشاط
    await db.activity.create({
      data: { type: "login", title: `تسجيل دخول: ${user.name}`, userId: user.id },
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: "حدث خطأ" });
  }
});

// ===== POST /api/auth/logout =====
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

// ===== GET /api/auth/me =====
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, role: true, avatar: true, phone: true, isActive: true },
    });
    if (!user || !user.isActive) return res.status(401).json({ error: "INACTIVE" });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// ===== POST /api/auth/change-password =====
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "WEAK_PASSWORD", message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
    }
    const user = await db.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: "NOT_FOUND" });

    const valid = await verifyPassword(currentPassword || "", user.password);
    if (!valid) return res.status(401).json({ error: "WRONG_PASSWORD", message: "كلمة المرور الحالية غير صحيحة" });

    const hashed = await hashPassword(newPassword);
    await db.user.update({ where: { id: user.id }, data: { password: hashed } });
    res.json({ success: true, message: "تم تغيير كلمة المرور" });
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

export default router;