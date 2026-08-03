import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Star,
  Shield,
  Zap,
  Check,
} from "lucide-react";

export const metadata: Metadata = {
  title: "الأسعار — أوتيلينك دي زي",
  description:
    "اختر الاشتراك المناسب لك: خطة المراكز B2B بـ 15,000 دج/شهر أو خطة الأسر المستقلة B2C بـ 800 دج/شهر.",
};

const b2bFeatures = [
  "وصول غير محدود لجميع الأطفال المسجّلين",
  "لوحة تحكم كاملة للإدارة والتقارير",
  "تقارير شاملة وإحصائيات متقدمة",
  "دعم تقني وتدريب مجاني للأطقم",
  "تكوين وإعداد الحساب للمركز",
  "جميع وظائف المنصة مفتوحة بالكامل",
  "عدد غير محدود من الأخصائيين",
  "تكامل مباشر مع نظام إدارة المركز",
];

const b2cFeatures = [
  "متابعة طفل واحد (قابل لإضافة المزيد)",
  "تواصل مباشر مع الأخصائي المعالج",
  "الوصول الكامل لمساحة ألعاب الطفل",
  "تسجيل يومي روتيني للسلوك والمزاج",
  "استقبال تقارير التقدم دورياً",
  "عضوية مجتمع الدعم والتبادل الأسري",
  "جدول التواصل التفاعلي بالصور (بيكتوغرام)",
  "دعم تقني وإرشادي أساسي",
];

