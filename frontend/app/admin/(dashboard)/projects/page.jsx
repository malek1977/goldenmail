"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, Eye, Edit, Trash2, FolderKanban, MapPin } from "lucide-react";
import { formatCurrency, getStatusBadge, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const TYPE = { residential: "سكني", commercial: "تجاري", industrial: "صناعي" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/projects").then((r) => setProjects(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    {
      key: "name", label: "اسم المشروع", sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600/20 to-gold-300/5 border border-gold-600/20 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-4 h-4 text-gold-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{p.name}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>
          </div>
        </div>
      ),
    },
    { key: "clientName", label: "العميل", sortable: true, render: (p) => <div className="flex items-center gap-2"><Avatar name={p.clientName} size="sm" /><span className="text-slate-200">{p.clientName}</span></div> },
    { key: "type", label: "النوع", sortable: true, render: (p) => <span className="badge badge-neutral">{TYPE[p.type]}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (p) => { const s = getStatusBadge(p.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    {
      key: "progress", label: "التقدم", sortable: true,
      render: (p) => (
        <div className="w-28">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-slate-500">نسبة الإنجاز</span>
            <span className="text-gold-300 font-bold">{p.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-l from-gold-600 to-gold-300 rounded-full" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
      ),
    },
    { key: "budget", label: "الميزانية", sortable: true, render: (p) => <div><p className="font-extrabold text-gradient-gold">{formatCurrency(p.budget)}</p><p className="text-[10px] text-slate-500">منفق: {formatCurrency(p.spent)}</p></div> },
    { key: "endDate", label: "التسليم", sortable: true, render: (p) => <span className="text-xs text-slate-300">{formatDate(p.endDate)}</span> },
    {
      key: "actions", label: "إجراءات", className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-info hover:bg-info/5"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المشاريع"
        description={`إدارة مشاريع المؤسسة (${projects.length} مشروع)`}
        breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "المشاريع" }]}
        actions={<><button className="btn-outline-gold py-2 text-xs"><Download className="w-4 h-4" /><span>تصدير</span></button><button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>مشروع جديد</span></button></>}
      />
      <DataTable data={projects} columns={columns} searchKeys={["name", "clientName", "location", "manager"]} />
    </div>
  );
}