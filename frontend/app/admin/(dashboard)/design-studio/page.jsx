"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Edit, Image as ImageIcon, Palette, Calendar, Wallet } from "lucide-react";
import { getStatusBadge, formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const ROOM = { living: "صالة المعيشة", bedroom: "غرفة نوم", kitchen: "مطبخ", bathroom: "حمام", office: "مكتب", outdoor: "خارجي" };
const STYLE = { modern: "عصري", classic: "كلاسيكي", minimal: "بسيط", luxury: "فاخر" };

export default function DesignStudioPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/design-requests").then((r) => setData(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "projectName", label: "اسم المشروع", sortable: true, render: (d) => <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/5 border border-purple-600/20 flex items-center justify-center flex-shrink-0"><Palette className="w-4 h-4 text-purple-300" /></div><div className="min-w-0"><p className="font-bold text-white truncate">{d.projectName}</p><p className="text-[11px] text-slate-500">{d.customerName}</p></div></div> },
    { key: "roomType", label: "نوع الغرفة", sortable: true, render: (d) => <span className="badge badge-neutral">{ROOM[d.roomType]}</span> },
    { key: "style", label: "الستايل", sortable: true, render: (d) => <span className="badge badge-gold">{STYLE[d.style]}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (d) => { const s = getStatusBadge(d.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "budget", label: "الميزانية", sortable: true, render: (d) => <span className="font-extrabold text-gradient-gold inline-flex items-center gap-1"><Wallet className="w-3 h-3" />{formatCurrency(d.budget)}</span> },
    { key: "deadline", label: "الموعد", sortable: true, render: (d) => <span className="text-xs text-slate-300 inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(d.deadline)}</span> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-600/10"><ImageIcon className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button></div> },
  ];

  return (
    <div>
      <PageHeader title="استوديو التصميم" description="إدارة طلبات التصاميم ثلاثية الأبعاد" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "استوديو التصميم" }]} actions={<button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>طلب جديد</span></button>} />
      <DataTable data={data} columns={columns} searchKeys={["projectName", "customerName"]} />
    </div>
  );
}