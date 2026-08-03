import type { Metadata } from "next";
import Link from "next/link";
import { Star, Quote, Heart, ArrowLeft, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "آراء الأسر — أوتيلينك دي زي",
  description:
    "اقرأ تجارب الأسر الجزائرية التي تستخدم منصة أوتيلينك دي زي لمتابعة أطفالها المصابين بطيف التوحد.",
};

const testimonials = [
  {
    name: "أم أحمد",
    role: "ولية أمر — الجزائر العاصمة",
    initials: "أأ",
    color: "#1D5B79",
    stars: 5,
    text: "قبل المنصة كنت أتواصل مع الأخصائية عبر واتساب وكثيراً ما تضيع الرسائل. اليوم أجد تقرير ابني منظماً وواضحاً ويصلني مباشرة على التطبيق. تغيّر كل شيء.",
  },
  {
    name: "الأستاذة فاطمة",
    role: "أخصائية نفسية — وهران",
    initials: "ف",
    color: "#2E8B7E",
    stars: 5,
    text: "المنصة وفّرت علي ساعات من الكتابة اليدوية. أكتب التقرير مرة واحدة وتصله الأسرة والإدارة في آنٍ واحد. الاستمارات السريرية المدمجة هي ميزة لم أجدها في أي منصة أخرى.",
  },
  {
    name: "أبو ياسمين",
    role: "ولي أمر — بسكرة",
    initials: "أي",
    color: "#E97F6B",
    stars: 5,
    text: "كنا بعيدين عن المركز ونعتمد على الهاتف فقط. الآن أتابع كل تفصيل في يوم ابنتي وأرسل ملاحظاتي للأخصائية بسهولة. الخدمة تستحق كل دينار.",
  },
  {
    name: "مدير مركز النور",
    role: "إدارة مركز — قسنطينة",
    initials: "م",
    color: "#6B4C93",
    stars: 5,
    text: "من أصعب التحديات في المركز كان تنظيم التواصل بين 12 أخصائياً و80 أسرة. منذ اعتمادنا على أوتيلينك، انخفضت الشكاوى بشكل ملحوظ وأصبح الجميع على نفس الموجة.",
  },
  {
    name: "أم خالد",
    role: "ولية أمر — سطيف",
    initials: "أخ",
    color: "#1D5B79",
    stars: 5,
    text: "ابني يحب ألعاب التطبيق كثيراً، يلعبها وحده ويطلب مني أن أفتحها له كل يوم. لأول مرة أجد تطبيقاً يجذبه حقاً ويساعده في نفس الوقت.",
  },
  {
    name: "الدكتور محمد",
    role: "طبيب أطفال — تلمسان",
    initials: "دم",
    color: "#2E8B7E",
    stars: 5,
    text: "قيّمت عشرات الأطفال باستخدام نماذج التقييم المدمجة في المنصة. النتيجة تأتي فورية والحسابات دقيقة. إنها أداة احترافية حقيقية.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-[#F5B942] fill-[#F5B942]" />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="bg-[#FDF6EC]">
      {/* Hero */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <div className="container-rtl relative z-10 text-center">
          <div className="badge-primary inline-flex mb-6">
            <Heart className="w-3.5 h-3.5" />
            تجارب حقيقية
          </div>
          <h1 className="text-4xl md:text-5xl font-800 text-[#1F2937] mb-6">
            ماذا يقول{" "}
            <span className="text-gradient-primary">من جرّبوا المنصة؟</span>
          </h1>
          <p className="text-[#6B7280] text-xl max-w-xl mx-auto">
            آراء حقيقية من أسر وأخصائيين ومدراء مراكز يستخدمون أوتيلينك دي زي يومياً.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-10 bg-[#1D5B79]">
        <div className="container-rtl">
          <div className="flex flex-wrap justify-center gap-10 text-center">
            {[
              { n: "98%", l: "رضا الأسر" },
              { n: "4.9/5", l: "متوسط التقييم" },
              { n: "+1200", l: "مستخدم نشط" },
              { n: "+85", l: "مركز شريك" },
            ].map(({ n, l }, i) => (
              <div key={i}>
                <div className="text-3xl font-800 text-white">{n}</div>
                <div className="text-white/65 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding">
        <div className="container-rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card flex flex-col">
                {/* Quote icon */}
                <Quote
                  className="w-8 h-8 mb-4 opacity-20"
                  style={{ color: t.color }}
                />

                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Text */}
                <p className="text-[#374151] text-sm leading-relaxed my-5 flex-1">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E8D8C4]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-700 flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-700 text-[#1F2937] text-sm">
                      {t.name}
                    </div>
                    <div className="text-[#6B7280] text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-rtl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#1D5B79]" />
            <span className="text-[#1D5B79] font-600">
              انضم إليهم اليوم
            </span>
          </div>
          <h2 className="text-3xl font-800 text-[#1F2937] mb-4">
            كن الشخص القادم الذي يشاركنا تجربته
          </h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
            انضم اليوم واكتشف بنفسك الفرق الذي يصنعه التنظيم الرقمي.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1D5B79] text-white font-700 hover:bg-[#163f56] transition-all shadow-lg hover:scale-105"
          >
            إنشاء حساب الآن
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
