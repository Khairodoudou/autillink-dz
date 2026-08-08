import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Gamepad2,
  MessageCircle,
  Users,
  Stethoscope,
  Building2,
  CheckCircle,
  ArrowLeft,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "المميزات — أوتيلينك دي زي",
  description:
    "اكتشف الوظائف الست الأساسية لمنصة أوتيلينك دي زي: متابعة السلوك، الألعاب التعليمية، التواصل بالصور، مجتمع الدعم، التشاور مع الأخصائي، وقاعات المحاكاة.",
};

const features = [
  {
    icon: BarChart3,
    title: "متابعة السلوك اليومي",
    description:
      "نظام شامل لتسجيل ومتابعة السلوكيات اليومية للطفل بما فيها المزاج، الحضور، النوم، نوبات الغضب والمهارات المكتسبة. يُنشئ تقارير أسبوعية وشهرية بمخططات بيانية تفاعلية تكشف تطور الطفل بمرور الوقت.",
    color: "#1D5B79",
    points: [
      "تسجيل يومي سريع للمؤشرات السلوكية",
      "مخططات Chart.js تفاعلية",
      "مقارنة أسبوعية وشهرية",
      "تنبيهات عند تغيير مفاجئ في السلوك",
    ],
    badge: "للأسرة والأخصائي",
  },
  {
    icon: Gamepad2,
    title: "ألعاب تربوية حسية",
    description:
      "منظومة ألعاب تعليمية تفاعلية صُممت بعناية وفق احتياجات الأطفال المصابين بطيف التوحد، تعمل على تطوير الحواس، الإدراك والمهارات الاجتماعية من خلال لعب ممتع ومحفّز.",
    color: "#E97F6B",
    points: [
      "ربط الألوان والأشكال والصور",
      "التعرف على المشاعر والتعبير عنها",
      "أصوات الحيوانات وتمييز الأصوات",
      "نظام نقاط ومكافآت بالنجوم الذهبية",
    ],
    badge: "لمساحة الطفل",
  },
  {
    icon: MessageCircle,
    title: "التواصل بالصور (بيكتوغرام)",
    description:
      "جدول تواصل بصري يحتوي على 24 صورة توضيحية مصنّفة في أربع فئات تساعد الطفل على التعبير عن مشاعره واحتياجاته بدون كلام، مع خيار تشغيل الصوت باللهجة الجزائرية.",
    color: "#2E8B7E",
    points: [
      "24 صورة في فئات: المشاعر، الاحتياجات، الطعام، الألعاب",
      "تشغيل صوتي باللهجة الجزائرية",
      "واجهة كبيرة وبسيطة مصمّمة للأطفال",
      "إمكانية تخصيص الصور حسب الطفل",
    ],
    badge: "لمساحة الطفل",
  },
  {
    icon: Users,
    title: "مجتمع الدعم الأسري",
    description:
      "فضاء آمن ومُشرف حيث تتواصل الأسر الجزائرية التي تمر بنفس التجربة، يتبادلون الخبرات، يدعمون بعضهم ويشاركون النصائح العملية في رحلة التوحد.",
    color: "#6B4C93",
    points: [
      "منتديات نقاش مُصنّفة حسب الموضوع",
      "إشراف دوري من متخصصين",
      "تبادل قصص النجاح والتطور",
      "فضاء آمن ومحمي تماماً",
    ],
    badge: "للأسرة",
  },
  {
    icon: Stethoscope,
    title: "التواصل مع الأخصائي",
    description:
      "قناة تواصل مباشرة ومشفّرة بين الأسرة والأخصائي المعالج، مع إمكانية إرسال التقارير الطبية، تحديد المواعيد وإجراء استشارات عن بُعد دون الحاجة للتنقل.",
    color: "#1D5B79",
    points: [
      "مراسلة مباشرة وآمنة مع الأخصائي",
      "تلقي التقارير فور كتابتها",
      "تحديد وإدارة المواعيد رقمياً",
      "التاريخ الكامل للمحادثات",
    ],
    badge: "للأسرة والأخصائي",
  },
  {
    icon: Building2,
    title: "قاعات المحاكاة",
    description:
      "بيئات تدريبية افتراضية تحضّر الطفل لمواقف الحياة اليومية التي قد تسبب القلق، كزيارة الطبيب، الحلاق، المحل التجاري والصف الدراسي — بخطوات تدريجية وآمنة.",
    color: "#E97F6B",
    points: [
      "مشاهد تفاعلية للطبيب، الحلاق، المتجر، الصف",
      "تدرّج في الصعوبة من 3 إلى 5 خطوات",
      "تعزيز إيجابي بعد كل خطوة",
      "تتبع التقدم في كل سيناريو",
    ],
    badge: "لمساحة الطفل",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#FDF6EC]">
      {/* Hero */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="container-rtl relative z-10 text-center">
          <div className="badge-primary inline-flex mb-6">
            <Star className="w-3.5 h-3.5" />
            6 وظائف متكاملة
          </div>
          <h1 className="text-4xl md:text-5xl font-800 text-[#1F2937] mb-6">
            كل ما يحتاجه طفلك{" "}
            <span className="text-gradient-primary">ومن يرعاه</span>
          </h1>
          <p className="text-[#6B7280] text-xl max-w-2xl mx-auto mb-10">
            منصة أوتيلينك صُمّمت بعناية لتُغطي كل جانب من جوانب رعاية طفل التوحد — من اللعب والتعلّم، إلى التقارير الطبية والتواصل المباشر.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1D5B79] text-white font-600 hover:bg-[#163f56] transition-all duration-300 shadow-lg hover:scale-105"
          >
            انضم للمنصة
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features Detail */}
      <section className="section-padding">
        <div className="container-rtl">
          <div className="flex flex-col gap-20">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Text */}
                  <div className={isEven ? "" : "lg:order-2"}>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-600 mb-4"
                      style={{
                        background: `${feature.color}10`,
                        color: feature.color,
                        border: `1px solid ${feature.color}25`,
                      }}
                    >
                      {feature.badge}
                    </div>
                    <h2 className="text-3xl font-800 text-[#1F2937] mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-[#6B7280] text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <ul className="flex flex-col gap-3">
                      {feature.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: feature.color }}
                          />
                          <span className="text-[#374151] text-sm font-500">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? "" : "lg:order-1"}>
                    <div
                      className="rounded-3xl p-10 flex items-center justify-center min-h-[280px] relative overflow-hidden"
                      style={{ background: `${feature.color}08` }}
                    >
                      {/* Background decorations */}
                      <div
                        className="absolute top-6 right-6 w-24 h-24 rounded-full opacity-20"
                        style={{ background: feature.color }}
                      />
                      <div
                        className="absolute bottom-6 left-6 w-16 h-16 rounded-full opacity-15"
                        style={{ background: feature.color }}
                      />
                      {/* Icon */}
                      <div
                        className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl relative z-10"
                        style={{ background: `${feature.color}20` }}
                      >
                        <Icon
                          className="w-16 h-16"
                          style={{ color: feature.color }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-white">
        <div className="container-rtl text-center">
          <h2 className="text-3xl font-800 text-[#1F2937] mb-4">
            هل أنت مستعد للبداية؟
          </h2>
          <p className="text-[#6B7280] text-lg mb-8 max-w-lg mx-auto">
            انضم إلى مئات الأسر التي وثقت بمنصة أوتيلينك دي زي لمتابعة أطفالها.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#1D5B79] text-white font-700 hover:bg-[#163f56] transition-all shadow-lg hover:scale-105"
            >
              إنشاء حساب
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#1D5B79] text-[#1D5B79] font-600 hover:bg-[#1D5B79]/8 transition-all"
            >
              الأسئلة الشائعة
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
