"use client";
// app/specialist/reports/new/page.tsx
import { useState } from "react";
import { FileText, Send, CheckCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { mockPatients } from "@/lib/mock-data";

const generalStatusOptions = ["ممتاز", "جيد", "متوسط", "يحتاج مراجعة", "مقلق"];
const reportTypes = ["تقرير شهري", "تقرير تقييم", "تقرير متابعة"];

export default function NewReportPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    patientId: mockPatients[0].id,
    type: reportTypes[0],
    generalStatus: "جيد",
    communicationObservation: "",
    socialObservation: "",
    behaviorObservation: "",
    progressSummary: "",
    challenges: "",
    recommendations: "",
    nextGoals: "",
  });

  const set = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const patient = mockPatients.find((p) => p.id === form.patientId) ?? mockPatients[0];

  if (sent) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-24 h-24 rounded-full bg-[#2E8B7E]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-[#2E8B7E]" />
        </div>
        <h1 className="text-2xl font-900 text-[#1F2937] mb-3">تم إرسال التقرير!</h1>
        <p className="text-[#6B7280] mb-2">
          تقرير <span className="font-800 text-[#1F2937]">{patient.name}</span> أُرسل لولي الأمر بنجاح
        </p>
        <p className="text-sm text-[#9CA3AF] mb-8">
          سيتلقى ولي الأمر إشعاراً فورياً بوصول التقرير
        </p>
        <button
          onClick={() => setSent(false)}
          className="px-6 py-3 bg-[#1D5B79] text-white rounded-xl text-sm font-700 hover:bg-[#174A62] transition-colors"
        >
          كتابة تقرير آخر
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="كتابة تقرير جديد"
        subtitle="تقرير موجّه لولي الأمر حول تقدم الطفل"
        icon={FileText}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient + Type */}
          <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide">معلومات التقرير</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">المريض</label>
                <select
                  value={form.patientId}
                  onChange={(e) => set("patientId", e.target.value)}
                  className="input-rtl"
                >
                  {mockPatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">نوع التقرير</label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className="input-rtl"
                >
                  {reportTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-2">الحالة العامة</label>
              <div className="flex flex-wrap gap-2">
                {generalStatusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("generalStatus", s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-600 border-2 transition-all ${
                      form.generalStatus === s
                        ? "bg-[#1D5B79] text-white border-[#1D5B79]"
                        : "border-[#D6E8F0] text-[#6B7280] hover:border-[#1D5B79]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide">الملاحظات الميدانية</h3>
            {[
              { field: "communicationObservation", label: "التواصل اللغوي" },
              { field: "socialObservation", label: "التفاعل الاجتماعي" },
              { field: "behaviorObservation", label: "السلوك والانفعالات" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">{label}</label>
                <textarea
                  value={form[field as keyof typeof form]}
                  onChange={(e) => set(field, e.target.value)}
                  rows={3}
                  placeholder={`ملاحظاتك حول ${label}...`}
                  className="input-rtl resize-none"
                />
              </div>
            ))}
          </div>

          {/* Progress + Recommendations */}
          <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide">التحليل والتوصيات</h3>
            {[
              { field: "progressSummary", label: "ملخص التقدم المحرز" },
              { field: "challenges", label: "التحديات والصعوبات" },
              { field: "recommendations", label: "التوصيات لولي الأمر" },
              { field: "nextGoals", label: "أهداف الفترة القادمة" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">{label}</label>
                <textarea
                  value={form[field as keyof typeof form]}
                  onChange={(e) => set(field, e.target.value)}
                  rows={3}
                  placeholder={`${label}...`}
                  className="input-rtl resize-none"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1D5B79] text-white rounded-2xl text-sm font-800 hover:bg-[#174A62] transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
            إرسال التقرير لولي الأمر
          </button>
        </form>
      </div>
    </div>
  );
}
