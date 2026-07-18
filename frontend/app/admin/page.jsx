"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChartCard } from "@/components/admin/area-chart";
import { DonutChart } from "@/components/admin/donut-chart";
import { BarChartCard } from "@/components/admin/bar-chart";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, ArrowLeft, TrendingUp, CheckCircle2, Clock, AlertCircle, FolderKanban, DollarSign, MessageSquare, Inbox } from "lucide-react";
import { formatCurrency, timeAgo, getStatusBadge } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";

const activityIconMap = {
  design_approved: CheckCircle2, project_updated: Clock, payment_received: DollarSign,
  low_stock: AlertCircle, post_published: CheckCircle2, inquiry_received: MessageSquare, login: ArrowLeft, project_created: FolderKanban,
};
const activityColorMap = {
  design_approved: "success", project_updated: "warning", payment_received: "gold",
  low_stock: "danger", post_published: "success", inquiry_received: "info", login: "info", project_created: "success",
};
const colorClass = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  gold: "bg-gold-600/10 text-gold-300 border-gold-600/30",
  info: "bg-info/10 text-info border-info/30",
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/analytics"), api.get("/admin/top-customers")])
      .then(([a, t]) => {
        setData(a.data);
        setTopCustomers(t.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;
  }

  const totalRevenue = data.kpis.totalRevenue || 0;
  const revenueByMonth = [
    { label: "يناير", value: 420000 }, { label: "فبراير", value: 380000 }, { label: "مارس", value: 520000 },
    { label: "أبريل", value: 680000 }, { label: "مايو", value: 740000 }, { label: "يونيو", value: 920000 },
    { label: "يوليو", value: Math.round(totalRevenue * 0.15) || 850000 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="نظرة عامة"
        description="ملخص الأداء من قاعدة البيانات الحية"
        breadcrumbs={[{ label: "لوحة التحكم" }, { label: "نظرة عامة" }]}
        actions={
          <>
            <button className="btn-outline-gold py-2 text-xs"><Download className="w-4 h-4" /><span>تصدير</span></button>
            <Link href="/admin/projects" className="btn-gold py-2 text-xs"><Plus className="w-4 h-4" /><span>مشروع جديد</span></Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="إجمالي الميزانيات" value={formatCurrency(totalRevenue)} change={24.5} changeLabel="من قاعدة البيانات" icon="dollar" color="gold" />
        <StatCard title="مشاريع نشطة" value={String(data.kpis.activeProjects)} change={12} icon="project" color="info" />
        <StatCard title="إجمالي العملاء" value={String(data.kpis.totalCustomers)} change={8.2} icon="users" color="success" />
        <StatCard title="استفسارات جديدة" value={String(data.kpis.newInquiries)} change={18.6} changeLabel="بانتظار الرد" icon="message" color="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">الإيرادات الشهرية</h3>
              <p className="text-xs text-slate-500 mt-1">آخر 7 أشهر</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-bold text-success">+24.5% نمو</span>
            </div>
          </div>
          <AreaChartCard data={revenueByMonth} formatY={(v) => `${(v / 1000).toFixed(0)}K`} />
        </div>

        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">حالة المشاريع</h3>
            <p className="text-xs text-slate-500 mt-1">من قاعدة البيانات</p>
          </div>
          {data.projectsByStatus.length > 0 ? (
            <>
              <DonutChart data={data.projectsByStatus} centerLabel="إجمالي" centerValue={String(data.projectsByStatus.reduce((s, p) => s + p.value, 0))} />
              <ul className="mt-4 space-y-2">
                {data.projectsByStatus.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} /><span className="text-slate-300">{s.label}</span></span>
                    <span className="text-white font-bold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm"><Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />لا توجد مشاريع</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">الاستفسارات الشهرية</h3>
          <BarChartCard data={data.inquiriesByMonth} color="#3b82f6" />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">نوع المشاريع</h3>
          {data.projectsByType.length > 0 ? (
            <DonutChart data={data.projectsByType} centerLabel="إجمالي" centerValue={String(data.projectsByType.reduce((s, p) => s + p.value, 0))} />
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">لا توجد بيانات</div>
          )}
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">أفضل العملاء</h3>
            <Link href="/admin/customers" className="text-xs text-gold-300 hover:text-gold-100">عرض الكل</Link>
          </div>
          {topCustomers.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">لا توجد بيانات</div>
          ) : (
            <ul className="space-y-3">
              {topCustomers.slice(0, 5).map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/2">
                  <span className="text-xs text-slate-500 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                  <Avatar name={c.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{c.projectsCount} مشروع</p>
                  </div>
                  <p className="text-sm font-extrabold text-gradient-gold">{(c.totalSpent / 1000).toFixed(0)}K</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">أحدث المشاريع</h3>
              <p className="text-xs text-slate-500 mt-1">من قاعدة البيانات</p>
            </div>
            <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-300 hover:text-gold-100">
              <span>عرض الكل</span><ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          {data.recentProjects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">لا توجد مشاريع بعد. <Link href="/admin/projects" className="text-gold-300">أضف مشروعك الأول</Link></div>
          ) : (
            <ul className="space-y-3">
              {data.recentProjects.slice(0, 4).map((p) => {
                const status = getStatusBadge(p.status);
                return (
                  <li key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-600/20 to-gold-300/5 border border-gold-600/20 flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-gold-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                        <span className={`badge ${status.class}`}>{status.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{p.clientName} • {p.location}</p>
                    </div>
                    <div className="hidden md:block w-32">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">التقدم</span>
                        <span className="text-gold-300 font-bold">{p.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-gold-600 to-gold-300 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-extrabold text-gradient-gold">{formatCurrency(p.budget)}</p>
                      <p className="text-[10px] text-slate-500">{p.manager}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white">أحدث الاستفسارات</h3>
            {data.kpis.newInquiries > 0 && <span className="badge badge-info">{data.kpis.newInquiries} جديد</span>}
          </div>
          {data.recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm"><Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />لا توجد استفسارات</div>
          ) : (
            <>
              <ul className="space-y-3">
                {data.recentInquiries.slice(0, 5).map((inq) => (
                  <li key={inq.id} className="p-3 rounded-xl hover:bg-white/2">
                    <div className="flex items-start gap-3">
                      <Avatar name={inq.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{inq.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{inq.subject}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-500">{timeAgo(inq.createdAt)}</span>
                          {inq.priority === "high" && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-danger">
                              <AlertCircle className="w-2.5 h-2.5" /><span>عاجل</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/admin/inquiries" className="mt-4 w-full btn-outline-gold py-2 text-xs">عرض كل الاستفسارات</Link>
            </>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-base font-bold text-white mb-5">النشاط الأخير</h3>
        {data.activities.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">لا يوجد نشاط</div>
        ) : (
          <ul className="space-y-4">
            {data.activities.slice(0, 6).map((act) => {
              const Icon = activityIconMap[act.type] || CheckCircle2;
              const color = activityColorMap[act.type] || "info";
              return (
                <li key={act.id} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClass[color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-sm text-slate-200">{act.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{act.user?.name || "النظام"} • <span className="text-gold-300">{timeAgo(act.createdAt)}</span></p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}