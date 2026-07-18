"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, Eye, Edit, Trash2, Phone, Mail, MessageCircle } from "lucide-react";
import { formatCurrency, getStatusBadge, timeAgo } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const SOURCE = { website: "الموقع", referral: "إحالة", social: "سوشال", ads: "إعلانات" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/customers").then((r) => setCustomers(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "name", label: "العميل", sortable: true, render: (c) => <div className="flex items-center gap-3"><Avatar name={c.name} size="md" /><div className="min-w-0"><p className="font-bold text-white truncate">{c.name}</p><p className="text-[11px] text-slate-500 truncate">{c.email}</p></div></div> },
    { key: "phone", label: "الجوال", render: (c) => <a href={`tel:${c.phone}`} className="text-xs text-slate-300 hover:text-gold-300" dir="ltr">{c.phone}</a> },
    { key: "city", label: "المدينة", sortable: true, render: (c) => <span className="text-sm text-slate-300">{c.city}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (c) => { const s = getStatusBadge(c.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "projectsCount", label: "المشاريع", sortable: true, render: (c) => <span className="px-2.5 py-1 rounded-lg bg-gold-600/10 border border-gold-600/20 text-gold-300 text-xs font-bold">{c.projectsCount}</span> },
    { key: "totalSpent", label: "إجمالي الإنفاق", sortable: true, render: (c) => <span className="font-extrabold text-gradient-gold">{formatCurrency(c.totalSpent)}</span> },
    { key: "source", label: "المصدر", sortable: true, render: (c) => <span className="text-xs text-slate-400">{SOURCE[c.source]}</span> },
    { key: "lastContact", label: "آخر تواصل", sortable: true, render: (c) => <span className="text-xs text-slate-400">{timeAgo(c.lastContact)}</span> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-success hover:bg-success/5"><Phone className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-info hover:bg-info/5"><Mail className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><MessageCircle className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><Eye className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button></div> },
  ];

  return (
    <div>
      <PageHeader title="العملاء" description={`قاعدة بيانات العملاء (${customers.length} عميل)`} breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "العملاء" }]} actions={<><button className="btn-outline-gold py-2 text-xs"><Download className="w-4 h-4" /><span>تصدير</span></button><button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>عميل جديد</span></button></>} />
      <DataTable data={customers} columns={columns} searchKeys={["name", "email", "phone", "city"]} />
    </div>
  );
}