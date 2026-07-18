"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, ChevronDown, Globe } from "lucide-react";
import { getInitials, getAvatarColor, timeAgo, cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

export function Topbar() {
  const { user } = useAuth();
  const [now, setNow] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const tick = () => setNow(new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
    tick();
    const id = setInterval(tick, 60_000);

    api.get("/admin/analytics").then((r) => setActivities(r.data.activities || [])).catch(() => {});
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass border-b border-gold-600/10 h-20 flex items-center px-4 sm:px-6 gap-4">
      <div className="hidden md:block">
        <p className="text-xs text-slate-500">{now}</p>
        <p className="text-sm font-bold text-gold-300">مرحباً {user?.name?.split(" ")[0]} 👋</p>
      </div>

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="search" placeholder="بحث..." className="w-full bg-ink-900/60 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:border-gold-600/50 focus:outline-none" />
        </div>
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <a href="https://goldmil.matrxe.com" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-gold-300 hover:bg-white/5">
          <Globe className="w-4 h-4" />الموقع الرئيسي
        </a>
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 rounded-xl text-slate-300 hover:text-gold-300 hover:bg-white/5">
            <Bell className="w-5 h-5" />
            {activities.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-ink-800 animate-pulse-gold" />}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-gold-300">النشاط الأخير</h3>
                  <span className="text-xs text-slate-500">{activities.length} عنصر</span>
                </div>
                <ul className="max-h-96 overflow-y-auto divide-y divide-white/5">
                  {activities.slice(0, 8).map((n) => (
                    <li key={n.id} className="p-4 hover:bg-white/5">
                      <p className="text-sm font-bold text-white line-clamp-1">{n.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-600 to-gold-300 flex items-center justify-center text-xs font-extrabold text-ink-900">
          {getInitials(user?.name || "U")}
        </div>
      </div>
    </header>
  );
}