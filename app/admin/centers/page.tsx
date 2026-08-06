"use client";
// app/admin/centers/page.tsx
import { useState } from "react";
import { Building2, CheckCircle, Clock, XCircle, Users, BadgeCheck, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockCenters } from "@/lib/mock-data";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  "معتمد":               { icon: CheckCircle, color: "#2E8B7E", bg: "#2E8B7E15", label: "معتمد" },
  "في انتظار الاعتماد":  { icon: Clock,       color: "#F5B942", bg: "#F5B94215", label: "في انتظار الاعتماد" },
  "موقوف":               { icon: XCircle,     color: "#EF4444", bg: "#EF444415", label: "موقوف" },
};

const planColors: Record<string, { bg: string; text: string }> = {
  أساسي:  { bg: "#1D5B7915", text: "#1D5B79" },
  متوسط:  { bg: "#F5B94215", text: "#c49012" },
  مميز:   { bg: "#6B4C9315", text: "#6B4C93" },
};

export default function AdminCentersPage() {
  const [centers, setCenters] = useState(mockCenters);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const statuses = ["الكل", "معتمد", "في انتظار الاعتماد", "موقوف"];

  const approve = (id: string) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "معتمد" as const } : c))
    );
  };

  const filtered = centers.filter((c) => {
    const matchSearch = c.name.includes(search) || c.director.includes(search) || c.wilaya.includes(search);
    const matchStatus = filterStatus === "الكل" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pending = centers.filter((c) => c.status === "في انتظار الاعتماد");

  return (
    <div>
      <PageHeader
        title="المراكز الشريكة"
        subtitle={`${centers.length} مراكز مسجّلة — ${centers.filter(c => c.status === "معتمد").length} معتمد`}
        icon={Building2}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Pending Approval Highlight */}
      {pending.length > 0 && filterStatus === "الكل" && !search && (
        <div className="mb-8">
          <h2 className="text-sm font-800 text-[#F5B942] uppercase tracking-wide mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            في انتظار الاعتماد ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border-2 border-[#F5B942]/30 p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F5B942]/15 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-[#c49012]" />
                    </div>
                    <div>
                      <h3 className="text-base font-800 text-[#1F2937]">{c.name}</h3>
                      <p className="text-sm text-[#6B7280]">{c.director} — {c.wilaya}</p>
                      <p className="text-xs text-[#9CA3AF]">{c.email} — {c.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => approve(c.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors flex-shrink-0 shadow-sm"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    التحقق والاعتماد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث باسم المركز، المدير، أو الولاية..."
            className="w-full bg-white border border-[#E5D9F2] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#6B4C93] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-600 transition-all ${
                filterStatus === st
                  ? "bg-[#6B4C93] text-white shadow-sm"
                  : "bg-white border border-[#E5D9F2] text-[#6B7280] hover:border-[#6B4C93]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* All Centers Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((c) => {
            const sts = statusConfig[c.status];
            const StatusIcon = sts.icon;
            const plan = planColors[c.plan];
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6B4C93]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#6B4C93]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-800 text-[#1F2937]">{c.name}</h3>
                      <p className="text-xs text-[#6B7280]">{c.wilaya} — {c.director}</p>
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sts.bg, color: sts.color }}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {sts.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 bg-[#F5F0FA] rounded-xl">
                    <p className="text-base font-900 text-[#6B4C93]">{c.specialistsCount}</p>
                    <p className="text-xs text-[#9CA3AF]">أخصائيون</p>
                  </div>
                  <div className="text-center p-2 bg-[#F5F0FA] rounded-xl">
                    <p className="text-base font-900 text-[#6B4C93]">{c.childrenCount}</p>
                    <p className="text-xs text-[#9CA3AF]">طفل</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ backgroundColor: plan.bg }}>
                    <p className="text-sm font-900" style={{ color: plan.text }}>{c.plan}</p>
                    <p className="text-xs" style={{ color: plan.text }}>{c.planPrice.toLocaleString("ar-DZ")} دج</p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-[#9CA3AF]">
                  <span>انضم: {c.joinDate}</span>
                  <span>التجديد: {c.nextPaymentDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          accentColor="#6B4C93"
        />
      </div>
    </div>
  );
}
