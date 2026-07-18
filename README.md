# 🏗️ Golden Mile — المشروع الكامل

> موقع + لوحة تحكم احترافية لمؤسسة الميل الذهبي للمقاولات والديكورات
> مدمج كلياً: **Next.js frontend + Express API + Prisma + Admin Dashboard**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Backend-Express-000)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_5-2D3748)](https://prisma.io)
[![SQLite](https://img.shields.io/badge/DB-SQLite-003B57)](https://sqlite.org)

---

## 🎯 المشروع النهائي

بعد الدمج الكامل، أصبح عندك:

```
golden-mile/
├── backend/                  # Express + Prisma + JWT (port 5000)
│   ├── src/
│   │   ├── app.js            # Express app
│   │   ├── server.js         # Entry
│   │   ├── db.js             # Prisma singleton
│   │   ├── auth.js           # JWT + bcrypt
│   │   ├── middleware/
│   │   └── routes/
│   │       ├── public.js     # /api/products, /api/blog, etc
│   │       ├── auth.js       # /api/auth/login, logout, me
│   │       ├── inquiries.js  # استقبال النماذج (مفتوح)
│   │       └── admin/        # كل CRUDs (محمي)
│   ├── prisma/
│   │   ├── schema.prisma     # 10 جداول
│   │   └── seed.js           # بيانات تجريبية
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # Next.js 14 (port 3000)
│   ├── app/
│   │   ├── page.jsx          # الرئيسية (تجلب من API)
│   │   ├── contact/page.jsx  # نموذج الاتصال (POST → API)
│   │   ├── admin/
│   │   │   ├── login/        # تسجيل دخول
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.jsx              # Overview
│   │   │   │   ├── analytics/            # التحليلات
│   │   │   │   ├── projects/             # المشاريع
│   │   │   │   ├── customers/            # العملاء
│   │   │   │   ├── inquiries/            # الاستفسارات
│   │   │   │   ├── design-studio/        # استوديو التصميم
│   │   │   │   ├── store/                # المتجر
│   │   │   │   ├── blog/                 # المدونة
│   │   │   │   ├── testimonials/         # آراء العملاء
│   │   │   │   ├── users/                # المستخدمون
│   │   │   │   └── settings/             # الإعدادات
│   │   │   └── layout.jsx                # AuthGuard + Shell
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/
│   │   ├── admin/            # Sidebar, Topbar, Shell, Toaster, Charts
│   │   └── ui/               # PageHeader, StatCard, DataTable, Avatar
│   ├── lib/
│   │   ├── api.js            # Axios client
│   │   ├── auth-context.js   # AuthProvider
│   │   └── utils.js          # cn(), formatters
│   ├── package.json
│   └── next.config.js
│
├── apache-config.conf         # جاهز للنسخ إلى /etc/apache2/sites-available/
├── deploy.sh                  # 🚀 سكربت النشر التلقائي
├── DEPLOYMENT.md              # دليل النشر اليدوي
├── README.md                  # هذا الملف
└── .gitignore
```

---

## ⚡ تشغيل سريع (محلياً)

```bash
# 1) Backend
cd backend
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm start  # → http://localhost:5000

# 2) Frontend (terminal جديد)
cd frontend
npm install
npm run dev  # → http://localhost:3000

# 3) افتح
# الموقع:      http://localhost:3000
# لوحة التحكم: http://localhost:3000/admin/login
# API:         http://localhost:5000/api/health

# بيانات الدخول:
# admin@goldenmile.com.sa
# Admin@2026
```

---

## 🚀 النشر على Hostinger (سريع)

```bash
# في جهازك المحلي:
bash deploy.sh YOUR_SERVER_IP

# سينشر تلقائياً على /var/www/html مع:
# - تثبيت dependencies
# - توليد JWT_SECRET عشوائي
# - إنشاء قاعدة البيانات
# - تعبئة بيانات تجريبية
# - بناء Next.js
# - تشغيل PM2
```

---

## 🛠️ النشر اليدوي (إذا فضلت الخطوات)

راجع **[DEPLOYMENT.md](./DEPLOYMENT.md)** للتفاصيل الكاملة.

ملخص سريع:

```bash
# على السيرفر
cd /var/www/html

# Backend
cd backend
npm install --production
cp .env.example .env
# ضع JWT_SECRET قوي
npx prisma db push
npm run db:seed
pm2 start ecosystem.config.js

# Frontend
cd ../frontend
npm install --production
npm run build
pm2 start ecosystem.config.js

# Apache
sudo a2enmod proxy proxy_http ssl headers rewrite deflate
sudo cp ../apache-config.conf /etc/apache2/sites-available/goldmil.conf
sudo a2ensite goldmil
sudo certbot --apache -d goldmil.matrxe.com
sudo systemctl reload apache2
```

---

## 🗄️ جداول قاعدة البيانات (10)

| الجدول | الوصف |
|--------|-------|
| `User` | المستخدمون (admin, manager, editor, viewer) |
| `Project` | المشاريع + تتبع + ميزانيات |
| `Customer` | CRM كامل |
| `Inquiry` | الاستفسارات (مفتوح للنماذج) |
| `DesignRequest` | طلبات التصاميم |
| `Product` | المتجر + المخزون |
| `BlogPost` | مقالات المدونة |
| `Testimonial` | آراء العملاء |
| `Activity` | سجل النشاط |
| `Setting` | إعدادات الموقع |

---

## 🔗 REST API

### عامة (لا تحتاج مصادقة)
```
GET  /api/health
GET  /api/products
GET  /api/products/:id
GET  /api/blog
GET  /api/blog/:slug
GET  /api/testimonials
GET  /api/settings
POST /api/inquiries      ← Contact form من الموقع
POST /api/ai/recommend
```

### المصادقة
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/change-password
```

### الإدارة (تحتاج Bearer token)
```
GET   /api/admin/analytics
GET   /api/admin/projects
POST  /api/admin/projects
PATCH /api/admin/projects/:id
DELETE /api/admin/projects/:id
... نفس النمط لـ:
- /customers
- /design-requests
- /products
- /blog
- /testimonials
- /users
- /settings
- /top-customers
```

---

## 🎨 Design System

نفس هوية الموقع الأصلي:

| Token | القيمة |
|-------|--------|
| `--gold-600` | `#c8962e` |
| `--gold-300` | `#f0c75e` |
| `--ink-900` | `#090913` |
| خط | Cairo + Tajawal |

---

## 🔐 الأدوار

| الدور | المشاريع | العملاء | الاستفسارات | المتجر | المدونة | المستخدمون |
|------|---------|---------|-------------|--------|---------|------------|
| admin | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| manager | CRUD | CRUD | CRUD | CRUD | عرض | ✗ |
| editor | CRUD | CRUD | CRUD | CRUD | CRUD | ✗ |
| viewer | عرض | عرض | عرض | عرض | عرض | ✗ |

---

## 📋 بيانات الدخول الافتراضية

```
البريد:      admin@goldenmile.com.sa
كلمة المرور: Admin@2026
```

⚠️ **غيّرها فوراً في الإنتاج!**

---

## 📞 معلومات التواصل

- **الموقع:** [goldmil.matrxe.com](https://goldmil.matrxe.com)
- **البريد:** info@goldenmile.com.sa
- **الجوال:** +966 53 256 1599

---

**صنع بـ ❤️ للميل الذهبي** 🚀