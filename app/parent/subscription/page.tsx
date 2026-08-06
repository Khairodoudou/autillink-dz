"use client";
// app/parent/subscription/page.tsx
import { useState } from "react";
import { CreditCard, Check, Star, Zap, Shield, ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const plans = [
  {
    id: "basic",
    name: "الأساسي",
    price: 1_200,
    period: "شهرياً",
    color: "#1D5B79",
    bg: "#1D5B7915",
    features: [
      "متابعة طفل واحد",
      "السجل اليومي",
      "التقارير الأساسية",
      "المواعيد (حتى 4/شهر)",
      "دعم عبر البريد",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "المتميز",
    price: 2_800,
    period: "شهرياً",
    color: "#2E8B7E",
    bg: "#2E8B7E15",
    features: [
      "متابعة حتى 3 أطفال",
      "السجل اليومي + إحصائيات",
      "جميع التقارير + PDF",
      "مواعيد غير محدودة",
      "رسائل مباشرة مع الأخصائي",
      "وضع الطفل التفاعلي",
      "دعم ذو أولوية",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "البريميوم",
    price: 4_500,
    period: "شهرياً",
    color: "#6B4C93",
    bg: "#6B4C9315",
    features: [
      "أطفال غير محدودون",
      "كل مميزات المتميز",
      "تقارير تحليلية متقدمة",
      "استشارة شهرية مع متخصص",
      "إشعارات فورية",
      "دعم 24/7",
    ],
    recommended: false,
  },
];

type Step = "plans" | "payment" | "confirm";

export default function SubscriptionPage() {
  const [step, setStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("confirm");
    }, 2000);
  };

  const formatCard = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  if (step === "confirm") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 rounded-full bg-[#2E8B7E]/10 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-12 h-12 text-[#2E8B7E]" />
        </div>
        <h1 className="text-2xl font-900 text-[#1F2937] mb-3">تم الاشتراك بنجاح!</h1>
        <p className="text-[#6B7280] mb-2">
          مرحباً بك في خطة{" "}
          <span className="font-800" style={{ color: selectedPlan.color }}>
            {selectedPlan.name}
          </span>
        </p>
        <p className="text-sm text-[#9CA3AF] mb-8">
          سيتم تجديد اشتراكك تلقائياً في 4 سبتمبر 2026
        </p>
        <div className="bg-white rounded-2xl border border-[#E8D8C4] p-5 mb-6 text-right space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#1F2937]">{selectedPlan.name}</span>
            <span className="text-[#6B7280]">الخطة المختارة</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#2E8B7E]">{selectedPlan.price.toLocaleString("ar-DZ")} دج</span>
            <span className="text-[#6B7280]">المبلغ المدفوع</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#1F2937]">•••• {cardData.number.slice(-4) || "1234"}</span>
            <span className="text-[#6B7280]">طريقة الدفع</span>
          </div>
        </div>
        <button
          onClick={() => setStep("plans")}
          className="px-6 py-3 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-colors"
        >
          العودة إلى الاشتراك
        </button>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div>
        <PageHeader
          title="إتمام الدفع"
          subtitle={`خطة ${selectedPlan.name} — ${selectedPlan.price.toLocaleString("ar-DZ")} دج/شهر`}
          icon={CreditCard}
          iconColor={selectedPlan.color}
          iconBg={selectedPlan.bg}
        />
        <div className="max-w-lg mx-auto">
          {/* Card Preview */}
          <div
            className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-lg"
            style={{ background: `linear-gradient(135deg, ${selectedPlan.color}, ${selectedPlan.color}99)` }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <CreditCard className="w-8 h-8 opacity-80" />
                <span className="text-sm font-700 opacity-80">AUTILINK DZ</span>
              </div>
              <p className="text-xl font-800 tracking-widest mb-4">
                {cardData.number || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">{cardData.name || "اسم حامل البطاقة"}</span>
                <span className="opacity-70">{cardData.expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-[#E8D8C4] p-6 space-y-4">
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">رقم البطاقة</label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                className="input-rtl tracking-widest"
                maxLength={19}
              />
            </div>
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">اسم حامل البطاقة</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                placeholder="MOHAMMED BEN ALI"
                className="input-rtl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">تاريخ الانتهاء</label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="input-rtl"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">CVV</label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  placeholder="•••"
                  className="input-rtl"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#F5E8D4] flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">المجموع</span>
              <span className="text-lg font-900 text-[#1F2937]">
                {selectedPlan.price.toLocaleString("ar-DZ")} دج
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("plans")}
                className="px-4 py-3 border border-[#E8D8C4] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                رجوع
              </button>
              <button
                onClick={handlePay}
                disabled={processing}
                className="flex-1 py-3 text-white rounded-xl text-sm font-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: selectedPlan.color }}
              >
                {processing ? (
                  <span className="animate-pulse">جاري المعالجة...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    دفع آمن — {selectedPlan.price.toLocaleString("ar-DZ")} دج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="الاشتراك والباقات"
        subtitle="اختر الباقة المناسبة لطفلك ومتابعة تطوره"
        icon={CreditCard}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      {/* Current Plan Banner */}
      <div className="bg-[#2E8B7E]/10 border border-[#2E8B7E]/30 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-800 text-[#2E8B7E]">اشتراكك الحالي: المتميز</p>
          <p className="text-xs text-[#6B7280] mt-0.5">ينتهي في 4 سبتمبر 2026 — التجديد التلقائي مفعّل</p>
        </div>
        <span className="text-xs font-700 px-3 py-1.5 bg-[#2E8B7E] text-white rounded-full">نشط</span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all relative hover:-translate-y-1 hover:shadow-lg ${
              selectedPlan.id === plan.id
                ? "shadow-lg -translate-y-1"
                : "border-[#E8D8C4]"
            }`}
            style={selectedPlan.id === plan.id ? { borderColor: plan.color } : {}}
          >
            {plan.recommended && (
              <div
                className="absolute -top-3 right-1/2 translate-x-1/2 px-3 py-1 rounded-full text-xs font-800 text-white flex items-center gap-1"
                style={{ backgroundColor: plan.color }}
              >
                <Star className="w-3 h-3" /> الأكثر اختياراً
              </div>
            )}

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: plan.bg }}
            >
              <Zap className="w-6 h-6" style={{ color: plan.color }} />
            </div>

            <h3 className="text-lg font-900 text-[#1F2937] mb-1">{plan.name}</h3>
            <div className="flex items-end gap-1 mb-5">
              <span className="text-3xl font-900" style={{ color: plan.color }}>
                {plan.price.toLocaleString("ar-DZ")}
              </span>
              <span className="text-sm text-[#6B7280] mb-1">دج / {plan.period}</span>
            </div>

            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => { setSelectedPlan(plan); setStep("payment"); }}
              className="w-full py-2.5 rounded-xl text-sm font-700 transition-colors flex items-center justify-center gap-2"
              style={
                selectedPlan.id === plan.id
                  ? { backgroundColor: plan.color, color: "#fff" }
                  : { backgroundColor: plan.bg, color: plan.color }
              }
            >
              اختر هذه الباقة
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Security note */}
      <p className="text-center text-xs text-[#9CA3AF] flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        جميع المعاملات مشفرة ومحمية — يمكنك الإلغاء في أي وقت
      </p>
    </div>
  );
}
