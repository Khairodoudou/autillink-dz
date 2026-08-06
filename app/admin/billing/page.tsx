"use client";
// app/admin/billing/page.tsx
import { useState } from "react";
import { CreditCard, CheckCircle2, Clock, AlertTriangle, DollarSign, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockCenters } from "@/lib/mock-data";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  مدفوع: { icon: CheckCircle2, color: "#2E8B7E", bg: "#2E8B7E15" },
  متأخر: { icon: AlertTriangle, color: "#EF4444", bg: "#EF444415" },
  معلق:  { icon: Clock, color: "#F5B942", bg: "#F5B94215" },
};

export default function AdminBillingPage() {
  const [centers] = useState(mockCenters);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalRevenue = centers.reduce((sum, c) => sum + (c.paymentStatus === "مدفوع" ? c.planPrice : 0), 0);
  const paidCount = centers.filter((c) => c.paymentStatus === "مدفوع").length;
  const overdueCount = centers.filter((c) => c.paymentStatus === "متأخر").length;

  const statuses = ["الكل", "مدفوع", "متأخر", "معلق"];

  const filtered = centers.filter((c) => {
    const matchSearch = c.name.includes(search) || c.director.includes(search);
    const matchStatus = filterStatus === "الكل" || c.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="الاشتراكات والفلترة المالية"
        subtitle="متابعة فواتير وحالات سداد المراكز"
        icon={CreditCard}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">مجموع المداخيل الحالية</span>
            <div className="w-9 h-9 rounded-xl bg-[#6B4C93]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#6B4C93]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#1F2937]">{totalRevenue.toLocaleString("ar-DZ")} دج</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">فواتير سُدّدت</span>
            <div className="w-9 h-9 rounded-xl bg-[#2E8B7E]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#2E8B7E]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#2E8B7E]">{paidCount} مراكز</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">فواتير متأخرة</span>
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#EF4444]">{overdueCount} مراكز</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث باسم المركز أو المدير..."
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

      {/* Billing Table */}
      <div className="bg-white rounded-2xl border border-[#E5D9F2] shadow-sm overflow-hidden p-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#E5D9F2] bg-[#F5F0FA]">
                {["المركز", "الخطة", "المبلغ الشهري", "تاريخ التجديد", "حالة الدفع", "الإجراءات"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-800 text-[#6B7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0FA]">
              {paginated.map((c) => {
                const sts = statusConfig[c.paymentStatus];
                const StatusIcon = sts.icon;
                return (
                  <tr key={c.id} className="hover:bg-[#F5F0FA] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-700 text-[#1F2937]">{c.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{c.director}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-600 text-[#6B4C93]">خطة {c.plan}</td>
                    <td className="px-4 py-3 text-sm font-800 text-[#1F2937]">
                      {c.planPrice.toLocaleString("ar-DZ")} دج
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{c.nextPaymentDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: sts.bg, color: sts.color }}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {c.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs font-700 px-3 py-1.5 rounded-xl border border-[#E5D9F2] hover:bg-[#F0EBF8] text-[#6B4C93] transition-colors">
                        إرسال إشعار
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
