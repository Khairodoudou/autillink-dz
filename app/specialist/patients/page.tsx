"use client";
// app/specialist/patients/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, ChevronLeft, Phone, Calendar, Sparkles, Activity } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const levelColors: Record<string, { bg: string; text: string }> = {
  "خفيف":  { bg: "#2E8B7E15", text: "#2E8B7E" },
  "متوسط": { bg: "#F5B94215", text: "#c49012" },
  "شديد":  { bg: "#EF444415", text: "#EF4444" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  "نشط":    { bg: "#2E8B7E15", text: "#2E8B7E" },
  "متوقف":  { bg: "#E97F6B15", text: "#E97F6B" },
  "مكتمل":  { bg: "#1D5B7915", text: "#1D5B79" },
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  useEffect(() => {
    fetch("/api/specialist/patients")
      .then((r) => r.json())
      .then((res) => { if (res.ok) setPatients(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const levels = ["الكل", "خفيف", "متوسط", "شديد"];

  const filtered = patients.filter((p) => {
    const matchSearch =
      (p.name ?? "").includes(search) || (p.parentName ?? "").includes(search);
    const matchLevel = filterLevel === "الكل" || p.diagnosisLevel === filterLevel;
    return matchSearch && matchLevel;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="مرضاي وحالات المتابعة"
        subtitle={`${patients.length} أطفال تحت إشرافك ومتابعتك`}
        icon={Users}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بالاسم أو اسم ولي الأمر..."
            className="w-full bg-white border border-[#D6E8F0] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#1D5B79] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => { setFilterLevel(l); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-sm font-700 transition-all ${
                filterLevel === l
                  ? "bg-[#1D5B79] text-white shadow-sm"
                  : "bg-white border border-[#D6E8F0] text-[#6B7280] hover:border-[#1D5B79]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-12 text-center text-[#6B7280]">
          جاري تحميل قائمة المرضى...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EAF3F7] flex items-center justify-center mx-auto mb-4 text-[#1D5B79]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-800 text-[#1F2937] mb-1">لا يوجد أطفال تحت إشرافك حالياً</h3>
          <p className="text-xs text-[#6B7280]">
            تظهر في هذه الصفحة فقط الحالات المسندة إليك والأطفال الذين قاموا بحجز موعد مؤكد معك.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map((p) => {
              const lvl = levelColors[p.diagnosisLevel] ?? levelColors["متوسط"];
              const sts = statusColors[p.status] ?? statusColors["نشط"];
              return (
                <Link
                  key={p.id}
                  href={`/specialist/patients/${p.id}`}
                  className="bg-white rounded-2xl border border-[#D6E8F0] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-900 flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: p.avatarColor || "#1D5B79" }}
                        >
                          {p.avatarInitial || p.name[0]}
                        </div>
                        <div>
                          <p className="text-base font-800 text-[#1F2937] group-hover:text-[#1D5B79] transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            السن: {p.age} سنوات — ولي الأمر: {p.parentName}
                          </p>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1D5B79] transition-colors flex-shrink-0 mt-1" />
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span
                        className="text-xs font-800 px-3 py-1 rounded-full"
                        style={{ backgroundColor: lvl.bg, color: lvl.text }}
                      >
                        طيف {p.diagnosisLevel}
                      </span>
                      <span
                        className="text-xs font-800 px-3 py-1 rounded-full"
                        style={{ backgroundColor: sts.bg, color: sts.text }}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Skills progress bars */}
                    <div className="space-y-2 bg-[#F9FAFB] p-3 rounded-xl border border-[#F3F4F6]">
                      {[
                        { label: "التواصل", val: p.skills?.communication ?? 65, color: "#1D5B79" },
                        { label: "الاجتماعي", val: p.skills?.social ?? 55, color: "#2E8B7E" },
                        { label: "الحسي", val: p.skills?.sensory ?? 70, color: "#6B4C93" },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-xs font-700 text-[#4B5563] w-14 text-right">{label}</span>
                          <div className="flex-1 h-2 bg-[#E8D8C4] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${val}%`, backgroundColor: color }}
                            />
                          </div>
                          <span className="text-xs font-800 text-[#1F2937] w-8">{val}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAF3F7] flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1 font-700">
                      <Activity className="w-3.5 h-3.5 text-[#1D5B79]" />
                      {p.sessionsCount} جلسات
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2E8B7E]" />
                      {p.nextSession}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

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
