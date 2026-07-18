"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, Eye, Reply, Phone, Mail } from "lucide-react";
import { getStatusBadge, getPriorityBadge, timeAgo, formatDateTime } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const SOURCE = { contact_form: "نموذج التواصل", design_studio: "استوديو التصميم", store: "المتجر", phone: "هاتفي" };

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/inquiries").then((r) => setInquiries(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "name", label: "المرسل", sortable: true, render: (i) => <div className="flex items-center gap-3"><Avatar name={i.name} size="md" /><div className="min-w-0"><p className="font-bold text-white truncate">{i.name}</p><p className="text-[11px] text-slate-500 truncate" dir="ltr">{i.phone}</p></div></div> },
    { key: "subject", label: "الموضوع", sortable: true, render: (i) => <div className="max-w-xs"><p className="text-sm font-semibold text-white truncate">{i.subject}</p><p className="text-[11px] text-slate-500 line-clamp-1">{i.message}</p></div> },
    { key: "source", label: "المصدر", sortable: true, render: (i) => <span className="badge badge-neutral">{SOURCE[i.source] || i.source}</span> },
    { key: "priority", label: "الأولوية", sortable: true, render: (i) => { const p = getPriorityBadge(i.priority); return <span className={`badge ${p.class}`}>{p.label}</span>; } },
    { key: "status", label: "الحالة", sortable: true, render: (i) => { const s = getStatusBadge(i.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "assignedTo", label: "مسؤول", render: (i) => <span className="text-xs text-slate-400">{i.assignedTo?.name || "—"}</span> },
    { key: "createdAt", label: "التاريخ", sortable: true, render: (i) => <div><p className="text-xs text-slate-300">{formatDateTime(i.createdAt)}</p><p className="text-[10px] text-slate-500">{timeAgo(i.createdAt)}</p></div> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-success hover:bg-success/5"><Phone className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-info hover:bg-info/5"><Mail className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Reply className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><Eye className="w-4 h-4" /></button></div> },
  ];

  const newCount = inquiries.filter((i) => i.status === "new").length;
  const inProgressCount = inquiries.filter((i) => i.status === "in_progress").length;
  const highCount = inquiries.filter((i) => i.priority === "high").length;

  return (
    <div>
      <PageHeader title="الاستفسارات" description="إدارة استفسارات العملاء من الموقع" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "الاستفسارات" }]} actions={<><button className="btn-outline-gold py-2 text-xs"><Download className="w-4 h-4" /><span>تصدير</span></button><button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>استفسار يدوي</span></button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">جديد</p><p className="text-2xl font-extrabold text-info">{newCount}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">قيد المعالجة</p><p className="text-2xl font-extrabold text-warning">{inProgressCount}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">أولوية عالية</p><p className="text-2xl font-extrabold text-danger">{highCount}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إجمالي</p><p className="text-2xl font-extrabold text-gradient-gold">{inquiries.length}</p></div>
      </div>
      <DataTable data={inquiries} columns={columns} searchKeys={["name", "email", "phone", "subject", "message"]} />
    </div>
  );
}