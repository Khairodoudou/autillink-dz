"use client";
// app/specialist/patients/page.tsx
import { useState } from "react";
import Link from "next/link";
import { Users, Search, ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockPatients } from "@/lib/mock-data";

const levelColors: Record<string, { bg: string; text: string }> = {
  خفيف:  { bg: "#2E8B7E15", text: "#2E8B7E" },
  متوسط: { bg: "#F5B94215", text: "#c49012" },
  شديد:  { bg: "#EF444415", text: "#EF4444" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  نشط:    { bg: "#2E8B7E15", text: "#2E8B7E" },
  متوقف:  { bg: "#E97F6B15", text: "#E97F6B" },
  مكتمل:  { bg: "#1D5B7915", text: "#1D5B79" },
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const levels = ["الكل", "خفيف", "متوسط", "شديد"];

  const filtered = mockPatients.filter((p) => {
    const matchSearch = p.name.includes(search) || p.parentName.includes(search);
    const matchLevel = filterLevel === "الكل" || p.diagnosisLevel === filterLevel;
    return matchSearch && matchLevel;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="مرضاي"
        subtitle={`${mockPatients.length} مريض تحت متابعتي`}
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
        <div className="flex gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => { setFilterLevel(l); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-600 transition-all ${
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

      {/* Patients Grid */}
      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((p) => {
            const lvl = levelColors[p.diagnosisLevel];
            const sts = statusColors[p.status];
            return (
              <Link
                key={p.id}
                href={`/specialist/patients/${p.id}`}
                className="bg-white rounded-2xl border border-[#D6E8F0] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-900 flex-shrink-0"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.avatarInitial}
                    </div>
                    <div>
                      <p className="text-sm font-800 text-[#1F2937]">{p.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{p.age} سنوات</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#1D5B79] transition-colors flex-shrink-0" />
                </div>

                <div className="flex gap-2 mb-4">
                  <span
                    className="text-xs font-700 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: lvl.bg, color: lvl.text }}
                  >
                    {p.diagnosisLevel}
                  </span>
                  <span
                    className="text-xs font-700 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: sts.bg, color: sts.text }}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Skills bars */}
                <div className="space-y-1.5">
                  {[
                    { label: "التواصل", val: p.skills.communication, color: "#1D5B79" },
                    { label: "الاجتماعي", val: p.skills.social, color: "#2E8B7E" },
                    { label: "الحسي", val: p.skills.sensory, color: "#6B4C93" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-xs text-[#9CA3AF] w-16 text-right">{label}</span>
                      <div className="flex-1 h-1.5 bg-[#E8D8C4] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${val}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs text-[#9CA3AF] w-8">{val}%</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-[#EAF3F7] flex justify-between text-xs text-[#9CA3AF]">
                  <span>{p.sessionsCount} جلسة</span>
                  <span>الجلسة القادمة: {p.nextSession}</span>
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
    </div>
  );
}
