"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChartCard } from "@/components/admin/area-chart";
import { DonutChart } from "@/components/admin/donut-chart";
import { BarChartCard } from "@/components/admin/bar-chart";
import { formatNumber } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then((r) => setData(r.data)).catch(() => toast.error("فشل التحميل")).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="التحليلات" description="تحليلات الأداء من قاعدة البيانات" breadcrumbs={[{ label: "لوحة التحكم", href: "/admin" }, { label: "التحليلات" }]} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الميزانيات" value={formatNumber(data.kpis.totalRevenue) + " ر.س"} change={32.4} icon="dollar" color="gold" />
        <StatCard title="مشاريع نشطة" value={String(data.kpis.activeProjects)} change={12} icon="project" color="info" />
        <StatCard title="عملاء" value={String(data.kpis.totalCustomers)} change={8.2} icon="users" color="success" />
        <StatCard title="استفسارات جديدة" value={String(data.kpis.newInquiries)} change={18.6} icon="message" color="warning" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">الإيرادات</h3>
          <AreaChartCard data={[{ label: "ي", value: 420000 }, { label: "ف", value: 380000 }, { label: "م", value: 520000 }, { label: "أ", value: 680000 }, { label: "م", value: 740000 }, { label: "ي", value: 920000 }, { label: "ي", value: Math.round((data.kpis.totalRevenue || 0) * 0.15) || 850000 }]} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">الاستفسارات</h3>
          <BarChartCard data={data.inquiriesByMonth} color="#3b82f6" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">حالة المشاريع</h3>
          <DonutChart data={data.projectsByStatus} centerLabel="مشاريع" centerValue={String(data.projectsByStatus.reduce((s, p) => s + p.value, 0))} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">نوع المشاريع</h3>
          <DonutChart data={data.projectsByType} centerLabel="نوع" centerValue={String(data.projectsByType.reduce((s, p) => s + p.value, 0))} />
        </div>
      </div>
    </div>
  );
}