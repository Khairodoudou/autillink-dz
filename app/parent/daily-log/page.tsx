"use client";
// app/parent/daily-log/page.tsx
import { useState } from "react";
import { ClipboardList, Plus, Moon, Zap, MessageCircle, Dumbbell, ChevronDown, Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import { mockDailyLog, mockChildren } from "@/lib/mock-data";

const moodEmojis = [
  { value: 1, label: "سيء جداً",  color: "#EF4444" },
  { value: 2, label: "سيء",       color: "#F97316" },
  { value: 3, label: "عادي",      color: "#F5B942" },
  { value: 4, label: "جيد",       color: "#22C55E" },
  { value: 5, label: "ممتاز",     color: "#2E8B7E" },
];

export default function DailyLogPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: mockChildren[0].id,
    mood: 3,
    sleep: 8,
    tantrums: 0,
    newWords: "",
    notes: "",
  });
  const [logs, setLogs] = useState(mockDailyLog);
  const [search, setSearch] = useState("");
  const [filterChild, setFilterChild] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const childrenFilterOptions = ["الكل", ...mockChildren.map((c) => c.name)];

  const filtered = logs.filter((log) => {
    const matchSearch = log.childName.includes(search) || log.notes.includes(search) || log.newWords.some((w) => w.includes(search));
    const matchChild = filterChild === "الكل" || log.childName === filterChild;
    return matchSearch && matchChild;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    setLogs([
      {
        id: `log-${Date.now()}`,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5),
        childId: form.childId,
        childName: mockChildren.find((c) => c.id === form.childId)?.name ?? "",
        mood: form.mood,
        sleep: form.sleep,
        tantrums: form.tantrums,
        newWords: form.newWords ? form.newWords.split("،") : [],
        notes: form.notes,
        exercises: [],
      },
      ...logs,
    ]);
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        title="السجل اليومي"
        subtitle="تتبع تطور طفلك يوماً بيوم"
        icon={ClipboardList}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
        actions={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة ملاحظة
          </button>
        }
      />

      {/* Add Entry Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#2E8B7E]/30 p-6 mb-6 shadow-sm">
          <h3 className="text-base font-800 text-[#1F2937] mb-5">ملاحظة جديدة</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Child Select */}
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">الطفل</label>
              <div className="relative">
                <select
                  value={form.childId}
                  onChange={(e) => setForm({ ...form, childId: e.target.value })}
                  className="w-full input-rtl appearance-none pr-4 pl-10"
                >
                  {mockChildren.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-2">المزاج</label>
              <div className="flex gap-3">
                {moodEmojis.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm({ ...form, mood: m.value })}
                    className={`flex-1 py-3 rounded-xl border-2 text-xs font-700 transition-all ${
                      form.mood === m.value
                        ? "border-current"
                        : "border-[#E8D8C4] text-[#9CA3AF]"
                    }`}
                    style={form.mood === m.value ? { borderColor: m.color, color: m.color, backgroundColor: `${m.color}10` } : {}}
                  >
                    {m.value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-1 text-center">
                {moodEmojis.find((m) => m.value === form.mood)?.label}
              </p>
            </div>

            {/* Sleep + Tantrums */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                  النوم (ساعات)
                </label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={form.sleep}
                  onChange={(e) => setForm({ ...form, sleep: +e.target.value })}
                  className="input-rtl"
                />
              </div>
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                  نوبات الغضب
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.tantrums}
                  onChange={(e) => setForm({ ...form, tantrums: +e.target.value })}
                  className="input-rtl"
                />
              </div>
            </div>

            {/* New Words */}
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                كلمات جديدة (افصل بفاصلة عربية ،)
              </label>
              <input
                type="text"
                value={form.newWords}
                onChange={(e) => setForm({ ...form, newWords: e.target.value })}
                placeholder="مثال: شكراً، ماء، أريد"
                className="input-rtl"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">ملاحظات</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="كيف كان يومه؟ ما الأشياء التي لاحظتها؟"
                className="input-rtl resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors"
              >
                حفظ الملاحظة
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 border border-[#E8D8C4] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
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
            placeholder="ابحث في الكلمات الجديدة أو الملاحظات..."
            className="w-full bg-white border border-[#E8D8C4] rounded-xl pr-9 pl-3 py-2.5 text-sm text-right outline-none placeholder:text-[#9CA3AF] focus:border-[#2E8B7E] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {childrenFilterOptions.map((cName) => (
            <button
              key={cName}
              onClick={() => { setFilterChild(cName); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-600 transition-all ${
                filterChild === cName
                  ? "bg-[#2E8B7E] text-white shadow-sm"
                  : "bg-white border border-[#E8D8C4] text-[#6B7280] hover:border-[#2E8B7E]"
              }`}
            >
              {cName}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries */}
      <div className="space-y-4">
        {paginated.map((entry) => {
          const mood = moodEmojis.find((m) => m.value === entry.mood);
          return (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-[#E8D8C4] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-800 text-[#1F2937]">{entry.childName}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {entry.date} — {entry.time}
                  </p>
                </div>
                <span
                  className="text-xs font-700 px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${mood?.color}15`, color: mood?.color }}
                >
                  {mood?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Moon className="w-4 h-4 text-[#1D5B79]" />
                  <span>{entry.sleep} ساعات</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Zap className="w-4 h-4 text-[#F5B942]" />
                  <span>{entry.tantrums} نوبات</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <MessageCircle className="w-4 h-4 text-[#2E8B7E]" />
                  <span>{entry.newWords.length} كلمات</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Dumbbell className="w-4 h-4 text-[#6B4C93]" />
                  <span>{entry.exercises.length} تمارين</span>
                </div>
              </div>

              {entry.newWords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.newWords.map((word, i) => (
                    <span
                      key={i}
                      className="text-xs font-600 px-2.5 py-1 bg-[#2E8B7E]/10 text-[#2E8B7E] rounded-full"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}

              {entry.notes && (
                <p className="text-sm text-[#6B7280] leading-relaxed border-t border-[#F5E8D4] pt-3">
                  {entry.notes}
                </p>
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
