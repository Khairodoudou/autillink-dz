"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Heart } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-xl shadow-[#1D5B79]/8 border border-[#E8D8C4] overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-[#E8D8C4]">
          <div className="w-16 h-16 rounded-2xl bg-[#1D5B79]/10 flex items-center justify-center mx-auto mb-4">
            {submitted ? (
              <CheckCircle className="w-8 h-8 text-[#2E8B7E]" />
            ) : (
              <Mail className="w-8 h-8 text-[#1D5B79]" />
            )}
          </div>
          <h1 className="text-2xl font-800 text-[#1F2937] mb-2">
            {submitted ? "تم إرسال الرسالة" : "نسيت كلمة المرور؟"}
          </h1>
          <p className="text-[#6B7280] text-sm">
            {submitted
              ? `أرسلنا رابط استعادة كلمة المرور إلى ${email}. تحقق من بريدك الإلكتروني.`
              : "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور."}
          </p>
        </div>

        <div className="p-8">
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="block text-sm font-600 text-[#374151] mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="input-rtl pl-10"
                    dir="ltr"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>

              <button
                type="submit"
                id="forgot-submit"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#1D5B79] text-white font-700 hover:bg-[#163f56] transition-all shadow-lg"
              >
                <Mail className="w-5 h-5" />
                إرسال رابط الاستعادة
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#2E8B7E]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#2E8B7E]" />
              </div>
              <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
                تحقق من صندوق الوارد أو مجلد البريد غير المرغوب فيه. إذا لم تجد الرسالة خلال دقيقتين، يمكنك المحاولة مجدداً.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                className="text-sm text-[#1D5B79] font-600 hover:underline"
              >
                لم أستلم الرسالة — إعادة الإرسال
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1D5B79] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
