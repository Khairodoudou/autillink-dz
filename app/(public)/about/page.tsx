import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Target,
  Lightbulb,
  Users,
  ArrowLeft,
  CheckCircle,
  Star,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن — أوتيلينك دي زي",
  description:
    "قصة منصة أوتيلينك دي زي الجزائرية، مهمتنا وقيمنا في خدمة أطفال التوحد وأسرهم.",
};

const values = [
  {
    icon: Heart,
    title: "الرحمة والتعاطف",
    description:
      "كل قرار تصميمي نتخذه يضع في الاعتبار الضغط النفسي الذي تعيشه الأسرة وحاجتها للتقدير والدعم.",
    color: "#E97F6B",
    bg: "#E97F6B10",
  },
  {
    icon: Target,
    title: "الدقة والموثوقية",
    description:
      "نضمن أن كل تقرير، كل ملاحظة وكل بيان يصل في الوقت المناسب وبدقة تامة إلى من يحتاجه.",
    color: "#1D5B79",
    bg: "#1D5B7910",
  },
  {
    icon: Lightbulb,
    title: "الابتكار المحلي",
    description:
      "حلول رقمية مصمّمة خصيصاً للسياق الجزائري — لغة، ثقافة وبنية تحتية — لا نسخ عشوائية من الخارج.",
    color: "#2E8B7E",
    bg: "#2E8B7E10",
  },
  {
    icon: Users,
    title: "الشمولية",
    description:
      "نصمم لأطياف الاحتياج المختلفة: الأسر الريفية، الحضرية، المراكز الكبيرة والمتخصصين المستقلين.",
    color: "#6B4C93",
    bg: "#6B4C9310",
  },
];

const milestones = [
  {
    year: "2024",
    title: "فكرة المشروع",
    description: "انطلقت الفكرة من معاناة حقيقية لأسرة جزائرية واجهت غياب التواصل المنظّم مع مركز متابعة طفلها.",
  },
  {
    year: "2024",
    title: "البحث والتصميم",
    description: "أجرينا مقابلات مع أكثر من 30 أسرة و15 أخصائياً في 8 ولايات جزائرية لفهم الاحتياج الحقيقي.",
  },
  {
    year: "2025",
    title: "إطلاق المنصة",
    description: "أطلقنا النسخة الأولى في مراكز رائدة بالجزائر العاصمة وبسكرة، وجمعنا تغذية راجعة قيّمة.",
  },
  {
    year: "2025",
    title: "الإطلاق الرسمي",
    description: "الإطلاق الرسمي لمنصة أوتيلينك دي زي مع تغطية 58 ولاية وأكثر من 85 مركز شريك.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FDF6EC]">
      {/* Hero */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#1D5B79]/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="container-rtl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text + Stats */}
            <div>
              <div className="badge-primary inline-flex mb-6">
                <Heart className="w-3.5 h-3.5" />
                قصتنا
              </div>
              <h1 className="text-4xl md:text-5xl font-800 text-[#1F2937] mb-6 leading-tight">
                من نحن وما الذي
                <span className="block text-gradient-primary">يحرّكنا؟</span>
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-4">
                أوتيلينك دي زي مشروع جزائري نابع من واقع أسر حقيقية، يعاني أبناؤها من طيف التوحد في غياب شبه تام للرقمنة في مراكز الرعاية.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
                أردنا أن نبني الجسر المفقود بين الأسرة، الأخصائي والإدارة — جسراً رقمياً، عربياً، جزائرياً.
              </p>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { n: "+58", l: "ولاية", c: "#1D5B79" },
                  { n: "+320", l: "أخصائي", c: "#2E8B7E" },
                  { n: "+85", l: "مركز", c: "#E97F6B" },
                  { n: "+1200", l: "أسرة", c: "#6B4C93" },
                ].map(({ n, l, c }, i) => (
                  <div
                    key={i}
                    className="stat-card text-center"
                    style={{ borderTop: `4px solid ${c}` }}
                  >
                    <div className="text-2xl font-900 mb-1" style={{ color: c }}>
                      {n}
                    </div>
                    <div className="text-[#6B7280] text-xs font-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-hero-family.png"
                alt="أسرة جزائرية مع أخصائي في مركز رعاية"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D5B79]/25 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>


      {/* Mission */}
      <section className="section-padding">
        <div className="container-rtl max-w-3xl mx-auto text-center">
          <div className="badge-coral inline-flex mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            مهمتنا
          </div>
          <h2 className="text-3xl md:text-4xl font-800 text-[#1F2937] mb-6">
            رقمنة متابعة التوحد
            <span className="block text-gradient-coral">في الجزائر</span>
          </h2>
          <p className="text-[#6B7280] text-xl leading-relaxed mb-10">
            نسعى إلى جعل متابعة كل طفل مصاب بطيف التوحد في الجزائر أمراً بسيطاً، منظّماً وفعّالاً — بإنهاء الاعتماد على واتساب والأوراق واستبداله بنظام رقمي احترافي يربط كل الأطراف.
          </p>
          <div className="relative rounded-3xl overflow-hidden shadow-xl max-w-2xl mx-auto">
            <Image
              src="/images/about-algeria-map.png"
              alt="خريطة الجزائر — شبكة أوتيلينك عبر الولايات"
              width={700}
              height={450}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D5B79]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-rtl">
          <div className="text-center mb-14">
            <div className="badge-primary inline-flex mb-4">
              <Star className="w-3.5 h-3.5" />
              قيمنا
            </div>
            <h2 className="text-3xl font-800 text-[#1F2937]">
              ما الذي يوجّه عملنا؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="feature-card">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: v.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-xl font-700 text-[#1F2937] mb-3">
                    {v.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-rtl max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-primary inline-flex mb-4">
              <CheckCircle className="w-3.5 h-3.5" />
              مسيرتنا
            </div>
            <h2 className="text-3xl font-800 text-[#1F2937]">
              كيف وصلنا إلى هنا؟
            </h2>
          </div>
          <div className="relative">
            {/* Line */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-[#E8D8C4]" />
            <div className="flex flex-col gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex items-start gap-8 pr-16">
                  {/* Dot */}
                  <div className="absolute right-4 top-2 w-4 h-4 rounded-full bg-[#1D5B79] border-4 border-[#FDF6EC] shadow-md" />
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-[#E8D8C4]">
                    <div className="badge-primary inline-flex text-xs mb-3">
                      {m.year}
                    </div>
                    <h3 className="font-700 text-[#1F2937] mb-2">{m.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-rtl text-center">
          <h2 className="text-3xl font-800 text-[#1F2937] mb-4">
            انضم إلى هذه المسيرة
          </h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
            كن جزءاً من مجتمع أوتيلينك وساعد في تحسين حياة أطفال التوحد في الجزائر.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1D5B79] text-white font-700 hover:bg-[#163f56] transition-all shadow-lg hover:scale-105"
          >
            سجّل الآن
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
