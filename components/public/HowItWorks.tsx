import { UserPlus, ClipboardList, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "أنشئ حسابك",
    description:
      "سجّل كولي أمر أو أخصائي أو مدير مركز في دقيقتين، وأضف ملف الطفل بكل تفاصيله.",
    color: "#1D5B79",
    bg: "#1D5B7910",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "تابع يومياً",
    description:
      "سجّل السلوك، الحضور، المزاج، النوم وكل تفصيل يومي من خلال واجهة بسيطة وسريعة.",
    color: "#2E8B7E",
    bg: "#2E8B7E10",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "تواصل مباشرة",
    description:
      "راسل الأخصائي في أي وقت، استقبل التقارير فوراً على هاتفك دون الحاجة للتنقل.",
    color: "#E97F6B",
    bg: "#E97F6B10",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "شاهد التطور",
    description:
      "تابع تقدم طفلك عبر مخططات تفاعلية أسبوعية وشهرية تكشف تحسّن المهارات والسلوكيات.",
    color: "#6B4C93",
    bg: "#6B4C9310",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-rtl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge-primary inline-flex mb-4">
            <CheckCircle className="w-3.5 h-3.5" />
            خطوات بسيطة
          </div>
          <h2 className="text-3xl md:text-4xl font-800 text-[#1F2937] mb-4">
            كيف تعمل المنصة؟
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            أربع خطوات بسيطة تحوّل متابعة طفلك من فوضى الواتساب إلى نظام رقمي احترافي.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-l from-transparent via-[#E8D8C4] to-transparent" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Number bubble */}
                  <div className="relative mb-5">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ background: step.bg, border: `2px solid ${step.color}20` }}
                    >
                      <Icon className="w-9 h-9" style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-800 text-white shadow-md"
                      style={{ background: step.color }}
                    >
                      {step.number.slice(-1)}
                    </div>
                  </div>

                  <h3 className="text-lg font-700 text-[#1F2937] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
