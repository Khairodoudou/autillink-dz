"use client";
// app/specialist/dashboard/page.tsx
import { useState, useEffect } from "react";
import { Users, Calendar, FileText, MessageSquare, TrendingUp, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
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

export default function SpecialistDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/specialist/me").then((r) => r.json()),
      fetch("/api/specialist/appointments").then((r) => r.json()),
      fetch("/api/specialist/patients").then((r) => r.json()),
    ])
      .then(([meRes, apptRes, patientsRes]) => {
        if (meRes.ok) setProfile(meRes.data);

        if (apptRes.ok && Array.isArray(apptRes.data)) {
          setAllAppointments(apptRes.data);
          const today = new Date().toISOString().split("T")[0];
          let todays = apptRes.data.filter(
            (a: any) => a.date === today && (a.status === "قادم" || a.status === "CONFIRMED")
          );

          // If no sessions scheduled specifically for today's date, show upcoming sessions
          if (todays.length === 0) {
            todays = apptRes.data.filter((a: any) => a.status === "قادم").slice(0, 4);
          }
          setTodaySessions(todays);
        }

        if (patientsRes.ok && Array.isArray(patientsRes.data)) {
          setPatients(patientsRes.data.slice(0, 5));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartValues = profile?.weeklyStats || [3, 5, 4, 6, 3];
  const totalWeeklySessions = chartValues.reduce((a: number, b: number) => a + b, 0);

  const chartData = {
    labels: weekDays,
    datasets: [
      {
        label: "عدد الجلسات",
        data: chartValues,
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

  if (loading) {
    return (
      <div className="p-12 text-center text-[#6B7280]">
        جاري تحميل البيانات من الخادم...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        subtitle={`مرحباً، ${profile?.name ?? "د. أخصائي"} — ${profile?.speciality ?? "أخصائي توحد وتخاطب"}`}
        icon={LayoutDashboard}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي المرضى"
          value={profile?.patientsCount ?? 0}
          icon={Users}
          iconColor="#1D5B79"
          iconBg="#1D5B7915"
          trend="up"
          trendValue="نشط"
        />
        <StatCard
          title="جلسات هذا الأسبوع"
          value={profile?.sessionsThisWeek ?? 0}
          icon={Calendar}
          iconColor="#2E8B7E"
          iconBg="#2E8B7E15"
          trend="neutral"
          trendValue="جدول أسبوعي"
        />
        <StatCard
          title="التقارير المكتملة"
          value={profile?.pendingReports ?? 0}
          icon={FileText}
          iconColor="#E97F6B"
          iconBg="#E97F6B15"
          trend="up"
          trendValue="تقارير متاحة"
        />
        <StatCard
          title="الرسائل"
          value={profile?.unreadMessages ?? 0}
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
            <div className="flex items-center gap-1 text-xs text-[#1D5B79] font-700">
              <TrendingUp className="w-3.5 h-3.5" />
              إجمالي {totalWeeklySessions} جلسة
            </div>
          </div>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Today's Sessions */}
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-800 text-[#1F2937]">جلسات اليوم / القادمة</h2>
              <Link
                href="/specialist/appointments"
                className="text-xs text-[#1D5B79] font-700 hover:underline flex items-center gap-0.5"
              >
                عرض الكل
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {todaySessions.length === 0 ? (
              <div className="p-8 text-center text-[#9CA3AF] text-xs">
                لا توجد جلسات مسجلة لليوم
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#EAF3F7] hover:bg-[#dbebf3] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1D5B79]/15 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#1D5B79]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-800 text-[#1F2937] truncate">{s.patientName}</p>
                      <p className="text-xs text-[#6B7280]">{s.time} — {s.date}</p>
                    </div>
                    <span className="text-xs font-700 px-2.5 py-1 bg-[#2E8B7E]/10 text-[#2E8B7E] rounded-full flex-shrink-0">
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patients Overview */}
      <div className="mt-6 bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-800 text-[#1F2937]">نظرة عامة على المرضى</h2>
          <Link
            href="/specialist/patients"
            className="text-xs text-[#1D5B79] font-700 hover:underline flex items-center gap-0.5"
          >
            إدارة المرضى
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="p-8 text-center text-[#9CA3AF] text-xs">
            لا يوجد مرضى مسجلون حالياً
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((p: any) => {
              const lvl = levelColors[p.diagnosisLevel] ?? levelColors["متوسط"];
              return (
                <div key={p.id} className="flex items-center justify-between gap-4 py-3 border-b border-[#F0F4F8] last:border-0 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-900 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: p.avatarColor ?? "#1D5B79" }}
                    >
                      {p.avatarInitial ?? (p.name ?? "ط")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-800 text-[#1F2937]">{p.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        السن: {p.age ?? 6} سنوات — {p.sessionsCount ?? 1} جلسة — ولي الأمر: {p.parentName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-800 px-3 py-1 rounded-full"
                      style={{ backgroundColor: lvl?.bg ?? "#F5B94215", color: lvl?.text ?? "#c49012" }}
                    >
                      {p.diagnosisLevel}
                    </span>

                    {/* Progress bar for communication */}
                    <div className="hidden md:flex items-center gap-2 w-36 bg-[#F9FAFB] p-1.5 rounded-lg border border-[#F3F4F6]">
                      <div className="flex-1 h-2 bg-[#E8D8C4] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1D5B79] transition-all"
                          style={{ width: `${p.skills?.communication ?? 60}%` }}
                        />
                      </div>
                      <span className="text-xs font-700 text-[#1D5B79] w-9 text-left">
                        {p.skills?.communication ?? 60}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
