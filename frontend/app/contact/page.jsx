"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const { data } = await API.post("/inquiries", { ...form, source: "contact_form", priority: "medium" });
      if (data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        toast.success("تم استلام رسالتك، سنتواصل معك قريباً");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
      toast.error("فشل الإرسال");
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-ink-900 flex items-center justify-center p-6" dir="rtl">
        <div className="card p-10 max-w-md text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-gold-300 mx-auto" />
          <h2 className="text-2xl font-extrabold text-white">تم استلام رسالتك!</h2>
          <p className="text-slate-400">سنتواصل معك خلال 24 ساعة</p>
          <button onClick={() => setSuccess(false)} className="btn-outline-gold">إرسال رسالة أخرى</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink-900 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gradient-gold mb-2">اتصل بنا</h1>
        <p className="text-slate-400 mb-8">أرسل لنا استفسارك وسنرد عليك بأقرب وقت</p>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الاسم *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">البريد *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" dir="ltr" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الجوال *</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" dir="ltr" placeholder="+966 5X XXX XXXX" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الموضوع</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">الرسالة *</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full py-3">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
          </button>
        </form>
      </div>
    </main>
  );
}