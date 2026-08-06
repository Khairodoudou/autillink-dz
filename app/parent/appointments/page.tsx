"use client";
// app/parent/appointments/page.tsx
import { useState } from "react";
import { Calendar, Plus, Clock, MapPin, CheckCircle, XCircle, Circle, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import TablePagination from "@/components/ui/TablePagination";
import { mockAppointments } from "@/lib/mock-data";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  قادم:    { icon: Circle,      color: "#1D5B79", bg: "#1D5B7915", label: "قادم" },
  مكتمل:   { icon: CheckCircle, color: "#2E8B7E", bg: "#2E8B7E15", label: "مكتمل" },
  ملغى:    { icon: XCircle,     color: "#EF4444", bg: "#EF444415", label: "ملغى" },
};

const typeColors: Record<string, string> = {
  "جلسة علاج": "#1D5B79",
  "تقييم":     "#6B4C93",
  "استشارة":   "#2E8B7E",
};

export default function AppointmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const types = ["الكل", "جلسة علاج", "تقييم", "استشارة"];

  const filtered = mockAppointments.filter((a) => {
    const matchSearch = a.childName.includes(search) || a.specialistName.includes(search) || a.location.includes(search);
    const matchType = filterType === "الكل" || a.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const upcoming = paginated.filter((a) => a.status === "قادم");
  const past = paginated.filter((a) => a.status !== "قادم");

  return (
    <div>
      <PageHeader
        title="المواعيد"
        subtitle="جدول المواعيد القادمة والمنتهية"
        icon={Calendar}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            طلب موعد جديد
          </button>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بحسب اسم الطفل، الأخصائي، أو المكان..."
            className="w-full bg-white border border-[#E8D8C4] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#2E8B7E] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => { setFilterType(t); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-600 transition-all ${
                filterType === t
                  ? "bg-[#2E8B7E] text-white shadow-sm"
                  : "bg-white border border-[#E8D8C4] text-[#6B7280] hover:border-[#2E8B7E]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
              المواعيد القادمة ({upcoming.length})
            </h2>
            <div className="space-y-4">
              {upcoming.map((apt) => {
                const status = statusConfig[apt.status];
                const StatusIcon = status.icon;
                const typeColor = typeColors[apt.type] ?? "#1D5B79";
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border-2 border-[#2E8B7E]/20 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${typeColor}15` }}
                        >
                          <span className="text-lg font-900" style={{ color: typeColor }}>
                            {apt.date.split("-")[2]}
                          </span>
                          <span className="text-xs font-600" style={{ color: typeColor }}>
                            {["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"][parseInt(apt.date.split("-")[1]) - 1]}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-700 px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
                            >
                              {apt.type}
                            </span>
                          </div>
                          <h3 className="text-base font-800 text-[#1F2937] mb-1">
                            {apt.childName}
                          </h3>
                          <p className="text-sm text-[#6B7280] mb-2">{apt.specialistName}</p>
                          <div className="flex flex-wrap gap-3">
                            <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                              <Clock className="w-3.5 h-3.5" />
                              {apt.time}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                              <MapPin className="w-3.5 h-3.5" />
                              {apt.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs font-700 px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>
                    {apt.notes && (
                      <div className="mt-3 pt-3 border-t border-[#F5E8D4]">
                        <p className="text-xs text-[#6B7280]">{apt.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
              المواعيد المنتهية ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map((apt) => {
                const status = statusConfig[apt.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-[#E8D8C4] p-4 shadow-sm opacity-70"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5E8D4] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[#9CA3AF]" />
                        </div>
                        <div>
                          <p className="text-sm font-700 text-[#1F2937]">{apt.childName}</p>
                          <p className="text-xs text-[#9CA3AF]">
                            {apt.date} — {apt.time} — {apt.specialistName}
                          </p>
                        </div>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs font-700 px-3 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          accentColor="#2E8B7E"
        />
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="طلب موعد جديد"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-600 text-[#6B7280] block mb-1.5">الطفل</label>
            <select className="input-rtl">
              <option>آدم بن علي</option>
              <option>لينا بن علي</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-600 text-[#6B7280] block mb-1.5">نوع الموعد</label>
            <select className="input-rtl">
              <option>جلسة علاج</option>
              <option>تقييم</option>
              <option>استشارة</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">التاريخ</label>
              <input type="date" className="input-rtl" />
            </div>
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">الوقت</label>
              <input type="time" className="input-rtl" />
            </div>
          </div>
          <div>
            <label className="text-sm font-600 text-[#6B7280] block mb-1.5">ملاحظات</label>
            <textarea className="input-rtl resize-none" rows={3} />
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-full py-3 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors"
          >
            إرسال الطلب
          </button>
        </div>
      </Modal>
    </div>
  );
}
