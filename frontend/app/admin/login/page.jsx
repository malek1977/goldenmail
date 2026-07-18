"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, Shield, AlertCircle, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.push(from);
  }, [user, loading, router, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("تم تسجيل الدخول");
      router.push(from);
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.message || "بيانات الدخول غير صحيحة";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-ink-900">
      <div className="w-full max-w-md space-y-8">
        <div className="lg:hidden text-center space-y-3">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-300 items-center justify-center">
            <Shield className="w-8 h-8 text-ink-900" />
          </div>
          <h1 className="text-2xl font-extrabold text-gradient-gold">الميل الذهبي</h1>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white font-tajawal">مرحباً بعودتك</h2>
          <p className="text-sm text-slate-400 mt-1.5">سجّل دخولك للوصول للوحة التحكم</p>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-info/10 border border-info/30 text-info text-xs">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold mb-1">بيانات تجريبية:</p>
            <p className="font-mono text-[11px]">admin@goldenmile.com.sa</p>
            <p className="font-mono text-[11px]">Admin@2026</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input pr-10" placeholder="admin@goldenmile.com.sa" autoComplete="email" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-10 pl-10" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-gold w-full py-3">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>{submitting ? "جاري الدخول..." : "تسجيل الدخول"}</span>
          </button>

          <Link href="/" className="btn-outline-gold w-full py-3">العودة للموقع الرئيسي</Link>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-600/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-300/5 blur-[150px]" />
        </div>
        <div className="relative max-w-md text-center space-y-8">
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
            <defs>
              <linearGradient id="loginGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c8962e" /><stop offset="50%" stopColor="#f0c75e" /><stop offset="100%" stopColor="#d4a843" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#loginGrad)" strokeWidth="3" fill="none" />
            <path d="M 28 72 C 38 65, 52 48, 55 35 C 57 25, 48 20, 42 22 C 35 25, 30 35, 32 45 C 34 52, 45 62, 58 60 C 70 58, 75 42, 74 32 C 73 25, 68 20, 68 20" stroke="url(#loginGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 68 20 L 76 22 L 72 30 Z" fill="url(#loginGrad)" />
          </svg>
          <div>
            <h1 className="text-4xl font-extrabold text-gradient-gold font-tajawal mb-3">لوحة تحكم الميل الذهبي</h1>
            <p className="text-slate-400 leading-relaxed">إدارة شاملة لمشاريع المقاولات والديكورات من مكان واحد.</p>
          </div>
          <p className="text-xs text-slate-500 pt-6">© 2026 مؤسسة الميل الذهبي</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-ink-900">
          <div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