const faqItems = [
  {
    q: "كيف يمكنني البدء بالمنصة؟",
    a: "يمكنك اختيار الخطة المناسبة وإنشاء حسابك مباشرة للبدء في استخدام المنصة بسهولة.",
  },
  {
    q: "كيف يتم دفع الاشتراكات؟",
    a: "يتوفر الدفع عبر التحويل البنكي أو البريدي (CCP / BaridiMob). كما نوفر خصماً بنسبة 20% عند الاشتراك السنوي.",
  },
  {
    q: "هل يمكنني إلغاء الاشتراك في أي وقت؟",
    a: "بالتأكيد، يمكنك التوقف أو إلغاء التجديد في أي لحظة مباشرة من إعدادات الحساب دون أي رسوم إلغاء.",
  },
  {
    q: "ماذا لو كان لديّ أكثر من طفل؟",
    a: "في خطة الأسرة يمكنك إضافة طفل إضافي بسعر 400 دج/شهر فقط. أما خطة المراكز فتتيح عدداً غير محدود من الأطفال.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#FDF6EC] min-h-screen">
      {/* Hero Header */}
      <section className="py-20 md:py-24 bg-white border-b border-[#E8D8C4]/60 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
        <div className="container-rtl relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D5B79]/10 border border-[#1D5B79]/20 text-[#1D5B79] text-xs font-700 mb-6">
            <CreditCard className="w-3.5 h-3.5" />
            أسعار واضحة وشفافة 100%
          </div>
          <h1 className="text-3xl md:text-5xl font-900 text-[#1F2937] mb-5 leading-tight">
            اختر الخطة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#1D5B79] to-[#2E8B7E]">
              المناسبة لاحتياجاتك
            </span>
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
            سواء كنت مركز رعاية متخصص يبحث عن حل شامل، أو ولي أمر يريد متابعة دقيقة لطفله، نوفر لك خططاً عادلة بدون تكاليف خفية.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-16 md:py-24">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch pt-4">
            
            {/* Card 1: B2C Family Plan */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-[#E8D8C4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#2E8B7E]/10 text-[#2E8B7E] flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-700 bg-[#2E8B7E]/10 text-[#2E8B7E] border border-[#2E8B7E]/20">
                    للأسر والآباء
                  </span>
                </div>

                {/* Plan Info */}
                <h2 className="text-2xl font-800 text-[#1F2937] mb-2">
                  خطة الأسرة
                </h2>
                <p className="text-[#6B7280] text-sm mb-6">
                  مخصصة للأولياء الراغبين في متابعة مستقلة ومنظمة
                </p>

                {/* Price Display RTL Optimized */}
                <div className="bg-[#FDF6EC]/70 rounded-2xl p-5 mb-8 border border-[#E8D8C4]/60 text-center">
                  <div className="flex items-baseline justify-center gap-1.5 dir-rtl">
                    <span className="text-4xl md:text-5xl font-900 text-[#2E8B7E]">
                      800
                    </span>
                    <span className="text-lg font-700 text-[#1F2937]">د.ج</span>
                    <span className="text-xs font-600 text-[#6B7280]">/ شهرياً</span>
                  </div>
                  <p className="text-xs text-[#6B7280] font-500 mt-1">
                    يشمل متابعة طفل واحد (400 دج لكل طفل إضافي)
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href="/register?role=parent"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-[#2E8B7E] text-[#2E8B7E] font-700 hover:bg-[#2E8B7E] hover:text-white transition-all duration-300 shadow-sm mb-8"
                >
                  <span>سجّل الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {/* Features List */}
                <div className="border-t border-[#E8D8C4]/60 pt-6">
                  <span className="block text-xs font-700 text-[#9CA3AF] uppercase tracking-wider mb-4">
                    كل ما تحتاجه الأسرة:
                  </span>
                  <ul className="space-y-3.5">
                    {b2cFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                        <div className="w-5 h-5 rounded-full bg-[#2E8B7E]/15 text-[#2E8B7E] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="font-500 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2: B2B Center Plan (Featured) */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-[#1D5B79] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative mt-4 lg:mt-0">
              
              {/* Popular Badge Floating Cleanly at Top */}
              <div className="absolute -top-4 right-8 z-10">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1D5B79] to-[#2E8B7E] text-white text-xs font-800 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-[#F5B942] text-[#F5B942]" />
                  <span>الخطة الأكثر اختياراً للمراكز</span>
                </div>
              </div>

              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#1D5B79]/10 text-[#1D5B79] flex items-center justify-center">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-700 bg-[#1D5B79]/10 text-[#1D5B79] border border-[#1D5B79]/20">
                    للمراكز والجمعيات
                  </span>
                </div>

                {/* Plan Info */}
                <h2 className="text-2xl font-800 text-[#1F2937] mb-2">
                  خطة المراكز المؤسسية
                </h2>
                <p className="text-[#6B7280] text-sm mb-6">
                  نظام متكامل لإدارة المراكز، الأخصائيين وأولياء الأمور
                </p>

                {/* Price Display RTL Optimized */}
                <div className="bg-[#1D5B79]/5 rounded-2xl p-5 mb-8 border border-[#1D5B79]/15 text-center">
                  <div className="flex items-baseline justify-center gap-1.5 dir-rtl">
                    <span className="text-4xl md:text-5xl font-900 text-[#1D5B79]">
                      15,000
                    </span>
                    <span className="text-lg font-700 text-[#1F2937]">د.ج</span>
                    <span className="text-xs font-600 text-[#6B7280]">/ شهرياً</span>
                  </div>
                  <p className="text-xs text-[#6B7280] font-500 mt-1">
                    وصول غير محدود لجميع الأطفال والأخصائيين
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href="/register?role=admin"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-[#1D5B79] to-[#2478a0] text-white font-700 hover:from-[#163f56] hover:to-[#1D5B79] transition-all duration-300 shadow-lg shadow-[#1D5B79]/25 mb-8"
                >
                  <span>اشترك الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {/* Features List */}
                <div className="border-t border-[#E8D8C4]/60 pt-6">
                  <span className="block text-xs font-700 text-[#9CA3AF] uppercase tracking-wider mb-4">
                    تتضمن كل ميزات المنصة:
                  </span>
                  <ul className="space-y-3.5">
                    {b2bFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                        <div className="w-5 h-5 rounded-full bg-[#1D5B79]/15 text-[#1D5B79] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="font-500 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Guarantees / Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 bg-white rounded-2xl p-6 border border-[#E8D8C4] shadow-sm text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#1D5B79]/10 text-[#1D5B79] flex items-center justify-center mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-700 text-[#1F2937]">بيانات مشفرة وآمنة</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">حماية كاملة وفق القانون 18-07</p>
            </div>
            <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-[#E8D8C4] py-4 md:py-0">
              <div className="w-10 h-10 rounded-xl bg-[#2E8B7E]/10 text-[#2E8B7E] flex items-center justify-center mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-700 text-[#1F2937]">تفعيل فوري</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">ابدأ الاستخدام خلال أقل من 5 دقائق</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#F5B942]/20 text-[#d9a02b] flex items-center justify-center mb-2">
                <Star className="w-5 h-5 fill-[#F5B942]" />
              </div>
              <h3 className="text-sm font-700 text-[#1F2937]">بدون التزام</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">اشتراك مباشر مع سهولة الإلغاء في أي وقت</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white border-t border-[#E8D8C4]/60">
        <div className="container-rtl max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-700 text-[#1D5B79] uppercase tracking-wider block mb-2">
              الأسئلة الشائعة
            </span>
            <h2 className="text-2xl md:text-4xl font-800 text-[#1F2937] mb-3">
              لديك استفسارات إضافية؟
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base">
              إليك الإجابات عن أهم الأسئلة حول طريقة الدفع والتجربة المجانية.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-[#FDF6EC]/60 rounded-2xl p-6 border border-[#E8D8C4] hover:bg-[#FDF6EC] transition-colors"
              >
                <h3 className="font-700 text-[#1F2937] text-base mb-2 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1D5B79] text-white text-xs font-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed pr-9">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
