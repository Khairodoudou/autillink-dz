"use client";
// app/admin/dashboard/page.tsx
import { Building2, Users, Baby, Activity, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { mockAdminStats } from "@/lib/mock-data";
import {
  Chart,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { LayoutDashboard } from "lucide-react";

Chart.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend, LineElement, PointElement, Filler);

export default function AdminDashboard() {
  const stats = mockAdminStats;

  const months = stats.growthData.map((d) => d.month);

  const usersChartData = {
    labels: months,
    datasets: [
      {
        label: "المستخدمون",
        data: stats.growthData.map((d) => d.users),
        borderColor: "#6B4C93",
        backgroundColor: "rgba(107, 76, 147, 0.15)",
        borderWidth: 2.5,
        pointBackgroundColor: "#6B4C93",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
      {
        label: "الأطفال",
        data: stats.growthData.map((d) => d.children),
        borderColor: "#E97F6B",
        backgroundColor: "rgba(233,127,107,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#E97F6B",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const sessionsChartData = {
    labels: months,
    datasets: [
      {
        label: "الجلسات",
        data: stats.growthData.map((d) => d.sessions),
        backgroundColor: "rgba(29, 91, 121, 0.2)",
        borderColor: "#1D5B79",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        rtl: true,
        labels: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 12 }, usePointStyle: true },
      },
      tooltip: {
        rtl: true,
        bodyFont: { family: "'Noto Kufi Arabic', sans-serif" },
        titleFont: { family: "'Noto Kufi Arabic', sans-serif" },
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
    },
  };

  const barOptions = { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } };

  return (
    <div>
      <PageHeader
        title="لوحة الإدارة"
        subtitle="نظرة شاملة على منصة AutiLink DZ"
        icon={LayoutDashboard}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="المراكز"
          value={stats.totalCenters}
          icon={Building2}
          iconColor="#6B4C93"
          iconBg="#6B4C9315"
          trend="up"
          trendValue="+4"
        />
        <StatCard
          title="المستخدمون"
          value={stats.totalUsers.toLocaleString("ar-DZ")}
          icon={Users}
          iconColor="#1D5B79"
          iconBg="#1D5B7915"
          trend="up"
          trendValue="+57 هذا الشهر"
        />
        <StatCard
          title="الأطفال"
          value={stats.totalChildren.toLocaleString("ar-DZ")}
          icon={Baby}
          iconColor="#E97F6B"
          iconBg="#E97F6B15"
          trend="up"
          trendValue="+34"
        />
        <StatCard
          title="الجلسات"
          value={stats.totalSessions.toLocaleString("ar-DZ")}
          icon={Activity}
          iconColor="#2E8B7E"
          iconBg="#2E8B7E15"
          trend="up"
          trendValue="+730"
        />
        <StatCard
          title="اشتراكات نشطة"
          value={stats.activeSubscriptions}
          icon={TrendingUp}
          iconColor="#F5B942"
          iconBg="#F5B94215"
          trend="up"
          trendValue="+22"
        />
        <StatCard
          title="إيرادات الشهر"
          value={`${(stats.monthlyRevenue / 1000).toFixed(0)}k دج`}
          icon={DollarSign}
          iconColor="#6B4C93"
          iconBg="#6B4C9315"
          trend="up"
          trendValue="+12%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5D9F2] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-800 text-[#1F2937]">نمو المستخدمين والأطفال</h2>
            <span className="text-xs text-[#6B4C93] font-600">آخر 8 أشهر</span>
          </div>
          <Line data={usersChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-800 text-[#1F2937]">الجلسات الشهرية</h2>
            <span className="text-xs text-[#1D5B79] font-600">نمو 72%</span>
          </div>
          <Bar data={sessionsChartData} options={barOptions} />
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          { label: "أولياء الأمور", value: stats.totalParents, color: "#E97F6B", pct: Math.round(stats.totalParents / stats.totalUsers * 100) },
          { label: "الأخصائيون", value: stats.totalSpecialists, color: "#1D5B79", pct: Math.round(stats.totalSpecialists / stats.totalUsers * 100) },
          { label: "مراكز معتمدة", value: stats.totalCenters - 2, color: "#2E8B7E", pct: Math.round((stats.totalCenters - 2) / stats.totalCenters * 100) },
        ].map(({ label, value, color, pct }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-700 text-[#1F2937]">{label}</span>
              <span className="text-lg font-900" style={{ color }}>{value.toLocaleString("ar-DZ")}</span>
            </div>
            <div className="h-2 bg-[#E5D9F2] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1.5">{pct}% من الإجمالي</p>
          </div>
        ))}
      </div>
    </div>
  );
}
