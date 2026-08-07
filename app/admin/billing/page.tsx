"use client";
// app/admin/billing/page.tsx
import { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Search,
  Bell,
  Send,
  Check,
  X,
  Users,
  Stethoscope,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  مدفوع: { icon: CheckCircle2, color: "#2E8B7E", bg: "#2E8B7E15" },
  متأخر: { icon: AlertTriangle, color: "#EF4444", bg: "#EF444415" },
  معلق:  { icon: Clock,         color: "#F5B942", bg: "#F5B94215" },
};

const typeConfig: Record<string, { icon: typeof Users; color: string; bg: string; label: string }> = {
  "مركز":    { icon: Building2,   color: "#6B4C93", bg: "#6B4C9315", label: "مركز" },
  "ولي أمر": { icon: Users,       color: "#2E8B7E", bg: "#2E8B7E15", label: "ولي أمر" },
  "أخصائي":  { icon: Stethoscope, color: "#1D5B79", bg: "#1D5B7915", label: "أخصائي" },
};

export default function AdminBillingPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [filterType, setFilterType] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [notifyTarget, setNotifyTarget] = useState<any | null>(null);
  const [sendingNotify, setSendingNotify] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [customMsg, setCustomMsg] = useState("");

  const pageSize = 6;

  useEffect(() => {
    fetch("/api/admin/billing")
      .then((res) => res.json())
      .then((res) => { if (res.ok) setEntries(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const openNotifyModal = (item: any) => {
    setNotifyTarget(item);
    const amount = (item.price ?? 0).toLocaleString("ar-DZ");
    const date = item.endDate ?? "قريباً";
    setCustomMsg(
      `نود تذكيركم بضرورة سداد مستحقات اشتراك منصة AutiLink DZ البالغة ${amount} دج، والمستحقة بتاريخ ${date}. شكراً لتفهمكم.`
    );
  };

  const sendNotification = async () => {
    if (!notifyTarget) return;
    setSendingNotify(true);
    await new Promise((res) => setTimeout(res, 600));
    setSentIds((prev) => new Set(prev).add(notifyTarget.id));
    setSentSuccess(`✓ تم إرسال إشعار التذكير بالسداد إلى ${notifyTarget.name}`);
    setSendingNotify(false);
    setNotifyTarget(null);
    setTimeout(() => setSentSuccess(null), 4500);
  };

  const totalRevenue = entries.reduce(
    (sum, c) => sum + (c.status === "مدفوع" ? (c.price ?? 0) : 0),
    0
  );
  const paidCount   = entries.filter((c) => c.status === "مدفوع").length;
  const overdueCount = entries.filter((c) => c.status === "متأخر").length;

  const statuses = ["الكل", "مدفوع", "متأخر", "معلق"];
  const types    = ["الكل", "ولي أمر", "أخصائي", "مركز"];

  const filtered = entries.filter((c) => {
    const matchSearch = (c.name || "").includes(search) || (c.director || "").includes(search);
    const matchStatus = filterStatus === "الكل" || c.status === filterStatus;
    const matchType   = filterType   === "الكل" || c.type  === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <PageHeader
        title="الاشتراكات والفواتير"
        subtitle="متابعة حالات سداد الأولياء والأخصائيين والمراكز"
        icon={CreditCard}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">مجموع المداخيل</span>
            <div className="w-9 h-9 rounded-xl bg-[#6B4C93]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#6B4C93]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#1F2937]">{totalRevenue.toLocaleString("ar-DZ")} دج</p>
          <p className="text-xs text-[#9CA3AF] mt-1">إجمالي الاشتراكات المدفوعة</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">اشتراكات سُدّدت</span>
            <div className="w-9 h-9 rounded-xl bg-[#2E8B7E]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#2E8B7E]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#2E8B7E]">{paidCount}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">من أصل {entries.length} مشترك</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#9CA3AF]">فواتير متأخرة</span>
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
          </div>
          <p className="text-2xl font-900 text-[#EF4444]">{overdueCount}</p>
          <p className="text-xs text-[#9CA3AF] mt-1">تستوجب المتابعة</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث بالاسم أو البريد أو التخصص..."
            className="w-full bg-white border border-[#E5D9F2] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#6B4C93] transition-colors"
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
                  ? "bg-[#6B4C93] text-white shadow-sm"
                  : "bg-white border border-[#E5D9F2] text-[#6B7280] hover:border-[#6B4C93]"
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
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E5D9F2] p-12 text-center text-[#6B7280]">
          جاري تحميل بيانات الاشتراكات...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5D9F2] shadow-sm overflow-hidden p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-[#E5D9F2] bg-[#F5F0FA]">
                  {["المشترك", "النوع", "الخطة", "المبلغ / شهرياً", "انتهاء الاشتراك", "حالة الدفع", "إجراء"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-800 text-[#6B7280] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0FA]">
                {paginated.map((c) => {
                  const sts = statusConfig[c.status] ?? statusConfig["معلق"];
                  const typ = typeConfig[c.type]   ?? typeConfig["ولي أمر"];
                  const StatusIcon = sts.icon;
                  const TypeIcon   = typ.icon;
                  const isSent = sentIds.has(c.id);

                  return (
                    <tr key={c.id} className="hover:bg-[#F5F0FA] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-800 text-[#1F2937]">{c.name}</p>
                        {c.director && <p className="text-xs text-[#9CA3AF] mt-0.5">{c.director}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-800 px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: typ.bg, color: typ.color }}
                        >
                          <TypeIcon className="w-3.5 h-3.5" />
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-700 text-[#6B4C93]">خطة {c.plan}</td>
                      <td className="px-4 py-3 text-sm font-900 text-[#1F2937]">
                        {(c.price ?? 0).toLocaleString("ar-DZ")} دج
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{c.endDate ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-800 px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: sts.bg, color: sts.color }}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isSent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-700 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            تم الإرسال
                          </span>
                        ) : (
                          <button
                            onClick={() => openNotifyModal(c)}
                            className="flex items-center gap-1.5 text-xs font-700 px-3 py-1.5 rounded-xl border border-[#E5D9F2] hover:bg-[#F0EBF8] text-[#6B4C93] transition-colors"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            إشعار
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[#9CA3AF] text-sm">
                      لا توجد اشتراكات مطابقة للبحث
                    </td>
                  </tr>
                )}
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
      )}

      {/* Toast */}
      {sentSuccess && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#2E8B7E] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-700">{sentSuccess}</span>
        </div>
      )}

      {/* Notification Modal */}
      {notifyTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5D9F2] shadow-2xl max-w-md w-full p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F0FA] pb-3">
              <div className="flex items-center gap-2 text-[#6B4C93] font-800 text-base">
                <Bell className="w-5 h-5" />
                <span>إرسال إشعار تذكير بالسداد</span>
              </div>
              <button
                onClick={() => setNotifyTarget(null)}
                className="text-[#9CA3AF] hover:text-[#1F2937] p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-1">
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">المستلم</p>
                <p className="text-sm font-800 text-[#1F2937] bg-[#F5F0FA] p-2.5 rounded-xl border border-[#E5D9F2]">
                  {notifyTarget.name} — {notifyTarget.type} ({notifyTarget.plan})
                </p>
              </div>
              <div>
                <label className="block text-xs font-700 text-[#4B5563] mb-1">نص التذكير</label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full bg-[#F5F0FA] border border-[#E5D9F2] rounded-xl p-3 text-sm text-right outline-none focus:border-[#6B4C93] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#F5F0FA]">
              <button
                onClick={() => setNotifyTarget(null)}
                disabled={sendingNotify}
                className="px-4 py-2 rounded-xl text-sm font-600 border border-[#E5D9F2] text-[#6B7280] hover:bg-[#F5F0FA] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={sendNotification}
                disabled={sendingNotify}
                className="px-5 py-2 rounded-xl text-sm font-700 bg-[#6B4C93] text-white hover:bg-[#583d7a] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4 rotate-180" />
                {sendingNotify ? "جاري الإرسال..." : "إرسال الإشعار"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
