"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Edit, Trash2, BookOpen, Eye, Heart } from "lucide-react";
import { getStatusBadge, formatDate, formatNumber } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/blog").then((r) => setPosts(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "title", label: "العنوان", sortable: true, render: (b) => <div className="flex items-center gap-3 max-w-md"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-300/5 border border-blue-600/20 flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-blue-300" /></div><div className="min-w-0"><p className="font-bold text-white truncate">{b.title}</p><p className="text-[11px] text-slate-500 line-clamp-1">{b.excerpt}</p></div></div> },
    { key: "category", label: "الفئة", sortable: true, render: (b) => <span className="badge badge-neutral">{b.category}</span> },
    { key: "authorName", label: "الكاتب", sortable: true, render: (b) => <span className="text-sm text-slate-300">{b.authorName}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (b) => { const s = getStatusBadge(b.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "views", label: "المشاهدات", sortable: true, render: (b) => <span className="inline-flex items-center gap-1 text-xs text-slate-300"><Eye className="w-3 h-3" />{formatNumber(b.views)}</span> },
    { key: "likes", label: "الإعجابات", sortable: true, render: (b) => <span className="inline-flex items-center gap-1 text-xs text-pink-300"><Heart className="w-3 h-3" />{formatNumber(b.likes)}</span> },
    { key: "publishedAt", label: "تاريخ النشر", sortable: true, render: (b) => <span className="text-xs text-slate-300">{b.publishedAt ? formatDate(b.publishedAt) : "—"}</span> },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><Eye className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button></div> },
  ];

  return (
    <div>
      <PageHeader title="المدونة" description="إدارة مقالات المدونة" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "المدونة" }]} actions={<button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>مقال جديد</span></button>} />
      <DataTable data={posts} columns={columns} searchKeys={["title", "authorName", "category", "excerpt"]} />
    </div>
  );
}