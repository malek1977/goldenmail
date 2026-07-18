// Admin routes — كل الـ CRUDs للوحة التحكم
// كل الـ routes هنا محمية بـ authMiddleware
import express from "express";
import { db } from "../../db.js";
import { authMiddleware } from "../../middleware/auth.js";
import { requireRole } from "../../auth.js";

const router = express.Router();

// كل الـ routes أدناه تحتاج مصادقة
router.use(authMiddleware);

// ========== Analytics / Dashboard ==========
router.get("/analytics", async (req, res) => {
  try {
    const [
      revenueAgg,
      activeProjects,
      customersCount,
      newInquiries,
      recentInquiries,
      recentProjects,
      activities,
      projectsByStatus,
      projectsByType,
      monthlyInquiries,
    ] = await Promise.all([
      db.project.aggregate({ _sum: { budget: true } }),
      db.project.count({ where: { status: "in_progress" } }),
      db.customer.count(),
      db.inquiry.count({ where: { status: "new" } }),
      db.inquiry.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { name: true } } },
      }),
      db.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      db.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
      db.project.groupBy({ by: ["status"], _count: { _all: true } }),
      db.project.groupBy({ by: ["type"], _count: { _all: true } }),
      getMonthlyData(db, "inquiry", 6),
    ]);

    // استفسارات لكل شهر
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const inquiriesByMonth = await getMonthlyInquiries(db, months);

    res.json({
      kpis: {
        totalRevenue: revenueAgg._sum.budget || 0,
        activeProjects,
        totalCustomers: customersCount,
        newInquiries,
      },
      recentInquiries,
      recentProjects,
      activities,
      projectsByStatus: projectsByStatus.map((p) => ({
        label: statusLabel(p.status),
        value: p._count._all,
        color: statusColor(p.status),
      })),
      projectsByType: projectsByType.map((p) => ({
        label: typeLabel(p.type),
        value: p._count._all,
        color: "#c8962e",
      })),
      inquiriesByMonth,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// ========== Projects ==========
router.get("/projects", async (req, res) => {
  const { status, type, search } = req.query;
  const projects = await db.project.findMany({
    where: {
      ...(status && { status }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { clientName: { contains: search } },
          { location: { contains: search } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: projects, total: projects.length });
});

router.post("/projects", requireRole("editor"), async (req, res) => {
  const project = await db.project.create({
    data: {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    },
  });
  await db.activity.create({
    data: { type: "project_created", title: `تم إنشاء مشروع: ${project.name}`, userId: req.user.userId },
  });
  res.status(201).json({ data: project, success: true });
});

router.patch("/projects/:id", requireRole("editor"), async (req, res) => {
  const project = await db.project.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: project, success: true });
});

router.delete("/projects/:id", requireRole("manager"), async (req, res) => {
  await db.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ========== Customers ==========
router.get("/customers", async (req, res) => {
  const { status, search } = req.query;
  const customers = await db.customer.findMany({
    where: {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: customers, total: customers.length });
});

router.post("/customers", requireRole("editor"), async (req, res) => {
  const customer = await db.customer.create({ data: req.body });
  res.status(201).json({ data: customer, success: true });
});

router.patch("/customers/:id", requireRole("editor"), async (req, res) => {
  const customer = await db.customer.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: customer, success: true });
});

router.delete("/customers/:id", requireRole("manager"), async (req, res) => {
  await db.customer.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ========== Design Requests ==========
router.get("/design-requests", async (req, res) => {
  const requests = await db.designRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: requests, total: requests.length });
});

router.post("/design-requests", requireRole("editor"), async (req, res) => {
  const data = { ...req.body, deadline: new Date(req.body.deadline) };
  const dr = await db.designRequest.create({ data });
  res.status(201).json({ data: dr, success: true });
});

router.patch("/design-requests/:id", requireRole("editor"), async (req, res) => {
  const dr = await db.designRequest.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: dr, success: true });
});

// ========== Products ==========
router.get("/products", async (req, res) => {
  const { category, status } = req.query;
  const products = await db.product.findMany({
    where: { ...(category && { category }), ...(status && { status }) },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: products, total: products.length });
});

router.post("/products", requireRole("editor"), async (req, res) => {
  const product = await db.product.create({ data: req.body });
  res.status(201).json({ data: product, success: true });
});

router.patch("/products/:id", requireRole("editor"), async (req, res) => {
  const product = await db.product.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: product, success: true });
});

