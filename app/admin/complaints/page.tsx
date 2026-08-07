"use client";
// app/admin/complaints/page.tsx
import { useState, useEffect } from "react";
import { AlertCircle, X, MessageSquare, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const statusConfig: Record<string, { color: string; bg: string }> = {
  نشط:   { color: "#EF4444", bg: "#EF444415" },
  معالج: { color: "#2E8B7E", bg: "#2E8B7E15" },
  مغلق:  { color: "#9CA3AF", bg: "#9CA3AF15" },
};

const priorityColors: Record<string, string> = {
  عالية:   "#EF4444",
  متوسطة: "#F5B942",
  منخفضة: "#2E8B7E",
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 4;

  const loadComplaints = () => {
    setLoading(true);
    fetch("/api/admin/complaints")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setComplaints(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const statuses = ["الكل", "نشط", "معالج", "مغلق"];

  const filtered = complaints.filter((c) => {
    const matchSearch = c.subject.includes(search) || c.userName.includes(search) || c.description.includes(search);
    const matchStatus = filterStatus === "الكل" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "معالج" as const, resolution: "تمت معالجة الشكوى بنجاح من قبل قسم الدعم." } : c
      )
    );
    if (selectedComplaint?.id === id) {
      setSelectedComplaint((prev: any) =>
        prev ? { ...prev, status: "معالج" as const, resolution: "تمت معالجة الشكوى بنجاح من قبل قسم الدعم." } : null
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="الشكاوى والتظلمات"
        subtitle="متابعة وتحليل التقريرات والشكاوى الواردة من المستخدمين"
        icon={AlertCircle}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بالموضوع، المرسل، أو تفاصيل الشكوى..."
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

      <div className="space-y-4">
        {paginated.map((c) => {
          const sts = statusConfig[c.status];
          const prioColor = priorityColors[c.priority];
          return (
            <div
              key={c.id}
              onClick={() => setSelectedComplaint(c)}
              className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6B4C93]/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#6B4C93]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-700 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${prioColor}15`, color: prioColor }}
                      >
                        أولوية {c.priority}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{c.date}</span>
                    </div>
                    <h3 className="text-base font-800 text-[#1F2937] mb-1">{c.subject}</h3>
                    <p className="text-xs text-[#6B7280]">
                      بواسطة: <span className="font-700 text-[#1F2937]">{c.userName}</span> ({c.userRole})
                    </p>
                  </div>
                </div>

                <span
                  className="text-xs font-700 px-3 py-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: sts.bg, color: sts.color }}
                >
                  {c.status}
                </span>
              </div>
            </div>
          );
        })}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          accentColor="#6B4C93"
        />
      </div>

      {/* Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5D9F2] pb-3">
              <h3 className="text-base font-800 text-[#1F2937]">تفاصيل الشكوى</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-8 h-8 rounded-xl bg-[#F0EBF8] flex items-center justify-center text-[#6B7280]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-[#9CA3AF]">الموضوع</p>
              <p className="text-base font-800 text-[#1F2937]">{selectedComplaint.subject}</p>
            </div>

            <div>
              <p className="text-xs text-[#9CA3AF]">الوصف الكامل</p>
              <p className="text-sm text-[#6B7280] leading-relaxed bg-[#F5F0FA] p-3 rounded-xl mt-1">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.resolution && (
              <div>
                <p className="text-xs text-[#2E8B7E] font-700">حل المشكلة</p>
                <p className="text-xs text-[#6B7280] bg-[#2E8B7E]/10 p-3 rounded-xl mt-1">
                  {selectedComplaint.resolution}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[#E5D9F2] flex justify-end gap-2">
              {selectedComplaint.status === "نشط" && (
                <button
                  onClick={() => resolveComplaint(selectedComplaint.id)}
                  className="px-4 py-2 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors"
                >
                  تعليم كمعالج ✓
                </button>
              )}
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 border border-[#E5D9F2] rounded-xl text-sm font-700 text-[#6B7280]"
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
