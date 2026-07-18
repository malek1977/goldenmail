"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Save, Lock, User, Palette, Globe, Database, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

const SECTIONS = [
  { id: "profile", label: "الملف الشخصي", icon: User },
  { id: "security", label: "الأمان", icon: Lock },
  { id: "appearance", label: "المظهر", icon: Palette },
  { id: "site", label: "إعدادات الموقع", icon: Globe },
  { id: "integrations", label: "التكاملات", icon: Database },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone || ""); }
    api.get("/admin/settings").then((r) => setSettings(r.data.data || {})).catch(() => {});
  }, [user]);

  async function saveProfile() {
    setSaving(true);
    try {
      await api.patch(`/admin/users/${user.id}`, { name, phone });
      toast.success("تم حفظ الملف الشخصي");
    } catch { toast.error("فشل الحفظ"); }
    finally { setSaving(false); }
  }

  async function changePassword() {
    if (newPwd.length < 8) return toast.error("8 أحرف على الأقل");
    if (newPwd !== confirmPwd) return toast.error("كلمات المرور غير متطابقة");
    setSaving(true);
    try {
      await api.post("/auth/change-password", { currentPassword: currentPwd, newPassword: newPwd });
      toast.success("تم تغيير كلمة المرور");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (e) { toast.error(e.response?.data?.message || "فشل التغيير"); }
    finally { setSaving(false); }
  }

  async function saveSite() {
    setSaving(true);
    try {
      await api.post("/admin/settings", settings);
      toast.success("تم حفظ إعدادات الموقع");
    } catch { toast.error("فشل الحفظ"); }
    finally { setSaving(false); }
  }

  function updateSetting(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  return (
    <div>
      <PageHeader title="الإعدادات" description="إدارة حسابك وإعدادات لوحة التحكم" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "الإعدادات" }]} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <nav className="card p-2 space-y-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active === s.id ? "bg-gradient-to-l from-gold-600/20 to-gold-600/5 text-gold-300 border border-gold-600/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                  <Icon className="w-4 h-4" /><span>{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {active === "profile" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">الملف الشخصي</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-300 mb-2">الاسم</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">البريد</label><input className="input" value={user?.email || ""} disabled /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">الجوال</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">الدور</label><input className="input" value={user?.role || ""} disabled /></div>
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-gold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>حفظ</span></button>
            </div>
          )}

          {active === "security" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">الأمان</h2>
              <div className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-300 mb-2">كلمة المرور الحالية</label><input className="input" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-300 mb-2">الجديدة</label><input className="input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-slate-300 mb-2">تأكيد</label><input className="input" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} /></div>
                </div>
              </div>
              <button onClick={changePassword} disabled={saving || !newPwd} className="btn-gold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}<span>تغيير كلمة المرور</span></button>
            </div>
          )}

          {active === "appearance" && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">المظهر</h2>
              <div>
                <p className="text-xs font-bold text-slate-300 mb-3">اللون الأساسي</p>
                <div className="flex items-center gap-2">
                  {[{ c: "#c8962e", name: "ذهبي الموقع" }, { c: "#3b82f6" }, { c: "#10b981" }, { c: "#ef4444" }, { c: "#a855f7" }].map((x) => (
                    <button key={x.c} style={{ background: x.c }} className="w-10 h-10 rounded-xl ring-2 ring-offset-2 ring-offset-ink-800 hover:scale-110 transition-transform" title={x.name} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300 mb-3">الثيم</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-xl bg-ink-900 border-2 border-gold-600 text-right"><p className="text-sm font-bold text-gold-300">داكن</p><p className="text-[11px] text-slate-500">الثيم الحالي</p></button>
                  <button className="p-4 rounded-xl bg-white border-2 border-white/10 text-right opacity-50"><p className="text-sm font-bold text-ink-900">فاتح</p><p className="text-[11px] text-slate-400">قريباً</p></button>
                </div>
              </div>
            </div>
          )}

          {active === "site" && (
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">إعدادات الموقع</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-300 mb-2">اسم الموقع</label><input className="input" value={settings.site_name || ""} onChange={(e) => updateSetting("site_name", e.target.value)} /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">رقم الجوال</label><input className="input" value={settings.site_phone || ""} onChange={(e) => updateSetting("site_phone", e.target.value)} dir="ltr" /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">بريد التواصل</label><input className="input" type="email" value={settings.site_email || ""} onChange={(e) => updateSetting("site_email", e.target.value)} dir="ltr" /></div>
                <div><label className="block text-xs font-bold text-slate-300 mb-2">واتساب</label><input className="input" value={settings.whatsapp_number || ""} onChange={(e) => updateSetting("whatsapp_number", e.target.value)} dir="ltr" placeholder="966XXXXXXXXX" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-300 mb-2">العنوان</label><input className="input" value={settings.site_address || ""} onChange={(e) => updateSetting("site_address", e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-2">ساعات العمل</label><input className="input" value={settings.working_hours || ""} onChange={(e) => updateSetting("working_hours", e.target.value)} /></div>
              <button onClick={saveSite} disabled={saving} className="btn-gold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>حفظ</span></button>
            </div>
          )}

          {active === "integrations" && (
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">التكاملات</h2>
              {["Google Analytics", "WhatsApp Business API", "Mailchimp", "Moyasar / Stripe", "Twilio SMS"].map((name) => (
                <div key={name} className="flex items-center justify-between p-4 rounded-xl border border-white/5">
                  <div><p className="text-sm font-bold text-white">{name}</p><p className="text-xs text-slate-500">جاهز للربط</p></div>
                  <button className="btn-outline-gold text-xs py-1.5 px-3">ربط</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}