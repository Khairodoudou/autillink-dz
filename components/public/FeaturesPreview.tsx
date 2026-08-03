import Link from "next/link";
import {
  BarChart3,
  Gamepad2,
  MessageCircle,
  Users,
  Stethoscope,
  Building2,
  ArrowLeft,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "متابعة السلوك اليومي",
    description: "سجّل يومياً المزاج، النوم، الحضور، السلوكيات والمهارات مع مخططات تطور أسبوعية.",
    color: "#1D5B79",
    bg: "from-[#1D5B79]/5 to-[#1D5B79]/10",
    border: "#1D5B7920",
  },
  {
    icon: Gamepad2,
    title: "ألعاب تربوية حسية",
    description: "ألعاب تعليمية تفاعلية مصمّمة خصيصاً للأطفال المصابين بطيف التوحد مع نظام نقاط وتحفيز.",
    color: "#E97F6B",
    bg: "from-[#E97F6B]/5 to-[#E97F6B]/10",
    border: "#E97F6B20",
  },
  {
    icon: MessageCircle,
    title: "التواصل بالصور",
    description: "جدول تواصل بصري بـ 24 صورة توضيحية تساعد الطفل على التعبير عن مشاعره واحتياجاته.",
    color: "#2E8B7E",
    bg: "from-[#2E8B7E]/5 to-[#2E8B7E]/10",
    border: "#2E8B7E20",
  },
  {
    icon: Users,
    title: "مجتمع الدعم",
    description: "تواصل مع أسر أخرى تمر بنفس التجربة، تبادل الخبرات والدعم العاطفي في فضاء آمن.",
    color: "#6B4C93",
    bg: "from-[#6B4C93]/5 to-[#6B4C93]/10",
    border: "#6B4C9320",
  },
  {
    icon: Stethoscope,
    title: "تواصل مع الأخصائي",
    description: "راسل الطبيب والأخصائي مباشرة، استقبل التقارير الطبية وحدد المواعيد رقمياً.",
    color: "#1D5B79",
    bg: "from-[#1D5B79]/5 to-[#1D5B79]/10",
    border: "#1D5B7920",
  },
  {
    icon: Building2,
    title: "قاعات المحاكاة",
    description: "بيئات تدريبية افتراضية تحضّر الطفل لمواقف الحياة اليومية كالطبيب، الحلاق، والمدرسة.",
    color: "#E97F6B",
    bg: "from-[#E97F6B]/5 to-[#E97F6B]/10",
    border: "#E97F6B20",
  },
];

export default function FeaturesPreview() {
  return (
    <section className="section-padding bg-[#FDF6EC]">
      <div className="container-rtl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-coral inline-flex mb-4">
            <Gamepad2 className="w-3.5 h-3.5" />
            المميزات الأساسية
          </div>
          <h2 className="text-3xl md:text-4xl font-800 text-[#1F2937] mb-4">
            كل ما يحتاجه طفلك{" "}
            <span className="text-gradient-coral">في مكان واحد</span>
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            ست وظائف متكاملة مصمّمة بعناية لتلبي احتياجات الطفل، الأسرة والأخصائي في آنٍ واحد.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`feature-card bg-gradient-to-br ${feature.bg}`}
                style={{ borderColor: feature.border }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-700 text-[#1F2937] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1D5B79] text-white font-600 hover:bg-[#163f56] transition-all duration-300 shadow-lg shadow-[#1D5B79]/25 hover:scale-105"
          >
            استكشف جميع المميزات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
