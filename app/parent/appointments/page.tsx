"use client";
// app/parent/appointments/page.tsx
import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, MapPin, CheckCircle, XCircle, Search, Stethoscope, Trash2, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import TablePagination from "@/components/ui/TablePagination";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  "مؤكد":        { icon: CheckCircle, color: "#2E8B7E", bg: "#2E8B7E15", label: "مؤكد" },
  "قيد الانتظار": { icon: Clock,       color: "#F5B942", bg: "#F5B94215", label: "قيد الانتظار" },
  "مكتمل":       { icon: CheckCircle, color: "#1D5B79", bg: "#1D5B7915", label: "مكتمل" },
  "ملغى":        { icon: XCircle,     color: "#EF4444", bg: "#EF444415", label: "ملغى" },
};

const typeColors: Record<string, string> = {
  "جلسة علاج": "#2E8B7E",
  "تقييم":     "#6B4C93",
  "استشارة":   "#1D5B79",
};

const monthNamesArabic = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [specialistsList, setSpecialistsList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 4;

  // New Appointment Form
  const [form, setForm] = useState({
    childId: "",
    specialistId: "",
    type: "جلسة علاج",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    notes: "",
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/parent/appointments").then((r) => r.json()),
      fetch("/api/parent/children").then((r) => r.json()),
      fetch("/api/parent/specialists").then((r) => r.json()),
    ])
      .then(([aptRes, childRes, specRes]) => {
        if (aptRes.ok) setAppointments(aptRes.data);
        if (childRes.ok) {
          setChildrenList(childRes.data);
          if (childRes.data.length > 0 && !form.childId) {
            setForm((f) => ({ ...f, childId: childRes.data[0].id }));
          }
        }
        if (specRes.ok) {
          setSpecialistsList(specRes.data);
          if (specRes.data.length > 0) {
            setForm((f) => ({ ...f, specialistId: specRes.data[0].id }));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const types = ["الكل", "جلسة علاج", "تقييم", "استشارة"];

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childId || !form.date) return;

    try {
      const res = await fetch("/api/parent/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccessMsg(true);
        loadData();
        setTimeout(() => {
          setSuccessMsg(false);
          setShowModal(false);
          setForm({
            childId: childrenList[0]?.id || "",
            specialistId: specialistsList[0]?.id || "",
            type: "جلسة علاج",
            date: new Date().toISOString().split("T")[0],
            time: "10:00",
            notes: "",
          });
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to request appointment", err);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في إلغاء هذا الموعد؟")) return;

    try {
      const res = await fetch(`/api/parent/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      (a.childName ?? "").includes(search) ||
      (a.specialistName ?? "").includes(search) ||
      (a.location ?? "").includes(search);
    const matchType = filterType === "الكل" || a.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const upcoming = paginated.filter((a) => a.status === "مؤكد" || a.status === "قيد الانتظار");
  const past = paginated.filter((a) => a.status === "مكتمل" || a.status === "ملغى");

  return (
    <div>
      <PageHeader
        title="جدول المواعيد"
        subtitle="متابعة وحجز المواعيد مع الأخصائيين المتابعين"
        icon={Calendar}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-all active:scale-95 shadow-sm"
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
            placeholder="ابحث بحسب اسم الطفل، الأخصائي، أو العيادة..."
            className="w-full bg-white border border-[#E8D8C4] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#2E8B7E] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => { setFilterType(t); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-sm font-700 transition-all ${
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

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center text-[#6B7280]">
          جاري تحميل المواعيد...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5E8D4] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-base font-800 text-[#1F2937] mb-1">لا توجد مواعيد حالياً</h3>
          <p className="text-xs text-[#6B7280] mb-4">
            يمكنك الضغط على "طلب موعد جديد" لحجز جلسة أو استشارة مع الأخصائي.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-xs font-800 hover:bg-[#22685e] transition-colors"
          >
            حجز موعد الآن
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming & Confirmed Appointments */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-xs font-800 text-[#6B7280] uppercase tracking-wider mb-3">
                المواعيد القادمة والمحجوزة ({upcoming.length})
              </h2>
              <div className="space-y-4">
                {upcoming.map((apt) => {
                  const status = statusConfig[apt.status] ?? statusConfig["مؤكد"];
                  const StatusIcon = status.icon;
                  const typeColor = typeColors[apt.type] ?? "#2E8B7E";

                  const parts = (apt.date || "").split("-");
                  const dayNum = parts[2] || "10";
                  const monthNum = parseInt(parts[1] || "8", 10) - 1;
                  const monthName = monthNamesArabic[monthNum] || "أغسطس";

                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border-2 border-[#2E8B7E]/20 p-5 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Date Badge */}
                          <div
                            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-current/10"
                            style={{ backgroundColor: `${typeColor}15` }}
                          >
                            <span className="text-xl font-900 leading-none" style={{ color: typeColor }}>
                              {dayNum}
                            </span>
                            <span className="text-xs font-800 mt-1" style={{ color: typeColor }}>
                              {monthName}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span
                                className="text-xs font-800 px-2.5 py-0.5 rounded-full"
                                style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
                              >
                                {apt.type}
                              </span>
                              <span className="text-xs text-[#9CA3AF] font-600">
                                {apt.date}
                              </span>
                            </div>

                            <h3 className="text-base font-900 text-[#1F2937] mb-1">
                              الطفل: {apt.childName}
                            </h3>

                            <p className="text-xs text-[#1D5B79] font-700 mb-2.5 flex items-center gap-1.5">
                              <Stethoscope className="w-3.5 h-3.5" />
                              الأخصائي: {apt.specialistName}
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
                              <span className="flex items-center gap-1.5 bg-[#F9FAFB] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                                <Clock className="w-3.5 h-3.5 text-[#2E8B7E]" />
                                {apt.time}
                              </span>
                              <span className="flex items-center gap-1.5 bg-[#F9FAFB] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                                <MapPin className="w-3.5 h-3.5 text-[#E97F6B]" />
                                {apt.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6]">
                          <span
                            className="flex items-center gap-1.5 text-xs font-800 px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: status.bg, color: status.color }}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                          </span>

                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="flex items-center gap-1 text-xs font-700 text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            إلغاء الموعد
                          </button>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-[#F5E8D4]">
                          <p className="text-xs text-[#6B7280] leading-relaxed">
                            <span className="font-700 text-[#1F2937]">ملاحظات: </span>
                            {apt.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past & Cancelled Appointments */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xs font-800 text-[#6B7280] uppercase tracking-wider mb-3">
                المواعيد المنتهية أو الملغاة ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((apt) => {
                  const status = statusConfig[apt.status] ?? statusConfig["مكتمل"];
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-[#E8D8C4] p-4 shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F5E8D4] flex items-center justify-center flex-shrink-0 text-[#6B7280]">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-800 text-[#1F2937]">{apt.childName}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {apt.date} — {apt.time} — مع {apt.specialistName}
                            </p>
                          </div>
                        </div>
                        <span
                          className="flex items-center gap-1.5 text-xs font-800 px-3 py-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: status.bg, color: status.color }}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
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
      )}

      {/* Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="طلب موعد جديد"
        size="md"
      >
        {successMsg ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-[#2E8B7E]/15 rounded-full flex items-center justify-center mx-auto text-[#2E8B7E] animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-900 text-[#1F2937]">تم إرسال طلب الموعد بنجاح!</h3>
            <p className="text-xs text-[#6B7280]">سيتلقى الأخصائي إشعاراً بتأكيد الموعد</p>
          </div>
        ) : (
          <form onSubmit={handleCreateAppointment} className="space-y-4" dir="rtl">
            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">الطفل *</label>
              <select
                required
                value={form.childId}
                onChange={(e) => setForm({ ...form, childId: e.target.value })}
                className="input-rtl"
              >
                {childrenList.map((child: any) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">
                الأخصائي *
                {specialistsList.length > 0 && (
                  <span className="text-xs text-[#2E8B7E] font-600 mr-2">(⭐ = الأخصائي المتابع)</span>
                )}
              </label>
              <select
                required
                value={form.specialistId}
                onChange={(e) => setForm({ ...form, specialistId: e.target.value })}
                className="input-rtl"
              >
                <option value="">— اختر الأخصائي —</option>
                {specialistsList.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.isAssigned ? "⭐ " : ""}{s.name} — {s.speciality}{s.centerName !== "المنصة العادية" ? ` | ${s.centerName}` : ""}
                  </option>
                ))}
              </select>
              {specialistsList.length === 0 && (
                <p className="text-xs text-[#9CA3AF] mt-1">لا يوجد أخصائيون متاحون حالياً</p>
              )}
            </div>

            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">نوع الموعد</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-rtl"
              >
                <option value="جلسة علاج">جلسة علاج (تخاطب / سلوكي)</option>
                <option value="تقييم">تقييم شامل (M-CHAT / ADOS)</option>
                <option value="استشارة">استشارة مع الأخصائي</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-700 text-[#1F2937] block mb-1.5">التاريخ *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-rtl text-xs"
                />
              </div>

              <div>
                <label className="text-sm font-700 text-[#1F2937] block mb-1.5">الوقت</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="input-rtl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">ملاحظات للأخصائي</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-rtl resize-none text-xs"
                rows={3}
                placeholder="اكتب أي معلومات أو ملاحظات ترغب في إبلاغ الأخصائي بها قبل الجلسة..."
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#E8D8C4]">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2E8B7E] text-white rounded-xl text-sm font-800 hover:bg-[#22685e] transition-colors shadow-sm active:scale-95"
              >
                إرسال طلب الموعد
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E8D8C4] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
