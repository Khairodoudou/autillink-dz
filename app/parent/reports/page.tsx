"use client";
// app/parent/reports/page.tsx
import { useState } from "react";
import { FileText, Download, Eye, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockReports } from "@/lib/mock-data";

const typeColors: Record<string, { bg: string; text: string }> = {
  "تقرير شهري":    { bg: "#1D5B7915", text: "#1D5B79" },
  "تقرير تقييم":   { bg: "#E97F6B15", text: "#d4624d" },
  "تقرير متابعة":  { bg: "#2E8B7E15", text: "#2E8B7E" },
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const types = ["الكل", "تقرير شهري", "تقرير تقييم", "تقرير متابعة"];

  const handleDownload = (fileName: string) => {
    alert(`سيتم تحميل: ${fileName}`);
  };

  const filtered = mockReports.filter((r) => {
    const matchSearch = r.childName.includes(search) || r.specialistName.includes(search) || r.summary.includes(search);
    const matchType = filterType === "الكل" || r.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="التقارير"
        subtitle="كل التقارير المرسلة من الأخصائيين"
        icon={FileText}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بحسب اسم الطفل أو الأخصائي أو المحتوى..."
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

      <div className="space-y-4">
        {paginated.map((report) => {
          const typeStyle = typeColors[report.type] ?? typeColors["تقرير متابعة"];
          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-[#E8D8C4] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F5E8D4] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#6B7280]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-700 px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
                      >
                        {report.type}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{report.date}</span>
                    </div>
                    <h3 className="text-base font-800 text-[#1F2937] mb-1">
                      {report.childName}
                    </h3>
                    <p className="text-xs text-[#6B7280] mb-3">
                      بقلم {report.specialistName}
                    </p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {report.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E8D8C4] rounded-xl text-xs font-700 text-[#1D5B79] hover:bg-[#1D5B7910] transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    عرض
                  </button>
                  <button
                    onClick={() => handleDownload(report.fileName)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2E8B7E] rounded-xl text-xs font-700 text-white hover:bg-[#22685e] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    تحميل
                  </button>
                </div>
              </div>

              {report.recommendations && (
                <div className="mt-4 pt-4 border-t border-[#F5E8D4]">
                  <p className="text-xs font-700 text-[#6B7280] mb-1">التوصيات:</p>
                  <p className="text-sm text-[#1F2937]">{report.recommendations}</p>
                </div>
              )}
            </div>
          );
        })}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          accentColor="#2E8B7E"
        />
      </div>
    </div>
  );
}
