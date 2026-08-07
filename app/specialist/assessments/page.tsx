"use client";
// app/specialist/assessments/page.tsx
import { useState, useEffect } from "react";
import { ClipboardCheck, ChevronRight, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const tools = [
  {
    id: "mchat",
    name: "M-CHAT-R",
    fullName: "Modified Checklist for Autism in Toddlers",
    description: "أداة فحص التوحد المعدّلة للأطفال الصغار (16-30 شهراً)، تتضمن 20 سؤالاً للاستجابة بنعم/لا.",
    questions: 20,
    maxScore: 20,
    riskLevels: [
      { range: "0-2", label: "خطر منخفض", color: "#2E8B7E" },
      { range: "3-7", label: "خطر متوسط", color: "#F5B942" },
      { range: "8-20", label: "خطر مرتفع", color: "#EF4444" },
    ],
    items: [
      "هل يستمتع طفلك بالأرجحة وألعاب الحركة؟",
      "هل يهتم بالأطفال الآخرين؟",
      "هل يحب التسلق على الأشياء كالسلالم؟",
      "هل يستمتع بلعبة ظهور/اختفاء الوجه؟",
      "هل يتظاهر طفلك بالكلام على الهاتف؟",
      "هل يشير بإصبعه لطلب شيء يريده؟",
      "هل يشير بإصبعه ليريك شيئاً مثيراً للاهتمام؟",
      "هل يلعب بشكل صحيح بالألعاب الصغيرة؟",
      "هل يأتي لك بأشياء ليريك إياها؟",
      "هل ينظر إليك في العينين لأكثر من ثانية أو ثانيتين؟",
    ],
    color: "#1D5B79",
    bg: "#1D5B7915",
  },
  {
    id: "ados2",
    name: "ADOS-2",
    fullName: "Autism Diagnostic Observation Schedule, 2nd Edition",
    description: "جدول ملاحظة تشخيص التوحد — أداة مشاهدة نصف منظمة للتقييم الشامل، تستغرق 40-60 دقيقة.",
    questions: 28,
    maxScore: 28,
    riskLevels: [
      { range: "0-6",  label: "لا توحد",       color: "#2E8B7E" },
      { range: "7-14", label: "توحد محتمل",     color: "#F5B942" },
      { range: "15+",  label: "توحد مؤكد",      color: "#EF4444" },
    ],
    items: [
      "التواصل البصري وإيماءات التبادل",
      "توصيل المعلومات الاجتماعية",
      "الإيماء التعبيري",
      "التقليد غير العادي للصوت",
      "التواصل اللفظي التلقائي",
      "الاستجابة للاسم",
      "اللعب التخيلي",
      "طلب المساعدة أو المشاركة",
      "إظهار/إعطاء الأشياء",
      "استخدام جسد الآخر كأداة",
    ],
    color: "#6B4C93",
    bg: "#6B4C9315",
  },
  {
    id: "cars2",
    name: "CARS-2",
    fullName: "Childhood Autism Rating Scale, 2nd Edition",
    description: "مقياس تقييم التوحد في مرحلة الطفولة — 15 بنداً تُقيَّم من 1 إلى 4، المجموع من 15 إلى 60.",
    questions: 15,
    maxScore: 60,
    riskLevels: [
      { range: "15-29", label: "بدون توحد",   color: "#2E8B7E" },
      { range: "30-36", label: "توحد خفيف-متوسط", color: "#F5B942" },
      { range: "37-60", label: "توحد شديد",    color: "#EF4444" },
    ],
    items: [
      "العلاقات مع الناس",
      "التقليد",
      "الاستجابة العاطفية",
      "استخدام الجسم",
      "استخدام الأشياء",
      "التكيف مع التغيير",
      "الاستجابة البصرية",
      "الاستجابة السمعية",
      "استخدام حاسة الشم والذوق واللمس والاستجابة لها",
      "الخوف والقلق",
    ],
    color: "#E97F6B",
    bg: "#E97F6B15",
  },
  {
    id: "vbmapp",
    name: "VB-MAPP",
    fullName: "Verbal Behavior Milestones Assessment and Placement Program",
    description: "برنامج تقييم معالم السلوك اللفظي وإيجاد موقع التدخل — يقيّم 170 معلماً في 3 مستويات.",
    questions: 170,
    maxScore: 170,
    riskLevels: [
      { range: "0-50",   label: "المستوى 1", color: "#E97F6B" },
      { range: "51-110", label: "المستوى 2", color: "#F5B942" },
      { range: "111+",   label: "المستوى 3", color: "#2E8B7E" },
    ],
    items: [
      "المطالبة (Mand)",
      "التسمية (Tact)",
      "الاستجابة اللفظية (Intraverbal)",
      "السلوك الاستماعي (Listener Responding)",
      "التقليد الحركي",
      "التقليد اللفظي",
      "التفاعل الاجتماعي",
      "الإشارة التلقائية (Spontaneous Vocalization)",
      "اللعب وانتظار الدور",
      "مهارات الفصل الدراسي",
    ],
    color: "#2E8B7E",
    bg: "#2E8B7E15",
  },
];

type ToolId = (typeof tools)[number]["id"];

export default function AssessmentsPage() {
  const [openTool, setOpenTool] = useState<ToolId | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pastAssessments, setPastAssessments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/specialist/assessments")
      .then((r) => r.json())
      .then((res) => { if (res.ok) setPastAssessments(res.data); });
  }, []);

  const tool = tools.find((t) => t.id === openTool);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getResult = () => {
    if (!tool) return null;
    const levels = tool.riskLevels;
    for (const lvl of levels) {
      const [min, max] = lvl.range.replace("+", `-${tool.maxScore}`).split("-").map(Number);
      if (totalScore >= min && totalScore <= max) return lvl;
    }
    return levels[levels.length - 1];
  };

  const handleOpen = (id: ToolId) => {
    setOpenTool(id);
    setAnswers({});
    setSubmitted(false);
  };

  const handleClose = () => {
    setOpenTool(null);
    setSubmitted(false);
  };

  const result = getResult();

  return (
    <div>
      <PageHeader
        title="أدوات التقييم"
        subtitle="تقييمات معتمدة لتشخيص اضطراب طيف التوحد"
        icon={ClipboardCheck}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Past Assessments */}
      {pastAssessments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
            آخر التقييمات المُجراة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pastAssessments.map((a: any) => {
              const t = tools.find((t) => t.id === a.tool);
              return (
                <div key={a.id} className="bg-white rounded-xl border border-[#D6E8F0] p-4 shadow-sm flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t?.bg }}>
                    <ClipboardCheck className="w-5 h-5" style={{ color: t?.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-800 text-[#1F2937]">{a.toolName}</p>
                      <span className="text-xs text-[#9CA3AF]">{a.date}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{a.patientName}</p>
                    <p className="text-xs font-700 mt-1" style={{ color: t?.color }}>
                      النتيجة: {a.result} ({a.score}/{a.maxScore})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <h2 className="text-sm font-800 text-[#6B7280] uppercase tracking-wide mb-4">
        الأدوات المتاحة
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-[#D6E8F0] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.bg }}
                >
                  <ClipboardCheck className="w-6 h-6" style={{ color: t.color }} />
                </div>
                <div>
                  <h3 className="text-base font-900 text-[#1F2937]">{t.name}</h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{t.questions} بنداً — درجة قصوى: {t.maxScore}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{t.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {t.riskLevels.map((lvl) => (
                <span
                  key={lvl.label}
                  className="text-xs font-600 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${lvl.color}15`, color: lvl.color }}
                >
                  {lvl.range} — {lvl.label}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleOpen(t.id as ToolId)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 text-white transition-colors"
              style={{ backgroundColor: t.color }}
            >
              بدء التقييم
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Assessment Modal */}
      {openTool && tool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E8D8C4] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-base font-800 text-[#1F2937]">{tool.name}</h2>
                <p className="text-xs text-[#9CA3AF]">{tool.fullName}</p>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!submitted ? (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>هذا النموذج مبسّط للتوضيح. في الحالة الحقيقية يتضمن {tool.questions} بنداً.</p>
                  </div>
                  {tool.items.map((q, i) => (
                    <div key={i} className="bg-[#F5F9FB] rounded-xl p-4">
                      <p className="text-sm font-600 text-[#1F2937] mb-3">
                        {i + 1}. {q}
                      </p>
                      <div className="flex gap-2">
                        {tool.id === "cars2"
                          ? [1, 2, 3, 4].map((v) => (
                              <button
                                key={v}
                                onClick={() => setAnswers({ ...answers, [i]: v })}
                                className={`flex-1 py-2 rounded-lg text-sm font-700 transition-all border-2 ${
                                  answers[i] === v
                                    ? "border-current text-white"
                                    : "border-[#E8D8C4] text-[#9CA3AF]"
                                }`}
                                style={answers[i] === v ? { backgroundColor: tool.color, borderColor: tool.color } : {}}
                              >
                                {v}
                              </button>
                            ))
                          : [
                              { label: "نعم", val: 0 },
                              { label: "لا", val: 1 },
                            ].map(({ label, val }) => (
                              <button
                                key={label}
                                onClick={() => setAnswers({ ...answers, [i]: val })}
                                className={`flex-1 py-2 rounded-lg text-sm font-700 transition-all border-2 ${
                                  answers[i] === val
                                    ? "text-white"
                                    : "border-[#E8D8C4] text-[#9CA3AF]"
                                }`}
                                style={answers[i] === val ? { backgroundColor: tool.color, borderColor: tool.color } : {}}
                              >
                                {label}
                              </button>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-[#E8D8C4] flex gap-3 flex-shrink-0">
                  <button onClick={handleClose} className="px-4 py-2.5 border border-[#E8D8C4] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors">
                    إلغاء
                  </button>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="flex-1 py-2.5 text-white rounded-xl text-sm font-700 transition-colors"
                    style={{ backgroundColor: tool.color }}
                  >
                    احسب النتيجة ({Object.keys(answers).length}/{tool.items.length} أجبت)
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${result?.color}20` }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: result?.color }} />
                </div>
                <h3 className="text-xl font-900 text-[#1F2937] mb-2">نتيجة التقييم</h3>
                <p className="text-sm text-[#6B7280] mb-4">{tool.name} — {tool.fullName}</p>

                <div
                  className="rounded-2xl p-5 mb-6 text-center w-full"
                  style={{ backgroundColor: `${result?.color}10`, borderColor: `${result?.color}30` }}
                >
                  <div className="text-4xl font-900 mb-1" style={{ color: result?.color }}>
                    {totalScore}
                    <span className="text-xl font-700 text-[#9CA3AF]">/{tool.maxScore}</span>
                  </div>
                  <p className="text-lg font-800" style={{ color: result?.color }}>{result?.label}</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl text-sm text-yellow-700 text-right w-full mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>هذه النتيجة للعرض التوضيحي فقط. يجب إجراء التقييم الكامل وتفسيره من قِبل متخصص مؤهل.</p>
                </div>

                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-white rounded-xl text-sm font-700 transition-colors"
                  style={{ backgroundColor: tool.color }}
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
