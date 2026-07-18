# 🚀 دليل النشر الكامل — Golden Mile

> النشر على Hostinger VPS/Dedicated مع `/var/www/html` كجذر

---

## 📋 المتطلبات

| المتطلب | الإصدار |
|---------|---------|
| Ubuntu | 20.04+ / 22.04 |
| Node.js | 18+ أو 20+ |
| Apache | 2.4+ مع mod_proxy, mod_ssl |
| RAM | 1GB على الأقل |
| مساحة | 500MB |

---

## 🔧 المرحلة 1: تجهيز السيرفر

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 + أدوات
sudo npm install -g pm2
sudo apt install -y apache2 certbot python3-certbot-apache unzip
```

---

## 📤 المرحلة 2: رفع المشروع

### الخيار A: سكربت تلقائي (الأسهل)

```bash
# من جهازك المحلي
bash deploy.sh YOUR_SERVER_IP
```

### الخيار B: يدوي

```bash
# ضغط المشروع
cd /workspace/goldmil-integration
zip -r /tmp/golden-mile.zip . -x "*/node_modules/*" "*/.next/*"

# رفع
scp /tmp/golden-mile.zip root@YOUR_SERVER:/tmp/

# على السيرفر
cd /var/www/html
unzip -q /tmp/golden-mile.zip -d /tmp/golden-mile
# ثم انقل backend و frontend
```

---

## 🗄️ المرحلة 3: Backend (Express + Prisma)

```bash
cd /var/www/html/backend

# تثبيت
npm install --production

# الإعدادات
cp .env.example .env
nano .env
```

**ضع JWT_SECRET قوي:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL="file:./prisma/production.db"
JWT_SECRET="$(openssl rand -hex 32)"
JWT_EXPIRES_IN="7d"
ALLOWED_ORIGINS="https://goldmil.matrxe.com,https://www.goldmil.matrxe.com"
ADMIN_EMAIL="admin@goldenmile.com.sa"
ADMIN_PASSWORD="كلمة-مرور-جديدة-قوية"
ADMIN_NAME="أحمد العتيبي"
```

```bash
# إنشاء قاعدة البيانات
npx prisma db push

# تعبئة البيانات
npm run db:seed

# حماية
chmod 600 .env
chmod 700 prisma/
chown -R www-data:www-data /var/www/html/backend
```

---

## 🎨 المرحلة 4: Frontend (Next.js)

```bash
cd /var/www/html/frontend

npm install --production

# إعدادات
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://goldmil.matrxe.com
NODE_ENV=production
EOF

# بناء
npm run build

chown -R www-data:www-data /var/www/html/frontend
```

---

## 🚀 المرحلة 5: PM2 (تشغيل دائم)

```bash
# Backend
cd /var/www/html/backend
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'golden-mile-api',
    cwd: '/var/www/html/backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: { NODE_ENV: 'production', PORT: 5000 },
  }],
};
EOF
pm2 start ecosystem.config.js

# Frontend
cd /var/www/html/frontend
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'golden-mile-web',
    cwd: '/var/www/html/frontend',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: { NODE_ENV: 'production', PORT: 3000 },
  }],
};
EOF
pm2 start ecosystem.config.js

pm2 save
pm2 startup
# شغّل الأمر اللي يطلع (يبدأ PM2 مع السيرفر)
```

---

## 🌐 المرحلة 6: Apache + SSL

```bash
# فعّل modules
sudo a2enmod proxy proxy_http proxy_wstunnel ssl headers rewrite deflate
sudo systemctl restart apache2

# ضع الإعدادات
sudo cp /var/www/html/apache-config.conf /etc/apache2/sites-available/goldmil.conf
sudo a2ensite goldmil
sudo apache2ctl configtest

# SSL مجاني
sudo certbot --apache -d goldmil.matrxe.com -d www.goldmil.matrxe.com

# فعّل
sudo systemctl reload apache2
```

---

## ✅ المرحلة 7: التحقق

```bash
# حالة PM2
pm2 status

# السجلات
pm2 logs golden-mile-api
pm2 logs golden-mile-web

# اختبارات
curl -I https://goldmil.matrxe.com
curl -I https://goldmil.matrxe.com/admin/login
curl https://goldmil.matrxe.com/api/health
```

---

## 🔄 التحديث لاحقاً

```bash
# على السيرفر
cd /var/www/html
# ارفع الملفات الجديدة
unzip -o /tmp/golden-mile.zip -d /tmp/golden-mile
cp -r /tmp/golden-mile/backend/* backend/
cp -r /tmp/golden-mile/frontend/* frontend/

# أعد البناء
cd backend && npm install --production && pm2 restart golden-mile-api
cd ../frontend && npm install --production && npm run build && pm2 restart golden-mile-web
```

---

## 🐛 حل المشاكل

### ❌ 502 Bad Gateway
```bash
pm2 status
pm2 logs --lines 100
pm2 restart golden-mile-api
pm2 restart golden-mile-web
```

### ❌ خطأ قاعدة البيانات
```bash
cd /var/www/html/backend
ls -la prisma/
# لو الملف غير موجود:
npx prisma db push
npm run db:seed
```

### ❌ CORS errors
تأكد إن `ALLOWED_ORIGINS` في `.env` يحتوي على `https://goldmil.matrxe.com`

### ❌ Apache لا يقرأ .env
```bash
sudo systemctl restart apache2
sudo tail -f /var/log/apache2/goldmil-error.log
```

### ❌ PM2 لا يبدأ مع السيرفر
```bash
pm2 unstartup
pm2 startup
# شغّل الأمر اللي يطلع
pm2 save
```

---

## 📊 الملخص

| الخدمة | المنفذ | العملية |
|--------|--------|---------|
| Next.js Frontend | 3000 | `golden-mile-web` |
| Express API | 5000 | `golden-mile-api` |
| Apache (proxy) | 80/443 | `apache2` |
| SQLite DB | ملف | `backend/prisma/production.db` |

**النتيجة:**
- 🌐 `https://goldmil.matrxe.com` — الموقع
- 🔐 `https://goldmil.matrxe.com/admin/login` — لوحة التحكم
- 📡 `https://goldmil.matrxe.com/api/*` — REST API

---

**النشر الكامل خلال 15-20 دقيقة** ⚡