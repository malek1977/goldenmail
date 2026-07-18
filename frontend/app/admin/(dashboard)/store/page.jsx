"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Download, Eye, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { formatCurrency, getStatusBadge } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/products").then((r) => setProducts(r.data.data || [])).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  const columns = [
    { key: "name", label: "المنتج", sortable: true, render: (p) => <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-300/5 border border-emerald-600/20 flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-emerald-300" /></div><div className="min-w-0"><p className="font-bold text-white truncate">{p.name}</p><p className="text-[11px] text-slate-500 font-mono">{p.sku}</p></div></div> },
    { key: "category", label: "الفئة", sortable: true, render: (p) => <span className="badge badge-neutral">{p.category}</span> },
    { key: "price", label: "السعر", sortable: true, render: (p) => <span className="font-extrabold text-gradient-gold">{formatCurrency(p.price)}</span> },
    { key: "stock", label: "المخزون", sortable: true, render: (p) => { const low = p.stock < 5; return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${low ? "bg-warning/10 text-warning border border-warning/30" : "bg-success/10 text-success border border-success/30"}`}>{low && <AlertTriangle className="w-3 h-3" />}{p.stock}</span>; } },
    { key: "sold", label: "مبيعات", sortable: true, render: (p) => <span className="text-sm text-slate-300">{p.sold}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (p) => { const s = getStatusBadge(p.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "actions", label: "إجراءات", className: "text-left", render: () => <div className="flex items-center gap-1 justify-end"><button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"><Eye className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10"><Edit className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></button></div> },
  ];

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 5).length;
  const totalRev = products.reduce((s, p) => s + p.sold * p.price, 0);

  return (
    <div>
      <PageHeader title="المتجر" description="إدارة منتجات المتجر" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "المتجر" }]} actions={<><button className="btn-outline-gold py-2 text-xs"><Download className="w-4 h-4" /><span>تصدير</span></button><button className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>منتج جديد</span></button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إجمالي المنتجات</p><p className="text-2xl font-extrabold text-white">{products.length}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إجمالي المخزون</p><p className="text-2xl font-extrabold text-success">{totalStock}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">مخزون منخفض</p><p className="text-2xl font-extrabold text-warning">{lowStock}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إيرادات</p><p className="text-2xl font-extrabold text-gradient-gold">{(totalRev / 1000).toFixed(0)}K</p></div>
      </div>
      <DataTable data={products} columns={columns} searchKeys={["name", "sku", "category"]} />
    </div>
  );
}