router.delete("/products/:id", requireRole("manager"), async (req, res) => {
  await db.product.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ========== Blog ==========
router.get("/blog", async (req, res) => {
  const { status } = req.query;
  const posts = await db.blogPost.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: posts, total: posts.length });
});

router.post("/blog", requireRole("editor"), async (req, res) => {
  const data = {
    ...req.body,
    authorId: req.user.userId,
    authorName: req.user.name,
    publishedAt: req.body.status === "published" ? new Date() : null,
  };
  const post = await db.blogPost.create({ data });
  res.status(201).json({ data: post, success: true });
});

router.patch("/blog/:id", requireRole("editor"), async (req, res) => {
  const post = await db.blogPost.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: post, success: true });
});

router.delete("/blog/:id", requireRole("manager"), async (req, res) => {
  await db.blogPost.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ========== Testimonials ==========
router.get("/testimonials", async (req, res) => {
  const { status } = req.query;
  const t = await db.testimonial.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: t, total: t.length });
});

router.patch("/testimonials/:id", requireRole("editor"), async (req, res) => {
  const t = await db.testimonial.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: t, success: true });
});

router.post("/testimonials", requireRole("editor"), async (req, res) => {
  const t = await db.testimonial.create({ data: req.body });
  res.status(201).json({ data: t, success: true });
});

// ========== Users (admin only) ==========
router.get("/users", async (req, res) => {
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, phone: true, role: true, isActive: true, avatar: true, lastLogin: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: users, total: users.length });
});

router.post("/users", requireRole("admin"), async (req, res) => {
  const { hashPassword } = await import("../../auth.js");
  const hashed = await hashPassword(req.body.password || "Temp@2026");
  const user = await db.user.create({
    data: {
      email: req.body.email.toLowerCase(),
      name: req.body.name,
      password: hashed,
      phone: req.body.phone,
      role: req.body.role || "editor",
      isActive: true,
    },
    select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });
  res.status(201).json({ data: user, success: true });
});

router.patch("/users/:id", async (req, res) => {
  if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
    return res.status(403).json({ error: "FORBIDDEN" });
  }
  const { hashPassword } = await import("../../auth.js");
  const updates = { ...req.body };
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }
  delete updates.currentPassword;
  const user = await db.user.update({
    where: { id: req.params.id },
    data: updates,
    select: { id: true, email: true, name: true, role: true, isActive: true, phone: true, avatar: true },
  });
  res.json({ data: user, success: true });
});

// ========== Settings ==========
router.get("/settings", async (req, res) => {
  const settings = await db.setting.findMany();
  const result = {};
  settings.forEach((s) => (result[s.key] = s.value));
  res.json({ data: result });
});

router.post("/settings", requireRole("admin"), async (req, res) => {
  const entries = Object.entries(req.body);
  await Promise.all(
    entries.map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
  res.json({ success: true });
});

// ========== Top Customers ==========
router.get("/top-customers", async (req, res) => {
  const customers = await db.customer.findMany({
    take: 5,
    orderBy: { totalSpent: "desc" },
  });
  res.json({ data: customers });
});

// ===== Helpers =====
function statusLabel(s) {
  return ({ planning: "تخطيط", in_progress: "قيد التنفيذ", on_hold: "متوقف", completed: "مكتمل" })[s] || s;
}
function statusColor(s) {
  return ({ planning: "#3b82f6", in_progress: "#c8962e", on_hold: "#f59e0b", completed: "#10b981" })[s] || "#94a3b8";
}
function typeLabel(t) {
  return ({ residential: "سكني", commercial: "تجاري", industrial: "صناعي" })[t] || t;
}

async function getMonthlyData(db, model, monthsCount) {
  // placeholder
  return [];
}

async function getMonthlyInquiries(db, months) {
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = await db.inquiry.count({
      where: { createdAt: { gte: start, lt: end } },
    });
    result.push({ label: months[d.getMonth()], value: count });
  }
  return result;
}

export default router;