// Public routes — لا تحتاج مصادقة
// هذه الـ routes اللي يستخدمها الموقع الرئيسي (goldmil.matrxe.com)
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// ========== المنتجات (يستخدمها الموقع الرئيسي) ==========
router.get("/products", async (req, res, next) => {
  try {
    const products = await db.product.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (e) { next(e); }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const product = await db.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(product);
  } catch (e) { next(e); }
});

// ========== المقالات المنشورة ==========
router.get("/blog", async (req, res, next) => {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, authorName: true, category: true, image: true, publishedAt: true, views: true, likes: true },
    });
    res.json(posts);
  } catch (e) { next(e); }
});

router.get("/blog/:slug", async (req, res, next) => {
  try {
    const post = await db.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || post.status !== "published") return res.status(404).json({ error: "NOT_FOUND" });
    // زيادة عدد المشاهدات
    await db.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
    res.json(post);
  } catch (e) { next(e); }
});

// ========== آراء العملاء المعتمدة ==========
router.get("/testimonials", async (req, res, next) => {
  try {
    const { featured } = req.query;
    const where = { status: "approved" };
    if (featured === "true") where.featured = true;
    const testimonials = await db.testimonial.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(testimonials);
  } catch (e) { next(e); }
});

// ========== إعدادات الموقع (ما يحتاج يكون admin) ==========
router.get("/settings", async (req, res, next) => {
  try {
    const settings = await db.setting.findMany();
    const result = {};
    settings.forEach((s) => (result[s.key] = s.value));
    res.json(result);
  } catch (e) { next(e); }
});

// ========== AI Recommend (نفس الـ endpoint القديم) ==========
router.post("/ai/recommend", async (req, res, next) => {
  try {
    // هنا ممكن تضيف منطق توصيات حقيقي
    const products = await db.product.findMany({
      where: { status: "active" },
      take: 3,
    });
    res.json({ result: products.map(p => p.id) });
  } catch (e) { next(e); }
});

export default router;