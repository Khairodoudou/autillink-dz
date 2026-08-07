"use client";
// app/parent/dashboard/page.tsx
import { useEffect, useRef } from "react";
import {
  Smile,
  Moon,
  Zap,
  MessageCircle,
  Dumbbell,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

import { useState } from "react";

export default function ParentDashboard() {
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/children")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && res.data.length > 0) {
          setChildrenList(res.data);
          setSelectedChildId(res.data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const child = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  if (loading) {
    return <div className="p-8 text-center text-[#6B7280]">جاري تحميل البيانات...</div>;
  }

  if (!child) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E8D8C4] my-8">
        <h3 className="text-lg font-800 text-[#1F2937] mb-2">لا يوجد أطفال مسجلون بعد</h3>
        <p className="text-sm text-[#6B7280] mb-4">قم بإضافة طفلك الأول لمتابعة تطوره اليومي</p>
        <a href="/parent/children" className="inline-block px-5 py-2.5 bg-[#2E8B7E] text-white font-700 rounded-xl">إضافة طفل</a>
      </div>
    );
  }

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "المزاج",
        data: child.weeklyMood,
        borderColor: "#E97F6B",
        backgroundColor: "rgba(233, 127, 107, 0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#E97F6B",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
      {
        label: "النوم (ساعات)",
        data: child.weeklySleep,
        borderColor: "#1D5B79",
        backgroundColor: "rgba(29, 91, 121, 0.06)",
        borderWidth: 2.5,
        pointBackgroundColor: "#1D5B79",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        rtl: true,
        labels: {
          font: { family: "'Noto Kufi Arabic', sans-serif", size: 12 },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        rtl: true,
        bodyFont: { family: "'Noto Kufi Arabic', sans-serif" },
        titleFont: { family: "'Noto Kufi Arabic', sans-serif" },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 },
        },
      },
    },
  };

  const stats = child.stats;

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        subtitle={`مرحباً، تابع تطور ${child.name} اليوم`}
        icon={LayoutDashboard}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      {/* Child Selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {childrenList.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedChildId(c.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-600 flex-shrink-0 transition-all ${
              c.id === child.id
                ? "bg-[#2E8B7E] text-white border-[#2E8B7E] shadow"
                : "bg-white text-[#6B7280] border-[#E8D8C4] hover:border-[#2E8B7E]"
            }`}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-800"
              style={{ backgroundColor: c.avatarColor }}
            >
              {c.avatarInitial}
            </div>
            {c.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="المزاج"
          value={`${stats.mood}/5`}
          icon={Smile}
          iconColor="#E97F6B"
          iconBg="#E97F6B15"
          trend="up"
          trendValue="+1"
        />
        <StatCard
          title="النوم"
          value={`${stats.sleep}س`}
          icon={Moon}
          iconColor="#1D5B79"
          iconBg="#1D5B7915"
          trend="neutral"
          trendValue="مستقر"
        />
        <StatCard
          title="نوبات الغضب"
          value={stats.tantrums}
          icon={Zap}
          iconColor="#F5B942"
          iconBg="#F5B94215"
          trend="down"
          trendValue="-2"
        />
        <StatCard
          title="كلمات جديدة"
          value={stats.newWords}
          icon={MessageCircle}
          iconColor="#2E8B7E"
          iconBg="#2E8B7E15"
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title="التمارين"
          value={`${stats.exercises}/8`}
          icon={Dumbbell}
          iconColor="#6B4C93"
          iconBg="#6B4C9315"
          trend="up"
          trendValue="+2"
        />
        <StatCard
          title="المواعيد"
          value={stats.appointments}
          icon={Calendar}
          iconColor="#E97F6B"
          iconBg="#E97F6B15"
          description="هذا الشهر"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#E8D8C4] p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-800 text-[#1F2937]">
              المزاج والنوم — آخر 7 أيام
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              متابعة يومية لـ {child.name}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#2E8B7E] font-600">
            <TrendingUp className="w-3.5 h-3.5" />
            تحسن عام
          </div>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/parent/daily-log"
          className="bg-white rounded-2xl border border-[#E8D8C4] p-5 hover:shadow-md transition-shadow group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2E8B7E]/10 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-[#2E8B7E]" />
          </div>
          <h3 className="text-sm font-700 text-[#1F2937] mb-1">تسجيل ملاحظة</h3>
          <p className="text-xs text-[#6B7280]">أضف ملاحظتك اليومية</p>
        </a>
        <a
          href="/parent/reports"
          className="bg-white rounded-2xl border border-[#E8D8C4] p-5 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1D5B79]/10 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-[#1D5B79]" />
          </div>
          <h3 className="text-sm font-700 text-[#1F2937] mb-1">آخر التقارير</h3>
          <p className="text-xs text-[#6B7280]">اطلع على التقارير المرسلة</p>
        </a>
        <a
          href="/parent/appointments"
          className="bg-white rounded-2xl border border-[#E8D8C4] p-5 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E97F6B]/10 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-[#E97F6B]" />
          </div>
          <h3 className="text-sm font-700 text-[#1F2937] mb-1">جدول المواعيد</h3>
          <p className="text-xs text-[#6B7280]">حجز وتتبع المواعيد</p>
        </a>
      </div>
    </div>
  );
}

// Need this import for the JSX usage above
import { LayoutDashboard } from "lucide-react";
