"use client";
// app/specialist/appointments/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, XCircle, Circle, MapPin, FileText, Check, Search, CheckSquare } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  "قادم":   { icon: Circle,      color: "#1D5B79", bg: "#1D5B7915", label: "قادم" },
  "مكتمل":  { icon: CheckCircle, color: "#2E8B7E", bg: "#2E8B7E15", label: "مكتمل" },
  "ملغى":   { icon: XCircle,     color: "#EF4444", bg: "#EF444415", label: "ملغى" },
};

const typeColors: Record<string, string> = {
  "جلسة علاج": "#1D5B79",
  "تقييم":     "#6B4C93",
  "استشارة":   "#2E8B7E",
};

export default function SpecialistAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 4;

  const loadAppointments = () => {
    setLoading(true);
    fetch("/api/specialist/appointments")
      .then((r) => r.json())
      .then((res) => { if (res.ok) setAppointments(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const types = ["الكل", "جلسة علاج", "تقييم", "استشارة"];
  const statuses = ["الكل", "قادم", "مكتمل", "ملغى"];

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/specialist/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        loadAppointments();
      }
    } catch (err) {
      console.error("Failed to update appointment status", err);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      (a.patientName ?? "").includes(search) || (a.notes && a.notes.includes(search));
    const matchType = filterType === "الكل" || a.type === filterType;
    const matchStatus = filterStatus === "الكل" || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = paginated.filter((a) => a.date === todayStr && a.status === "قادم");
  const upcoming = paginated.filter((a) => (a.date > todayStr || a.date === todayStr) && a.status === "قادم" && !todayAppts.includes(a));
  const past = paginated.filter((a) => a.status !== "قادم" || a.date < todayStr);

  const renderCard = (apt: any, compact = false) => {
    const status = statusConfig[apt.status] ?? statusConfig["قادم"];
    const StatusIcon = status.icon;
    const typeColor = typeColors[apt.type] ?? "#1D5B79";

    const parts = (apt.date || "").split("-");
    const dayNum = parts[2] || "08";
    const monthNum = parseInt(parts[1] || "08", 10) - 1;
    const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    const monthName = monthNames[monthNum] || "أغسطس";

    return (
      <div
        key={apt.id}
        className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
          compact ? "border-[#D6E8F0] opacity-80" : "border-[#1D5B79]/20 border-2 hover:shadow-md"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-current/10"
              style={{ backgroundColor: `${typeColor}15` }}
            >
              <span className="text-lg font-900 leading-none" style={{ color: typeColor }}>
                {dayNum}
              </span>
              <span className="text-[10px] font-800 mt-0.5" style={{ color: typeColor }}>
                {monthName}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-800 px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
                >
                  {apt.type}
                </span>
                <span
                  className="flex items-center gap-1 text-[11px] font-800 px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>

              <p className="text-base font-900 text-[#1F2937]">{apt.patientName}</p>

              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1 font-700 bg-[#F9FAFB] px-2 py-0.5 rounded-lg border border-[#F3F4F6]">
                  <Clock className="w-3.5 h-3.5 text-[#1D5B79]" />
                  {apt.time} — {apt.duration || 45} دقيقة
                </span>
                <span className="flex items-center gap-1 font-600 bg-[#F9FAFB] px-2 py-0.5 rounded-lg border border-[#F3F4F6]">
                  <MapPin className="w-3.5 h-3.5 text-[#E97F6B]" />
                  {apt.location || "غرفة التخاطب 2"}
                </span>
              </div>
              {apt.notes && (
                <p className="text-xs text-[#6B7280] mt-2 bg-[#F5F9FB] p-2.5 rounded-xl border border-[#EAF3F7]">
                  {apt.notes}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons for Specialists */}
          {apt.status === "قادم" && (
            <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAF3F7]">
              <button
                onClick={() => handleStatusChange(apt.id, "مكتمل")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2E8B7E] text-white text-xs font-800 rounded-xl hover:bg-[#22685e] transition-colors shadow-sm active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                إنهاء الجلسة
              </button>
              <button
                onClick={() => handleStatusChange(apt.id, "ملغى")}
                className="px-2.5 py-2 text-xs font-800 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="جدول الجلسات"
        subtitle="إدارة وتتبع مواعيد الجلسات مع المرضى والأولياء"
        icon={Calendar}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بحسب اسم المريض أو الملاحظات..."
            className="w-full bg-white border border-[#D6E8F0] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#1D5B79] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-[#9CA3AF] font-700">النوع:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => { setFilterType(t); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-700 transition-all ${
                filterType === t
                  ? "bg-[#1D5B79] text-white shadow-sm"
                  : "bg-white border border-[#D6E8F0] text-[#6B7280] hover:border-[#1D5B79]"
              }`}
            >
              {t}
            </button>
          ))}

          <span className="text-xs text-[#9CA3AF] font-700 mr-2">الحالة:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-700 transition-all ${
                filterStatus === st
                  ? "bg-[#1D5B79] text-white shadow-sm"
                  : "bg-white border border-[#D6E8F0] text-[#6B7280] hover:border-[#1D5B79]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-12 text-center text-[#6B7280]">
          جاري تحميل الجلسات...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today */}
          {todayAppts.length > 0 && (
            <div>
              <h2 className="text-sm font-800 text-[#1F2937] uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D5B79] animate-pulse" />
                جلسات اليوم ({todayAppts.length})
              </h2>
              <div className="space-y-4">
                {todayAppts.map((a) => renderCard(a))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
                الجلسات القادمة ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((a) => renderCard(a))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
                الجلسات المكتملة والسابقة ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((a) => renderCard(a, true))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#D6E8F0] p-12 text-center">
              <Calendar className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
              <p className="text-sm font-700 text-[#6B7280]">لا توجد نتائج مطابقة للبحث أو التصفية</p>
            </div>
          )}

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            accentColor="#1D5B79"
          />
        </div>
      )}
    </div>
  );
}
