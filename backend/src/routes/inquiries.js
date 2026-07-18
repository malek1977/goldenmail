// Inquiries — public endpoint for the main site contact form
// POST /api/inquiries — مفتوح، لا يحتاج مصادقة
// GET /api/inquiries — يحتاج مصادقة (للوحة التحكم)
import express from "express";
import { db } from "../db.js";
import { authMiddleware, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== POST /api/inquiries — استقبال من الموقع الرئيسي =====
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, source, priority } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "الاسم، البريد، الجوال، والرسالة مطلوبة",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "البريد الإلكتروني غير صحيح" });
    }

    const inquiry = await db.inquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).toLowerCase().trim(),
        phone: String(phone).trim(),
        subject: String(subject || "استفسار من الموقع").trim(),
        message: String(message).trim(),
        priority: priority || "medium",
        source: source || "contact_form",
        status: "new",
      },
    });

    // تسجيل النشاط
    await db.activity.create({
      data: {
        type: "inquiry_received",
        title: `استفسار جديد من ${name}`,
        description: String(subject || "").slice(0, 100),
      },
    });

    res.status(201).json({
      success: true,
      message: "تم استلام استفسارك بنجاح، سنتواصل معك قريباً",
      data: { id: inquiry.id },
    });
  } catch (e) {
    console.error("Inquiry POST error:", e);
    res.status(500).json({ success: false, message: "حدث خطأ، حاول مرة أخرى" });
  }
});

// ===== GET /api/inquiries — للوحة التحكم =====
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const inquiries = await db.inquiry.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
            { subject: { contains: search } },
            { message: { contains: search } },
          ],
        }),
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: inquiries, total: inquiries.length });
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// ===== PATCH /api/inquiries/:id — تحديث الحالة =====
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const inquiry = await db.inquiry.update({ where: { id }, data: updates });
    res.json({ data: inquiry, success: true });
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// ===== DELETE /api/inquiries/:id =====
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await db.inquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

export default router;