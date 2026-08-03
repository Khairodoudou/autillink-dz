import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="section-padding">
      <div className="container-rtl">
        <div className="relative rounded-3xl overflow-hidden gradient-hero p-12 md:p-16 text-center">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E97F6B]/15 translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-[#F5B942]/10 -translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-500 mb-8">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              انضم إلى مئات الأسر الجزائرية
            </div>

            <h2 className="text-3xl md:text-5xl font-800 text-white mb-6 leading-tight">
              ابدأ رحلة التغيير
              <span className="block text-[#F5B942]">مع طفلك اليوم</span>
            </h2>

            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              لا تنتظر أكثر. انضم إلى منصة أوتيلينك دي زي ووفّر على طفلك المتابعة الاحترافية التي يستحقها — بشكل منظّم، رقمي وفعّال.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#1D5B79] font-700 text-base hover:bg-[#FDF6EC] transition-all duration-300 shadow-xl hover:scale-105"
              >
                إنشاء حسابك الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full border-2 border-white/40 text-white font-600 text-base hover:bg-white/10 transition-all duration-300"
              >
                عرض الأسعار
              </Link>
            </div>

            <p className="text-white/50 text-sm mt-6">
              سهولة التغيير أو اختيار الخطة في أي وقت
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
