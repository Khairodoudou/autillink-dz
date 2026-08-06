"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  LogIn,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full py-10 px-4 sm:px-8 lg:px-12 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl shadow-[#1D5B79]/15 border border-[#E8D8C4] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] lg:min-h-[640px] items-stretch">
        
        {/* Visual Illustration Panel (7 Cols on desktop) */}
        <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-full bg-gradient-to-br from-[#1D5B79] via-[#1D5B79] to-[#2E8B7E] flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden order-last lg:order-first">
          {/* Generated Banner Image as Background */}
          <Image
            src="/images/login-banner.png"
            alt="AutiLink DZ - منصة متابعة طفل التوحد"
            fill
            className="object-cover object-center opacity-35 mix-blend-overlay scale-105 transition-transform duration-700 hover:scale-100"
            priority
          />

          {/* Ambient Glow & Shadow Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#163f56]/95 via-[#1D5B79]/65 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1D5B79]/30 to-[#163f56]/80 pointer-events-none" />


          {/* Center Content Message */}
          <div className="relative z-10 my-auto py-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-600 mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              متابعة يومية منظمة وفعّالة
            </div>
            <h2 className="text-3xl lg:text-4xl font-900 leading-tight mb-4 text-white">
              معاً لرعاية وتوجيه{" "}
              <span className="text-[#F5B942] underline decoration-wavy decoration-[#F5B942]/40 underline-offset-8">
                طفلك المميز
              </span>
            </h2>
            <p className="text-white/85 text-base leading-relaxed font-400">
              جسرك الرقمي الذي يربط بين الأسرة والأخصائي والمركز لمتابعة دقيقة وشاملة في كل خطوة ومرحلة من النمو.
            </p>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-3 text-xs md:text-sm text-white/85 border-t border-white/20 pt-5">
            <ShieldCheck className="w-5 h-5 text-[#F5B942] flex-shrink-0" />
            <span>منصة رقمية آمنة ومشفّرة لحماية كافة بيانات طفلك والتقارير الطبية</span>
          </div>
        </div>

        {/* Form Panel (5 Cols on desktop) */}
        <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-700 bg-[#1D5B79]/10 text-[#1D5B79] mb-3">
                مرحباً بك مجدداً
              </span>
              <h1 className="text-3xl font-900 text-[#1F2937] mb-2">
                تسجيل الدخول
              </h1>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                أدخل بيانات حسابك المسجّل للوصول إلى لوحة التحكم
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-700 text-[#374151] mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="input-rtl input-icon-right h-13 text-sm font-500 text-left"
                    dir="ltr"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-sm font-700 text-[#374151]">
                    كلمة المرور
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-600 text-[#1D5B79] hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-rtl input-icon-both h-13 text-sm font-500"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF] pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1D5B79] transition-colors p-1 flex items-center justify-center"
                    aria-label="عرض كلمة المرور"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit"
                className="flex items-center justify-center gap-2.5 w-full h-13 rounded-2xl bg-gradient-to-r from-[#1D5B79] to-[#2478a0] text-white font-700 text-base hover:from-[#163f56] hover:to-[#1D5B79] transition-all duration-300 shadow-xl shadow-[#1D5B79]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول</span>
              </button>
            </form>
          </div>

          {/* Register Link Footer */}
          <div className="mt-8 pt-6 border-t border-[#E8D8C4]/60 text-center">
            <p className="text-sm text-[#6B7280]">
              ليس لديك حساب؟{" "}
              <Link
                href="/register"
                className="text-[#1D5B79] font-800 hover:underline inline-flex items-center gap-1"
              >
                <span>إنشاء حساب جديد</span>
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
