"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Check, X, Star, Edit, Trash2, Eye } from "lucide-react";
import { getStatusBadge, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TestimonialsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/testimonials").then((r) => setData(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "customerName", label: "العميل", sortable: true, render: (t) => <div className="flex items-center gap-3"><Avatar name={t.customerName} size="md" /><div className="min-w-0"><p className="font-bold text-white truncate">{t.customerName}</p>{t.customerRole && <p className="text-[11px] text-slate-500 truncate">{t.customerRole}</p>}</div></div> },
    { key: "rating", label: "التقييم", sortable: true, render: (t) => <div className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-gold-300 text-gold-300" : "text-slate-600"}`} />)}</div> },
    { key: "content", label: "الرأي", render: (t) => <p className="text-xs text-slate-400 line-clamp-2 max-w-md">{t.content}</p> },
    { key: "featured", label: "مميز", sortable: true, render: (t) => t.featured ? <span className="badge badge-gold">مميز</span> : <span className="text-xs text-slate-500">—</span> },
    { key: "status", label: "الحالة", sortable: true, render: (t) => { const s = getStatusBadge(t.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "createdAt", label: "التاريخ", sortable: true, render: (t) => <span className="text-xs text-slate-400">{formatDate(t.createdAt)}</span> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-success hover:bg-success/5"><Check className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><X className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><Eye className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button></div> },
  ];

  return (
    <div>
      <PageHeader title="آراء العملاء" description="إدارة تقييمات العملاء" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "آراء العملاء" }]} actions={<button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>إضافة رأي</span></button>} />
      <DataTable data={data} columns={columns} searchKeys={["customerName", "customerRole", "content"]} />
    </div>
  );
}