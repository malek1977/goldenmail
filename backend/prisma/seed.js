// Seed script — بيانات تجريبية واقعية بالعربية
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const db = new PrismaClient();

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات...\n");

  // تنظيف
  await db.activity.deleteMany();
  await db.testimonial.deleteMany();
  await db.blogPost.deleteMany();
  await db.product.deleteMany();
  await db.designRequest.deleteMany();
  await db.inquiry.deleteMany();
  await db.customer.deleteMany();
  await db.project.deleteMany();
  await db.user.deleteMany();
  await db.setting.deleteMany();

  // ===== المستخدمون =====
  const pwd = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@2026", 12);
  const admin = await db.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@goldenmile.com.sa",
      name: process.env.ADMIN_NAME || "أحمد العتيبي",
      password: pwd,
      role: "admin",
      phone: "+966 50 123 4567",
      isActive: true,
      lastLogin: new Date(),
    },
  });
  const manager = await db.user.create({
    data: { email: "sara@goldenmile.com.sa", name: "سارة المطيري", password: pwd, role: "manager", phone: "+966 55 987 6543", isActive: true, lastLogin: new Date(Date.now() - 3*60*60*1000) },
  });
  await db.user.createMany({
    data: [
      { email: "khalid@goldenmile.com.sa", name: "خالد القحطاني", password: pwd, role: "editor", phone: "+966 56 555 1234", isActive: true, lastLogin: new Date(Date.now() - 24*60*60*1000) },
      { email: "noura@goldenmile.com.sa", name: "نورة الدوسري", password: pwd, role: "editor", phone: "+966 53 444 5678", isActive: false, lastLogin: new Date(Date.now() - 7*24*60*60*1000) },
      { email: "fahad@goldenmile.com.sa", name: "فهد الشمري", password: pwd, role: "viewer", phone: "+966 54 333 9876", isActive: true, lastLogin: new Date(Date.now() - 2*24*60*60*1000) },
    ],
  });
  console.log(`✅ ${await db.user.count()} مستخدمين`);

  // ===== المشاريع =====
  await db.project.createMany({
    data: [
      { name: "فيلا الياسمين السكنية", clientName: "عبدالله السبيعي", clientPhone: "+966 50 111 2233", type: "residential", status: "in_progress", progress: 65, budget: 850000, spent: 552500, startDate: new Date("2026-03-01"), endDate: new Date("2026-09-30"), manager: "أحمد العتيبي", location: "الرياض - حي الياسمين", description: "فيلا فاخرة بمساحة 600 م² مع حديقة ومسبح خاص" },
      { name: "مجمع النخيل التجاري", clientName: "شركة النخيل القابضة", clientPhone: "+966 11 222 3344", type: "commercial", status: "in_progress", progress: 42, budget: 2400000, spent: 1008000, startDate: new Date("2026-04-15"), endDate: new Date("2027-01-31"), manager: "سارة المطيري", location: "الرياض - طريق الملك فهد", description: "مجمع تجاري 12 طابق مع 80 معرض" },
      { name: "شقة الحمراء - ديكور كامل", clientName: "منى الزهراني", clientPhone: "+966 55 666 7788", type: "residential", status: "completed", progress: 100, budget: 180000, spent: 175000, startDate: new Date("2025-11-01"), endDate: new Date("2026-02-28"), manager: "أحمد العتيبي", location: "جدة - حي الحمراء", description: "ديكور كامل لشقة 180 م² ستايل مودرن" },
      { name: "مستودع المنطقة الصناعية", clientName: "مؤسسة البناء الحديث", clientPhone: "+966 11 555 6677", type: "industrial", status: "planning", progress: 15, budget: 1200000, spent: 180000, startDate: new Date("2026-07-15"), endDate: new Date("2026-12-31"), manager: "خالد القحطاني", location: "الرياض - المنطقة الصناعية الثانية" },
      { name: "مكتب الشركة الرئيسي", clientName: "شركة ألفا للاستشارات", clientPhone: "+966 11 888 9900", type: "commercial", status: "on_hold", progress: 30, budget: 420000, spent: 126000, startDate: new Date("2026-05-01"), endDate: new Date("2026-08-31"), manager: "سارة المطيري", location: "الرياض - برج المملكة" },
      { name: "قصر الديوان", clientName: "الشيخ منصور الرشيد", clientPhone: "+966 50 888 9900", type: "residential", status: "in_progress", progress: 78, budget: 3200000, spent: 2496000, startDate: new Date("2026-01-10"), endDate: new Date("2026-11-30"), manager: "أحمد العتيبي", location: "الرياض - حي الندى", description: "قصر فاخر بمساحة 1500 م² مع تصميم داخلي راقي" },
    ],
  });
  console.log(`✅ ${await db.project.count()} مشاريع`);

  // ===== العملاء =====
  await db.customer.createMany({
    data: [
      { name: "عبدالله السبيعي", email: "abdullah.s@email.com", phone: "+966 50 111 2233", city: "الرياض", status: "active", totalSpent: 552500, projectsCount: 1, lastContact: new Date(Date.now() - 2*24*60*60*1000), source: "referral" },
      { name: "شركة النخيل القابضة", email: "projects@palmholding.sa", phone: "+966 11 222 3344", city: "الرياض", status: "active", totalSpent: 1008000, projectsCount: 1, lastContact: new Date(Date.now() - 1*24*60*60*1000), source: "website" },
      { name: "منى الزهراني", email: "mona.z@email.com", phone: "+966 55 666 7788", city: "جدة", status: "past", totalSpent: 175000, projectsCount: 1, lastContact: new Date(Date.now() - 90*24*60*60*1000), source: "social" },
      { name: "محمد الغامدي", email: "m.ghamdi@email.com", phone: "+966 53 999 0011", city: "الدمام", status: "lead", totalSpent: 0, projectsCount: 0, lastContact: new Date(Date.now() - 3*24*60*60*1000), source: "ads" },
      { name: "هند البلوي", email: "hind.b@email.com", phone: "+966 56 444 5566", city: "تبوك", status: "prospect", totalSpent: 0, projectsCount: 0, lastContact: new Date(Date.now() - 5*24*60*60*1000), source: "website" },
      { name: "الشيخ منصور الرشيد", email: "office@alrasheed.sa", phone: "+966 50 888 9900", city: "الرياض", status: "active", totalSpent: 2496000, projectsCount: 1, lastContact: new Date(Date.now() - 8*60*60*1000), source: "referral" },
    ],
  });
  console.log(`✅ ${await db.customer.count()} عملاء`);

  // ===== الاستفسارات =====
  await db.inquiry.createMany({
    data: [
      { name: "محمد الحربي", email: "m.harbi@email.com", phone: "+966 55 123 9876", subject: "استفسار عن تشطيب فيلا", message: "السلام عليكم، أرغب بالحصول على عرض سعر لتشطيب فيلا مساحتها 400 م² في حي الملقا.", status: "new", priority: "high", source: "contact_form" },
      { name: "ريم العسيري", email: "reem.a@email.com", phone: "+966 56 789 1234", subject: "تصميم داخلي لشقة", message: "أبحث عن مصمم داخلي لشقة 180 م².", status: "in_progress", priority: "medium", source: "design_studio", assignedToId: manager.id },
      { name: "سلطان القاسم", email: "sultan.q@email.com", phone: "+966 50 444 1122", subject: "مقاولة مبنى تجاري", message: "نحتاج مقاول لمبنى تجاري 5 طوابق.", status: "responded", priority: "high", source: "contact_form", assignedToId: admin.id },
      { name: "نوال الخالدي", email: "nawal.k@email.com", phone: "+966 53 666 3344", subject: "استشارة مجانية", message: "أرغب باستشارة مجانية قبل البدء بمشروع الديكور.", status: "closed", priority: "low", source: "phone" },
      { name: "فهد المطيري", email: "f.mutairi@email.com", phone: "+966 54 222 8899", subject: "طلب عرض سعر", message: "أرجو إرسال عرض سعر لتركيب مطابخ.", status: "new", priority: "medium", source: "contact_form" },
    ],
  });
  console.log(`✅ ${await db.inquiry.count()} استفسارات`);

  // ===== طلبات التصميم =====
  await db.designRequest.createMany({
    data: [
      { customerName: "ريم العسيري", customerEmail: "reem.a@email.com", customerPhone: "+966 56 789 1234", projectName: "تصميم صالة معيشة فاخرة", roomType: "living", style: "modern", status: "in_design", budget: 45000, deadline: new Date("2026-07-20"), notes: "يفضل الألوان الذهبية.", assignedToId: manager.id },
      { customerName: "محمد الحربي", customerEmail: "m.harbi@email.com", customerPhone: "+966 55 123 9876", projectName: "غرفة نوم رئيسية", roomType: "bedroom", style: "luxury", status: "pending", budget: 35000, deadline: new Date("2026-07-25") },
      { customerName: "هند البلوي", customerEmail: "hind.b@email.com", customerPhone: "+966 56 444 5566", projectName: "مطبخ مفتوح", roomType: "kitchen", style: "minimal", status: "approved", budget: 60000, deadline: new Date("2026-08-10") },
    ],
  });
  console.log(`✅ ${await db.designRequest.count()} طلبات تصميم`);

  // ===== المنتجات =====
  await db.product.createMany({
    data: [
      { name: "طقم كنب مودرن ذهبي", sku: "GM-SF-001", category: "أثاث", price: 12500, stock: 8, sold: 24, status: "active", description: "طقم كنب 3+2+1 بتصميم عصري" },
      { name: "ثريا كريستال فاخرة", sku: "GM-LT-002", category: "إنارة", price: 8900, stock: 3, sold: 12, status: "active" },
      { name: "مكتب مدير تنفيذي", sku: "GM-FR-003", category: "أثاث مكتبي", price: 9800, stock: 0, sold: 6, status: "out_of_stock" },
      { name: "سجادة فارسية 3×4", sku: "GM-DC-004", category: "ديكور", price: 4500, stock: 15, sold: 32, status: "active" },
      { name: "مرآة جدارية مزخرفة", sku: "GM-DC-005", category: "ديكور", price: 2200, stock: 20, sold: 18, status: "active" },
      { name: "سرير كينج سايز فاخر", sku: "GM-FR-006", category: "أثاث", price: 15500, stock: 5, sold: 8, status: "active" },
    ],
  });
  console.log(`✅ ${await db.product.count()} منتجات`);

  // ===== المقالات =====
  await db.blogPost.createMany({
    data: [
      { title: "10 أفكار لديكور صالات المعيشة العصرية 2026", slug: "living-room-ideas-2026", excerpt: "اكتشف أحدث صيحات الديكور...", content: "محتوى تفصيلي...", authorName: "سارة المطيري", category: "ديكور", status: "published", views: 4521, likes: 287, publishedAt: new Date("2026-06-15") },
      { title: "كيف تختار ألوان الجدران المناسبة", slug: "wall-colors-guide", excerpt: "دليل شامل لاختيار الألوان...", content: "شرح مفصل...", authorName: "أحمد العتيبي", category: "نصائح", status: "published", views: 3210, likes: 198, publishedAt: new Date("2026-06-22") },
      { title: "مشروع فيلا الياسمين: رحلة من التصميم للتنفيذ", slug: "yasmeen-villa-project", excerpt: "تابع معنا تفاصيل المشروع...", content: "قريباً...", authorName: "خالد القحطاني", category: "مشاريع", status: "draft", views: 0, likes: 0 },
      { title: "أخطاء شائعة في تشطيب المنازل", slug: "common-finishing-mistakes", excerpt: "تجنب هذه الأخطاء...", content: "شرح الأخطاء...", authorName: "سارة المطيري", category: "نصائح", status: "published", views: 5980, likes: 412, publishedAt: new Date("2026-05-28") },
    ],
  });
  console.log(`✅ ${await db.blogPost.count()} مقالات`);

  // ===== آراء العملاء =====
  await db.testimonial.createMany({
    data: [
      { customerName: "عبدالله السبيعي", customerRole: "صاحب فيلا الياسمين", rating: 5, content: "تجربة رائعة، احترافية عالية والتزام بالمواعيد.", status: "approved", featured: true },
      { customerName: "منى الزهراني", customerRole: "مالكة شقة الحمراء", rating: 5, content: "فريق محترف ومتعاون، أنصح بهم بشدة.", status: "approved", featured: true },
      { customerName: "محمد الغامدي", customerRole: "عميل محتمل", rating: 4, content: "تواصلت معهم وكانت الإفادة ممتازة.", status: "pending", featured: false },
    ],
  });
  console.log(`✅ ${await db.testimonial.count()} آراء`);

  // ===== النشاط =====
  await db.activity.createMany({
    data: [
      { type: "design_approved", title: "تم اعتماد التصميم النهائي لـ \"قصر الديوان\"", userId: manager.id, createdAt: new Date(Date.now() - 5*60*1000) },
      { type: "project_updated", title: "تحديث حالة \"مجمع النخيل التجاري\" إلى 42%", createdAt: new Date(Date.now() - 30*60*1000) },
      { type: "payment_received", title: "تم استلام دفعة بقيمة 250,000 ر.س", createdAt: new Date(Date.now() - 60*60*1000) },
      { type: "low_stock", title: "تنبيه: نفد المخزون من \"مكتب مدير تنفيذي\"", createdAt: new Date(Date.now() - 3*60*60*1000) },
      { type: "post_published", title: "تم نشر مقال \"10 أفكار لديكور صالات المعيشة\"", userId: manager.id, createdAt: new Date(Date.now() - 24*60*60*1000) },
      { type: "inquiry_received", title: "استفسار جديد من محمد الحربي", createdAt: new Date(Date.now() - 2*60*1000) },
    ],
  });
  console.log(`✅ ${await db.activity.count()} أنشطة`);

  // ===== الإعدادات =====
  await db.setting.createMany({
    data: [
      { key: "site_name", value: "الميل الذهبي للمقاولات والديكورات" },
      { key: "site_phone", value: "+966 53 256 1599" },
      { key: "site_email", value: "info@goldenmile.com.sa" },
      { key: "site_address", value: "المملكة العربية السعودية، الرياض، حي الياسمين" },
      { key: "site_url", value: "https://goldmil.matrxe.com" },
      { key: "working_hours", value: "السبت - الخميس: 9:00 ص - 10:00 م" },
      { key: "whatsapp_number", value: "+966532561599" },
      { key: "social_instagram", value: "@goldenmile.sa" },
      { key: "social_twitter", value: "@goldenmile_sa" },
      { key: "social_facebook", value: "GoldenMileSA" },
    ],
  });
  console.log(`✅ ${await db.setting.count()} إعدادات\n`);

  console.log("🎉 تمت تعبئة قاعدة البيانات بنجاح!");
  console.log("\n📋 بيانات الدخول:");
  console.log(`   البريد: ${process.env.ADMIN_EMAIL || "admin@goldenmile.com.sa"}`);
  console.log(`   كلمة المرور: ${process.env.ADMIN_PASSWORD || "Admin@2026"}\n`);
}

main().catch((e) => { console.error("❌", e); process.exit(1); }).finally(() => db.$disconnect());