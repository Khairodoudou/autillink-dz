"use client";
// app/parent/complaints/page.tsx
import { useState, useEffect } from "react";
import { AlertCircle, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const statusConfig: Record<string, { color: string; bg: string }> = {
  نشط:   { color: "#EF4444", bg: "#EF444415" },
  معالج: { color: "#2E8B7E", bg: "#2E8B7E15" },
  مغلق:  { color: "#9CA3AF", bg: "#9CA3AF15" },
};

const priorityColors: Record<string, string> = {
  عالية:   "#EF4444",
  عاجلة:   "#EF4444",
  متوسطة: "#F5B942",
  منخفضة: "#2E8B7E",
};

export default function ParentComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("متوسطة");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadComplaints = () => {
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setComplaints(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, priority, message }),
      });
      if (res.ok) {
        setSubject("");
        setMessage("");
        setPriority("متوسطة");
        setSuccessMsg(true);
        loadComplaints();
        setTimeout(() => setSuccessMsg(false), 4000);
      }
    } catch (err) {
      console.error("Failed to submit complaint", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="تقديم شكوى أو تظلم"
        subtitle="نحن هنا لمساعدتك والاستماع إلى انشغالاتك بكل اهتمام"
        icon={AlertCircle}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8D8C4] p-6 shadow-sm">
          <h2 className="text-base font-800 text-[#1F2937] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#2E8B7E]" />
            نموذج الشكوى الجديدة
          </h2>

          {successMsg && (
            <div className="mb-4 p-4 bg-[#2E8B7E]/10 border border-[#2E8B7E]/30 rounded-xl text-[#2E8B7E] text-sm font-700 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              تم إرسال شكواك بنجاح إلى إدارة المنصة وسوف يتم التعامل معها في أقرب وقت.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-700 text-[#4B5563] mb-1">موضوع الشكوى</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: استفسار حول جلسة تتبع، مشكلة تقنية..."
                className="w-full bg-[#F5E8D4] border border-[#E8D8C4] rounded-xl px-4 py-2.5 text-sm text-right outline-none focus:border-[#2E8B7E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-[#4B5563] mb-1">درجة الأولوية</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#F5E8D4] border border-[#E8D8C4] rounded-xl px-4 py-2.5 text-sm text-right outline-none focus:border-[#2E8B7E] transition-colors"
              >
                <option value="منخفضة">منخفضة</option>
                <option value="متوسطة">متوسطة</option>
                <option value="عاجلة">عاجلة / عالية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-700 text-[#4B5563] mb-1">تفاصيل الشكوى والطلب</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اشرح المشكلة أو الانشغال بالتفصيل..."
                className="w-full bg-[#F5E8D4] border border-[#E8D8C4] rounded-xl p-4 text-sm text-right outline-none focus:border-[#2E8B7E] resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#2E8B7E] text-white font-700 rounded-xl hover:bg-[#22685e] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>{submitting ? "جاري الإرسال..." : "تقديم الشكوى الآن"}</span>
            </button>
          </form>
        </div>

        {/* Previous Complaints Sidebar */}
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-6 shadow-sm space-y-4">
          <h3 className="text-base font-800 text-[#1F2937] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2E8B7E]" />
            سجل شكاواك المرفوعة
          </h3>

          {loading ? (
            <p className="text-xs text-[#9CA3AF]">جاري التحميل...</p>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-[#9CA3AF] text-sm">
              لم تقم بتقديم أي شكوى سابقاً.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {complaints.map((c) => {
                const sts = statusConfig[c.status] ?? statusConfig["نشط"];
                const prioColor = priorityColors[c.priority] ?? "#F5B942";

                return (
                  <div key={c.id} className="p-3 bg-[#F5E8D4]/50 border border-[#E8D8C4] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-700 text-[#1F2937] truncate max-w-[180px]">{c.subject}</span>
                      <span
                        className="text-[10px] font-700 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: sts.bg, color: sts.color }}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{c.description}</p>

                    {c.resolution && (
                      <div className="p-2 bg-[#2E8B7E]/10 rounded-lg text-[11px] text-[#2E8B7E] font-600">
                        الرد: {c.resolution}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-[#9CA3AF]">
                      <span style={{ color: prioColor }}>أولوية {c.priority}</span>
                      <span>{c.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
