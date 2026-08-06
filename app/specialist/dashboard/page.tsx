"use client";
// app/specialist/dashboard/page.tsx
import { Users, Calendar, FileText, MessageSquare, TrendingUp, Clock } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { mockSpecialistProfile, mockSpecialistAppointments, mockPatients } from "@/lib/mock-data";
import {
  Chart,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { LayoutDashboard } from "lucide-react";

Chart.register(BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const weekDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const sessionsPerDay = [3, 5, 4, 6, 3];

export default function SpecialistDashboard() {
  const profile = mockSpecialistProfile;
  const todaySessions = mockSpecialistAppointments.filter(
    (a) => a.date === "2026-08-04" && a.status === "قادم"
  );

  const chartData = {
    labels: weekDays,
    datasets: [
      {
        label: "عدد الجلسات",
        data: sessionsPerDay,
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
      legend: { display: false },
      tooltip: {
        rtl: true,
        bodyFont: { family: "'Noto Kufi Arabic', sans-serif" },
        titleFont: { family: "'Noto Kufi Arabic', sans-serif" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
    },
  };

  const levelColors: Record<string, { bg: string; text: string }> = {
    خفيف:  { bg: "#2E8B7E15", text: "#2E8B7E" },
    متوسط: { bg: "#F5B94215", text: "#c49012" },
    شديد:  { bg: "#EF444415", text: "#EF4444" },
  };

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        subtitle={`مرحباً، ${profile.name} — ${profile.speciality}`}
        icon={LayoutDashboard}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي المرضى"
          value={profile.patientsCount}
          icon={Users}
          iconColor="#1D5B79"
          iconBg="#1D5B7915"
          trend="up"
          trendValue="+2 هذا الشهر"
        />
        <StatCard
          title="جلسات هذا الأسبوع"
          value={profile.sessionsThisWeek}
          icon={Calendar}
          iconColor="#2E8B7E"
          iconBg="#2E8B7E15"
          trend="neutral"
          trendValue="مستقر"
        />
        <StatCard
          title="تقارير معلقة"
          value={profile.pendingReports}
          icon={FileText}
          iconColor="#E97F6B"
          iconBg="#E97F6B15"
          trend="down"
          trendValue="يحتاج مراجعة"
        />
        <StatCard
          title="رسائل غير مقروءة"
          value={4}
          icon={MessageSquare}
          iconColor="#6B4C93"
          iconBg="#6B4C9315"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-800 text-[#1F2937]">جلسات الأسبوع</h2>
            <div className="flex items-center gap-1 text-xs text-[#1D5B79] font-600">
              <TrendingUp className="w-3.5 h-3.5" />
              إجمالي 21 جلسة
            </div>
          </div>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Today's Sessions */}
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
          <h2 className="text-base font-800 text-[#1F2937] mb-4">جلسات اليوم</h2>
          <div className="space-y-3">
            {todaySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#EAF3F7]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1D5B79]/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#1D5B79]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-700 text-[#1F2937] truncate">{s.patientName}</p>
                  <p className="text-xs text-[#6B7280]">{s.time} — {s.duration} دقيقة</p>
                </div>
                <span className="text-xs font-600 px-2 py-1 bg-[#2E8B7E]/10 text-[#2E8B7E] rounded-full flex-shrink-0">
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Overview */}
      <div className="mt-6 bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
        <h2 className="text-base font-800 text-[#1F2937] mb-4">نظرة عامة على المرضى</h2>
        <div className="space-y-3">
          {mockPatients.map((p) => {
            const lvl = levelColors[p.diagnosisLevel] ?? levelColors["متوسط"];
            return (
              <div key={p.id} className="flex items-center justify-between gap-4 py-2 border-b border-[#F0F4F8] last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-800 flex-shrink-0"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.avatarInitial}
                  </div>
                  <div>
                    <p className="text-sm font-700 text-[#1F2937]">{p.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{p.age} سنوات — {p.sessionsCount} جلسة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-700 px-2 py-1 rounded-full"
                    style={{ backgroundColor: lvl.bg, color: lvl.text }}
                  >
                    {p.diagnosisLevel}
                  </span>
                  {/* Progress bar */}
                  <div className="hidden sm:flex items-center gap-2 w-32">
                    <div className="flex-1 h-1.5 bg-[#E8D8C4] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1D5B79] transition-all"
                        style={{ width: `${p.skills.communication}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#9CA3AF] w-8">{p.skills.communication}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
