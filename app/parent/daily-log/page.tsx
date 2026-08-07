"use client";
// app/parent/daily-log/page.tsx
import { useState, useEffect } from "react";
import { ClipboardList, Plus, Moon, Zap, MessageCircle, Dumbbell, ChevronDown, Search, Edit3, Trash2, Check, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TablePagination from "@/components/ui/TablePagination";
import Modal from "@/components/ui/Modal";

const moodEmojis = [
  { value: 1, label: "سيء جداً",  color: "#EF4444" },
  { value: 2, label: "سيء",       color: "#F97316" },
  { value: 3, label: "عادي",      color: "#F5B942" },
  { value: 4, label: "جيد",       color: "#22C55E" },
  { value: 5, label: "ممتاز",     color: "#2E8B7E" },
];

export default function DailyLogPage() {
  const [showForm, setShowForm] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [form, setForm] = useState({
    childId: "",
    mood: 3,
    sleep: 8,
    tantrums: 0,
    newWords: "",
    notes: "",
  });

  // Edit Log State
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    id: "",
    childId: "",
    mood: 3,
    sleep: 8,
    tantrums: 0,
    newWords: "",
    notes: "",
  });
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterChild, setFilterChild] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 4;

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/parent/children").then((r) => r.json()),
      fetch("/api/parent/reports?type=DAILY").then((r) => r.json()),
    ])
      .then(([childRes, logRes]) => {
        if (childRes.ok) {
          setChildren(childRes.data);
          if (childRes.data.length > 0 && !form.childId) {
            setForm((f) => ({ ...f, childId: childRes.data[0].id }));
          }
        }
        if (logRes.ok) setLogs(logRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const childrenFilterOptions = ["الكل", ...children.map((c: any) => c.name)];

  const filtered = logs.filter((log: any) => {
    const matchSearch =
      (log.childName ?? "").includes(search) ||
      (log.notes ?? "").includes(search) ||
      (Array.isArray(log.newWords) && log.newWords.some((w: any) => String(w).includes(search)));
    const matchChild = filterChild === "الكل" || log.childName === filterChild;
    return matchSearch && matchChild;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/parent/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: form.childId,
          mood: form.mood,
          sleepHours: form.sleep,
          tantrums: form.tantrums,
          newWords: form.newWords ? form.newWords.split("،").map((w) => w.trim()).filter(Boolean) : [],
          notes: form.notes,
        }),
      });
      if (res.ok) {
        loadData();
        setShowForm(false);
        setForm({ childId: children[0]?.id || "", mood: 3, sleep: 8, tantrums: 0, newWords: "", notes: "" });
      }
    } catch (err) {
      console.error("Failed to add log", err);
    }
  };

  const openEditModal = (log: any) => {
    setEditingLog(log);
    setEditForm({
      id: log.id,
      childId: log.childId || children[0]?.id || "",
      mood: log.mood || 3,
      sleep: log.sleep || 8,
      tantrums: log.tantrums || 0,
      newWords: Array.isArray(log.newWords) ? log.newWords.join("، ") : "",
      notes: log.notes || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    try {
      const res = await fetch(`/api/parent/reports/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: editForm.childId,
          mood: editForm.mood,
          sleepHours: editForm.sleep,
          tantrums: editForm.tantrums,
          newWords: editForm.newWords ? editForm.newWords.split("،").map((w) => w.trim()).filter(Boolean) : [],
          notes: editForm.notes,
        }),
      });

      if (res.ok) {
        setEditSuccessMsg(true);
        loadData();
        setTimeout(() => {
          setEditSuccessMsg(false);
          setEditingLog(null);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to edit log", err);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذه الملاحظة اليومية؟")) return;

    try {
      const res = await fetch(`/api/parent/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  return (
    <div>
      <PageHeader
        title="السجل اليومي"
        subtitle="تتبع وتعديل تطور طفلك يوماً بيوم"
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
                  {children.map((c: any) => (
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
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center text-[#6B7280]">
            جاري تحميل السجلات اليومية...
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8D8C4] p-12 text-center text-[#6B7280]">
            لا توجد ملاحظات يومية بعد.
          </div>
        ) : (
          paginated.map((entry) => {
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
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-700 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${mood?.color}15`, color: mood?.color }}
                    >
                      {mood?.label}
                    </span>
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-1.5 text-[#1D5B79] hover:bg-[#1D5B79]/10 rounded-lg transition-colors"
                      title="تعديل الملاحظة"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLog(entry.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    <span>{entry.newWords?.length ?? 0} كلمات</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Dumbbell className="w-4 h-4 text-[#6B4C93]" />
                    <span>{entry.exercises?.length ?? 0} تمارين</span>
                  </div>
                </div>

                {entry.newWords && entry.newWords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.newWords.map((word: any, i: number) => (
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
          })
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

      {/* MODAL: تعديل الملاحظة اليومية */}
      <Modal
        isOpen={Boolean(editingLog)}
        onClose={() => setEditingLog(null)}
        title="تعديل الملاحظة اليومية"
        size="md"
      >
        {editSuccessMsg ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-[#2E8B7E]/15 rounded-full flex items-center justify-center mx-auto text-[#2E8B7E]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-800 text-[#1F2937]">تم تعديل الملاحظة بنجاح!</h3>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-5" dir="rtl">
            {/* Child Select */}
            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">الطفل</label>
              <div className="relative">
                <select
                  value={editForm.childId}
                  onChange={(e) => setEditForm({ ...editForm, childId: e.target.value })}
                  className="w-full input-rtl appearance-none pr-4 pl-10"
                >
                  {children.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-2">المزاج</label>
              <div className="flex gap-2">
                {moodEmojis.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, mood: m.value })}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-700 transition-all ${
                      editForm.mood === m.value
                        ? "border-current"
                        : "border-[#E8D8C4] text-[#9CA3AF]"
                    }`}
                    style={editForm.mood === m.value ? { borderColor: m.color, color: m.color, backgroundColor: `${m.color}10` } : {}}
                  >
                    {m.value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-1 text-center">
                {moodEmojis.find((m) => m.value === editForm.mood)?.label}
              </p>
            </div>

            {/* Sleep + Tantrums */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-700 text-[#1F2937] block mb-1.5">
                  النوم (ساعات)
                </label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={editForm.sleep}
                  onChange={(e) => setEditForm({ ...editForm, sleep: +e.target.value })}
                  className="input-rtl"
                />
              </div>
              <div>
                <label className="text-sm font-700 text-[#1F2937] block mb-1.5">
                  نوبات الغضب
                </label>
                <input
                  type="number"
                  min={0}
                  value={editForm.tantrums}
                  onChange={(e) => setEditForm({ ...editForm, tantrums: +e.target.value })}
                  className="input-rtl"
                />
              </div>
            </div>

            {/* New Words */}
            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">
                كلمات جديدة (افصل بفاصلة عربية ،)
              </label>
              <input
                type="text"
                value={editForm.newWords}
                onChange={(e) => setEditForm({ ...editForm, newWords: e.target.value })}
                className="input-rtl"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-700 text-[#1F2937] block mb-1.5">ملاحظات</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                className="input-rtl resize-none"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#E8D8C4]">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-800 hover:bg-[#22685e] transition-colors"
              >
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setEditingLog(null)}
                className="px-5 py-2.5 border border-[#E8D8C4] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
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
