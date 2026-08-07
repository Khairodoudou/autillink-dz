"use client";
// app/parent/reports/page.tsx
import { useState, useEffect } from "react";
import { FileText, Download, Eye, Search, X, Calendar, User, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  "تقرير شهري":   { bg: "#1D5B7915", text: "#1D5B79", border: "#1D5B7930" },
  "تقرير تقييم":  { bg: "#E97F6B15", text: "#d4624d", border: "#E97F6B30" },
  "تقرير متابعة": { bg: "#2E8B7E15", text: "#2E8B7E", border: "#2E8B7E30" },
  "يومي":         { bg: "#F5B94215", text: "#c49012", border: "#F5B94230" },
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const pageSize = 4;

  useEffect(() => {
    fetch("/api/parent/reports")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setReports(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = ["الكل", "تقرير شهري", "تقرير تقييم", "تقرير متابعة"];

  const handleDownload = (report: any) => {
    // Create a printable clean report document in new window or print dialog
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(`سيتم تحميل التقرير: ${report.fileName}`);
      return;
    }

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>${report.fileName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1F2937; line-height: 1.6; }
            .header { border-bottom: 2px solid #2E8B7E; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; color: #1D5B79; margin: 0; }
            .meta { font-size: 14px; color: #6B7280; margin-top: 5px; }
            .badge { display: inline-block; padding: 4px 12px; background: #2E8B7E15; color: #2E8B7E; border-radius: 20px; font-weight: bold; font-size: 13px; }
            .section { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #374151; margin-top: 0; margin-bottom: 10px; border-bottom: 1px dashed #D1D5DB; padding-bottom: 5px; }
            .content { white-space: pre-wrap; font-size: 14px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">تقرير طبي وتأهيلي — AutiLink DZ</h1>
              <p class="meta">اسم الطفل: <strong>${report.childName}</strong> | الأخصائي: <strong>${report.specialistName}</strong></p>
            </div>
            <div>
              <span class="badge">${report.type}</span>
              <p class="meta" style="text-align: left;">التاريخ: ${report.date}</p>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">نص ومحتوى التقرير</h2>
            <div class="content">${report.summary}</div>
          </div>

          <div class="section" style="background: #F0FDF4; border-color: #BBF7D0;">
            <h2 class="section-title" style="color: #166534; border-color: #86EFAC;">التوصيات والخطة العلاجية</h2>
            <div class="content" style="color: #15803D;">${report.recommendations}</div>
          </div>

          <div class="footer">
            تم إصدار هذا التقرير إلكترونياً من منصة AutiLink DZ لرعاية وتأهيل التوحد
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filtered = reports.filter((r) => {
    const matchSearch =
      (r.childName ?? "").includes(search) ||
      (r.specialistName ?? "").includes(search) ||
      (r.summary ?? "").includes(search);
    const matchType = filterType === "الكل" || r.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="تقارير الأخصائيين"
        subtitle="كل التقارير الطبية والتأهيلية المرسلة من الأخصائيين المتابعين"
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
            placeholder="ابحث بحسب اسم الطفل، الأخصائي، أو محتوى التقرير..."
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

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center text-[#6B7280]">
          جاري تحميل التقارير الطبية...
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5E8D4] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-base font-800 text-[#1F2937] mb-1">لا توجد تقارير من الأخصائيين</h3>
          <p className="text-xs text-[#6B7280]">
            {search || filterType !== "الكل"
              ? "لم نجد تقارير تطابق خيارات البحث المحددة"
              : "ستظهر هنا جميع التقارير الطبية والتأهيلية بمجرد إرسالها من طرف الأخصائيين المتابعين."}
          </p>
        </div>
      ) : (
        /* Reports List */
        <div className="space-y-4">
          {paginated.map((report) => {
            const typeStyle = typeColors[report.type] ?? typeColors["تقرير متابعة"];
            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-[#E8D8C4] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2E8B7E]/10 flex items-center justify-center flex-shrink-0 text-[#2E8B7E]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="text-xs font-800 px-3 py-1 rounded-full border"
                          style={{
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.text,
                            borderColor: typeStyle.border,
                          }}
                        >
                          {report.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{report.date}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-800 text-[#1F2937] mb-1">
                        الطفل: {report.childName}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#1D5B79] font-700 mb-3">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>بقلم الأخصائي: {report.specialistName}</span>
                        {report.specialistRole && (
                          <span className="text-[#6B7280] font-normal">({report.specialistRole})</span>
                        )}
                      </div>

                      <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-3 bg-[#FDFBF7] p-3 rounded-xl border border-[#F5E8D4]">
                        {report.summary}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 flex-shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#1D5B79]/30 bg-[#1D5B79]/5 rounded-xl text-xs font-800 text-[#1D5B79] hover:bg-[#1D5B79]/15 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#2E8B7E] rounded-xl text-xs font-800 text-white hover:bg-[#22685e] transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      تحميل PDF
                    </button>
                  </div>
                </div>

                {report.recommendations && (
                  <div className="mt-4 pt-3 border-t border-[#F5E8D4] flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2E8B7E] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-800 text-[#1F2937]">التوصيات المباشرة: </span>
                      <span className="text-[#4B5563]">{report.recommendations}</span>
                    </div>
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
      )}

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E8D8C4] max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto" dir="rtl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8D8C4] pb-4">
              <div>
                <span className="text-xs font-800 px-3 py-1 rounded-full bg-[#2E8B7E] text-white">
                  {selectedReport.type}
                </span>
                <h2 className="text-lg font-900 text-[#1F2937] mt-2">
                  تقرير التطور والتقييم للطفل: {selectedReport.childName}
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  تاريخ الإرسال: {selectedReport.date} — بقلم {selectedReport.specialistName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-sm text-[#374151]">
              <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8D8C4]">
                <h4 className="text-xs font-800 text-[#1D5B79] uppercase tracking-wide mb-2">محتوى التقرير الطبي</h4>
                <p className="whitespace-pre-wrap leading-relaxed text-[#1F2937]">
                  {selectedReport.summary}
                </p>
              </div>

              {selectedReport.recommendations && (
                <div className="bg-[#F0FDF4] p-4 rounded-2xl border border-[#BBF7D0]">
                  <h4 className="text-xs font-800 text-[#166534] uppercase tracking-wide mb-2">التوصيات الموجهة لولي الأمر</h4>
                  <p className="text-[#15803D] leading-relaxed font-600">
                    {selectedReport.recommendations}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 pt-3 border-t border-[#E8D8C4]">
              <button
                onClick={() => handleDownload(selectedReport)}
                className="flex-1 py-3 bg-[#2E8B7E] text-white rounded-xl text-xs font-800 hover:bg-[#22685e] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                تحميل التقرير PDF / طباعة
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-3 border border-[#E8D8C4] rounded-xl text-xs font-800 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
