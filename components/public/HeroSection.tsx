"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, CheckCircle, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-pattern">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-100" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-[-100px] w-80 h-80 rounded-full bg-[#2E8B7E]/20 blur-3xl" />
      <div className="absolute bottom-20 right-[-80px] w-64 h-64 rounded-full bg-[#E97F6B]/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1D5B79]/10 blur-[120px]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-rtl relative z-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content (6 Cols) */}
          <div
            className={`lg:col-span-6 transition-all duration-1000 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-500 mb-8 mt-4 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              منصة جزائرية متخصصة في رعاية أطفال التوحد
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-900 text-white leading-tight mb-6">
              متابعة ذكية
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-[#F5B942] to-[#E97F6B]">
                لطفلك المميز
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-lg font-400">
              نربط الأسرة بالأخصائيين ومراكز رعاية أطفال طيف التوحد في منصة واحدة — متابعة يومية منظّمة، تقارير فورية، وتواصل مباشر بدلاً من واتساب والأوراق.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Link
                href="/register"
                className="flex items-center gap-2.5 px-7 py-4 rounded-full bg-white text-[#1D5B79] font-700 text-base hover:bg-[#FDF6EC] transition-all duration-300 shadow-xl shadow-black/20 hover:scale-105 hover:-translate-y-0.5"
              >
                إنشاء حساب جديد
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2.5 px-7 py-4 rounded-full border-2 border-white/40 text-white font-600 text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                اكتشف المميزات
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2 space-x-reverse">
                {["#1D5B79", "#2E8B7E", "#E97F6B", "#6B4C93"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-700"
                      style={{ background: color }}
                    >
                      {["أ", "م", "س", "ع"][i]}
                    </div>
                  )
                )}
              </div>
              <div>
                <div className="text-white font-700 text-sm">
                  +500 أسرة تثق بنا
                </div>
                <div className="text-white/60 text-xs">عبر 69 ولاية في الجزائر</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Panel (6 Cols) */}
          <div
            className={`lg:col-span-6 relative transition-all duration-1000 delay-200 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-md group">
              <Image
                src="/images/home-hero.png"
                alt="أوتيلينك دي زي - منصة متابعة طفل التوحد"
                width={700}
                height={550}
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Gradient Overlay & Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#163f56]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Live Badge 1 */}
              <div className="absolute top-5 right-5 glass rounded-2xl p-3.5 flex items-center gap-3 shadow-xl backdrop-blur-md border border-white/30 animate-float">
                <div className="w-9 h-9 rounded-xl bg-[#2E8B7E] text-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white text-xs font-700">تقارير سلوكية يومية</p>
                  <p className="text-white/70 text-[10px]">تحديثات مباشرة للأسر</p>
                </div>
              </div>

              {/* Floating Live Badge 2 */}
              <div className="absolute bottom-6 left-6 glass rounded-2xl p-3.5 flex items-center gap-3 shadow-xl backdrop-blur-md border border-white/30 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="w-9 h-9 rounded-xl bg-[#E97F6B] text-white flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-700">تواصل مباشر مع الأخصائي</p>
                  <p className="text-white/70 text-[10px]">استشارات وتقييمات منظمة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L60 72C120 64 240 48 360 42.7C480 37 600 42 720 48C840 54 960 62 1080 61.3C1200 61 1320 51 1380 46L1440 41V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            fill="#FDF6EC"
          />
        </svg>
      </div>
    </section>
  );
}
