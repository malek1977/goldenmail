#!/bin/bash
# ════════════════════════════════════════════════════════════════
# سكربت الرفع والتثبيت على Hostinger (/var/www/html)
# ════════════════════════════════════════════════════════════════
# الاستخدام: bash deploy.sh YOUR_SERVER_IP

set -e

SERVER="${1:-your-server-ip}"
PROJECT_NAME="golden-mile"
REMOTE_DIR="/var/www/html"
BACKEND_DIR="$REMOTE_DIR/backend"
FRONTEND_DIR="$REMOTE_DIR/frontend"

echo "═══════════════════════════════════════════"
echo "🚀 Golden Mile — Deployment to $SERVER"
echo "═══════════════════════════════════════════"

# 1) بناء محلي (next build)
echo ""
echo "📦 [1/7] Building frontend locally..."
cd frontend && npm install --production --silent && npm run build 2>&1 | tail -5
cd ..

# 2) ضغط المشروع
echo ""
echo "📦 [2/7] Creating project archive..."
cd /tmp && rm -f golden-mile.zip
cd /workspace/goldmil-integration
zip -r /tmp/golden-mile.zip . -x "*/node_modules/*" "*/.next/*" "*/.git/*" "*/dist/*" > /dev/null
echo "   ✓ Archive: /tmp/golden-mile.zip ($(du -h /tmp/golden-mile.zip | cut -f1))"

# 3) رفع
echo ""
echo "📤 [3/7] Uploading to server..."
scp /tmp/golden-mile.zip "root@$SERVER:/tmp/"

# 4) التثبيت على السيرفر
echo ""
echo "⚙️  [4/7] Installing on server..."
ssh "root@$SERVER" << 'EOF'
set -e
cd /var/www/html

# Backup existing
if [ -d backend ] || [ -d frontend ]; then
  echo "   📦 Backing up existing project..."
  tar -czf /tmp/golden-mile-backup-$(date +%Y%m%d-%H%M%S).tar.gz backend frontend 2>/dev/null || true
fi

# Clean
rm -rf backend frontend
mkdir -p backend frontend

# Extract
unzip -q /tmp/golden-mile.zip -d /tmp/golden-mile-extract
cp -r /tmp/golden-mile-extract/* backend/ 2>/dev/null
cp -r /tmp/golden-mile-extract/frontend/* frontend/ 2>/dev/null

# Set permissions
chown -R www-data:www-data /var/www/html/backend /var/www/html/frontend
chmod -R 755 /var/www/html/backend /var/www/html/frontend

echo "   ✓ Files extracted"
EOF

# 5) Backend setup
echo ""
echo "🗄️  [5/7] Setting up backend (DB + Prisma)..."
ssh "root@$SERVER" << 'EOF'
set -e
cd /var/www/html/backend

# Install dependencies
echo "   📦 Installing backend dependencies..."
npm install --production --silent 2>&1 | tail -3

# Setup .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  SECRET=$(openssl rand -hex 32)
  sed -i "s|JWT_SECRET=.*|JWT_SECRET=$SECRET|" .env
  echo "   ✓ .env created with random JWT_SECRET"
fi

# Push DB schema
echo "   🗄️  Pushing DB schema..."
npx prisma db push 2>&1 | tail -3

# Seed (optional)
echo "   🌱 Seeding sample data..."
npm run db:seed 2>&1 | tail -3 || true

echo "   ✓ Backend ready"
EOF

# 6) Frontend build
echo ""
echo "🏗️  [6/7] Building frontend..."
ssh "root@$SERVER" << 'EOF'
set -e
cd /var/www/html/frontend

# Install
echo "   📦 Installing frontend dependencies..."
npm install --production --silent 2>&1 | tail -3

# .env.local
if [ ! -f .env.local ]; then
  cat > .env.local << EOL
NEXT_PUBLIC_API_URL=https://goldmil.matrxe.com
NODE_ENV=production
EOL
  echo "   ✓ .env.local created"
fi

# Build
echo "   🏗️  Building Next.js..."
npm run build 2>&1 | tail -8

echo "   ✓ Frontend built"
EOF

# 7) PM2 setup
echo ""
echo "🚀 [7/7] Setting up PM2..."
ssh "root@$SERVER" << 'EOF'
set -e
cd /var/www/html/backend

# Create ecosystem
cat > ecosystem.config.js << 'EOL'
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
EOL

# Start with PM2
pm2 delete golden-mile-api 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd 2>/dev/null || true

# Restart frontend
cd /var/www/html/frontend
pm2 delete golden-mile-web 2>/dev/null || true
cat > ecosystem.config.js << 'EOL'
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
EOL
pm2 start ecosystem.config.js
pm2 save

echo "   ✓ PM2 running both apps"
pm2 status
EOF

echo ""
echo "═══════════════════════════════════════════"
echo "✅ النشر مكتمل!"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 الموقع: https://goldmil.matrxe.com"
echo "🔐 لوحة التحكم: https://goldmil.matrxe.com/admin/login"
echo "📊 الـ API: https://goldmil.matrxe.com/api/health"
echo ""
echo "📋 بيانات الدخول:"
echo "   البريد: admin@goldenmile.com.sa"
echo "   كلمة المرور: Admin@2026"
echo ""
echo "⚠️  لا تنسَ:"
echo "   1. أضف DNS لـ admin subdomain في Hostinger"
echo "   2. فعّل Apache proxy (راجع DEPLOYMENT.md)"
echo "   3. فعّل SSL عبر certbot"
echo "   4. غيّر كلمة مرور الأدمن فوراً"