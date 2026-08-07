"use client";
// app/specialist/patients/[id]/page.tsx
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, User, Calendar, FileText, TrendingUp } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
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

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const levelColors: Record<string, { bg: string; text: string }> = {
  "خفيف":  { bg: "#2E8B7E15", text: "#2E8B7E" },
  "متوسط": { bg: "#F5B94215", text: "#c49012" },
  "شديد":  { bg: "#EF444415", text: "#EF4444" },
};

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/specialist/patients")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          const found = res.data.find((p: any) => p.id === id);
          setPatient(found || res.data[0] || null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 text-center text-[#9CA3AF]">جاري التحميل...</div>;
  if (!patient) return <div className="p-12 text-center text-[#9CA3AF]">المريض غير موجود</div>;

  const lvl = levelColors[patient.diagnosisLevel] ?? levelColors["متوسط"];

  const skillColors = {
    communication: "#1D5B79",
    social: "#2E8B7E",
    sensory: "#6B4C93",
    motor: "#E97F6B",
    cognitive: "#F5B942",
  };

  const skillLabels: Record<string, string> = {
    communication: "التواصل",
    social: "الاجتماعي",
    sensory: "الحسي",
    motor: "الحركي",
    cognitive: "المعرفي",
  };

  const skillsHistory: any[] = patient.skillsHistory ?? [];

  const months = skillsHistory.map((h: any) => h.month);

  const chartData = {
    labels: months,
    datasets: Object.entries(skillColors).map(([key, color]) => ({
      label: skillLabels[key],
      data: skillsHistory.map((h: any) => (h[key] as number) ?? 0),
      borderColor: color,
      backgroundColor: `${color}15`,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointRadius: 4,
      tension: 0.4,
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        rtl: true,
        labels: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 }, usePointStyle: true },
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
        max: 100,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Noto Kufi Arabic', sans-serif", size: 11 } },
      },
    },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/specialist/patients"
          className="flex items-center gap-1 text-sm text-[#1D5B79] hover:underline font-600"
        >
          <ArrowRight className="w-4 h-4" />
          مرضاي
        </Link>
        <span className="text-[#9CA3AF]">/</span>
        <span className="text-sm text-[#1F2937] font-600">{patient.name}</span>
      </div>

      <PageHeader
        title={patient.name}
        subtitle={`${patient.age} سنوات — ${patient.sessionsCount} جلسة`}
        icon={User}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
        actions={
          <Link
            href="/specialist/reports/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1D5B79] text-white rounded-xl text-sm font-700 hover:bg-[#174A62] transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            كتابة تقرير
          </Link>
        }
      />

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "ولي الأمر", value: patient.parentName, sub: patient.parentPhone },
          { label: "مستوى التشخيص", value: patient.diagnosisLevel, badge: true },
          { label: "تاريخ التشخيص", value: patient.diagnosisDate, sub: "تاريخ أول تقييم" },
          { label: "الجلسة القادمة", value: patient.nextSession, sub: "موعد مؤكد" },
        ].map(({ label, value, sub, badge }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#D6E8F0] p-4 shadow-sm">
            <p className="text-xs text-[#9CA3AF] mb-1">{label}</p>
            {badge ? (
              <span
                className="text-sm font-800 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: lvl.bg, color: lvl.text }}
              >
                {value}
              </span>
            ) : (
              <p className="text-sm font-800 text-[#1F2937]">{value}</p>
            )}
            {sub && <p className="text-xs text-[#9CA3AF] mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Skills Chart */}
      <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-800 text-[#1F2937]">تطور المهارات — آخر 6 أشهر</h2>
          <div className="flex items-center gap-1 text-xs text-[#1D5B79] font-600">
            <TrendingUp className="w-3.5 h-3.5" />
            تحسن مستمر
          </div>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Current Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
          <h2 className="text-base font-800 text-[#1F2937] mb-4">المستوى الحالي</h2>
          <div className="space-y-3">
            {Object.entries(skillColors).map(([key, color]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-600 text-[#1F2937]">{skillLabels[key]}</span>
                  <span className="font-700" style={{ color }}>
                    {patient.skills[key as keyof typeof patient.skills]}%
                  </span>
                </div>
                <div className="h-2 bg-[#E8D8C4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${patient.skills[key as keyof typeof patient.skills]}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#1D5B79]" />
            <h2 className="text-base font-800 text-[#1F2937]">ملاحظات الأخصائي</h2>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed">{patient.notes}</p>

          <div className="mt-4 pt-4 border-t border-[#EAF3F7]">
            <p className="text-xs text-[#9CA3AF] mb-2">المعلومات العامة</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="font-600 text-[#1F2937]">{patient.sessionsCount}</span>
                <span className="text-[#6B7280]">إجمالي الجلسات</span>
              </div>
              <div className="flex justify-between">
                <span className="font-600 text-[#1F2937]">{patient.lastSession}</span>
                <span className="text-[#6B7280]">آخر جلسة</span>
              </div>
              <div className="flex justify-between">
                <span className="font-600 text-[#1F2937]">{patient.status}</span>
                <span className="text-[#6B7280]">الحالة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
