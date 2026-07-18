"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, ShieldCheck, MoreHorizontal } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const ROLE = { admin: { label: "مدير عام", class: "badge-gold" }, manager: { label: "مدير", class: "badge-info" }, editor: { label: "محرر", class: "badge-success" }, viewer: { label: "مشاهد", class: "badge-neutral" } };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users").then((r) => setUsers(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "name", label: "المستخدم", sortable: true, render: (u) => <div className="flex items-center gap-3"><Avatar name={u.name} size="md" /><div className="min-w-0"><p className="font-bold text-white truncate">{u.name}</p><p className="text-[11px] text-slate-500 truncate">{u.email}</p></div></div> },
    { key: "phone", label: "الجوال", render: (u) => <span className="text-xs text-slate-300" dir="ltr">{u.phone || "—"}</span> },
    { key: "role", label: "الدور", sortable: true, render: (u) => { const r = ROLE[u.role] || ROLE.viewer; return <span className={`badge ${r.class}`}>{r.label}</span>; } },
    { key: "isActive", label: "الحالة", sortable: true, render: (u) => <span className={`badge ${u.isActive ? "badge-success" : "badge-neutral"}`}>{u.isActive ? "نشط" : "موقوف"}</span> },
    { key: "lastLogin", label: "آخر دخول", sortable: true, render: (u) => <span className="text-xs text-slate-400">{u.lastLogin ? timeAgo(u.lastLogin) : "—"}</span> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><ShieldCheck className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><MoreHorizontal className="w-4 h-4" /></button></div> },
  ];

  return (
    <div>
      <PageHeader title="المستخدمون" description="إدارة مستخدمي لوحة التحكم" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "المستخدمون" }]} actions={<button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>دعوة مستخدم</span></button>} />
      <DataTable data={users} columns={columns} searchKeys={["name", "email", "phone"]} />
    </div>
  );
}