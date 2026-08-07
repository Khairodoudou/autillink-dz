"use client";
// app/parent/chat/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import { MessageSquare, Lock, ShieldCheck, BellRing, FileUp, Sparkles } from "lucide-react";

export default function ParentChatPage() {
  return (
    <div>
      <PageHeader
        title="المحادثات والدردشة"
        subtitle="التواصل المباشر والآمن مع الأخصائيين المتابعين لأطفالك"
        icon={MessageSquare}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      <div className="max-w-3xl mx-auto my-6 px-4">
        {/* Main Locked Card */}
        <div className="bg-white rounded-3xl border-2 border-[#E8D8C4] p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2E8B7E]/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F5B942]/10 rounded-full blur-2xl" />

          {/* Locked Badge Icon */}
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto mb-6 shadow-md animate-pulse">
            <Lock className="w-12 h-12 text-amber-600" />
            <div className="absolute -top-2 -right-2 bg-[#2E8B7E] text-white p-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-sm font-800 mb-4">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>خاصية المحادثات قريباً</span>
          </div>

          <h2 className="text-2xl font-900 text-[#1F2937] mb-3">
            نظام المحادثات الفورية قيد التطوير النهائي
          </h2>

          <p className="text-[#6B7280] text-sm max-w-lg mx-auto leading-relaxed mb-8">
            نعمل حالياً على تجهيز بيئة آمنة ومشفرة تماماً تتيح لك التواصل المباشر مع الأخصائيين المتابعين لطفلك، ومشاركة الصور والتقارير الطبية بكل سهولة وخصوصية.
          </p>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right mb-8">
            <div className="bg-[#FDF6EC] border border-[#E8D8C4] rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#2E8B7E]/15 flex items-center justify-center text-[#2E8B7E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-800 text-[#1F2937]">تشفير وحماية كاملة</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                خصوصية تامة لجميع المحادثات والملفات المتبادلة.
              </p>
            </div>

            <div className="bg-[#FDF6EC] border border-[#E8D8C4] rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1D5B79]/15 flex items-center justify-center text-[#1D5B79]">
                <FileUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-800 text-[#1F2937]">مشاركة الملفات</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                إرسال الصور والتقارير الطبية والتسجيلات بسهولة.
              </p>
            </div>

            <div className="bg-[#FDF6EC] border border-[#E8D8C4] rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#F5B942]/20 flex items-center justify-center text-[#B8860B]">
                <BellRing className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-800 text-[#1F2937]">إشعارات لحظية</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                تنبيهات مباشرة فور وصول ردود أو توجيهات الأخصائي.
              </p>
            </div>
          </div>

          {/* Action Disabled Button */}
          <button
            disabled
            className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#F5E8D4] text-[#9CA3AF] font-800 text-sm border-2 border-dashed border-[#E8D8C4] cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
          >
            <Lock className="w-4 h-4" />
            <span>سيتم تفعيل الخدمة قريباً في التحديث القادم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
