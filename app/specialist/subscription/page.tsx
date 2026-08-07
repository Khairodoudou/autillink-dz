"use client";
// app/specialist/subscription/page.tsx
import { useState, useEffect } from "react";
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Shield,
  ChevronRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

type BillingCycle = "monthly" | "yearly";

const basePlans = [
  {
    id: "basic",
    name: "الأساسي",
    monthlyPrice: 1_500,
    color: "#1D5B79",
    bg: "#1D5B7915",
    features: [
      "متابعة حتى 10 حالات",
      "كتابة وتصدير التقارير السريرية",
      "جدول المواعيد الأسبوعي",
      "الوصول لأدوات التقييم الأساسية",
      "متابعة استجابات الطفل للألعاب",
      "دعم عبر البريد الإلكتروني",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "المتميز",
    monthlyPrice: 3_200,
    color: "#2E8B7E",
    bg: "#2E8B7E15",
    features: [
      "حالات غير محدودة",
      "تقارير PDF احترافية قابلة للمشاركة",
      "جدول مواعيد وسجل تواصل غير محدود",
      "تواصل مباشر وفوري مع أولياء الأمور",
      "تحليلات متابعة متقدمة وتوصيات ألعاب",
      "إشعارات فورية وتنبيهات الحالات",
      "دعم فني واستشاري ذو أولوية",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "البريميوم",
    monthlyPrice: 5_000,
    color: "#6B4C93",
    bg: "#6B4C9315",
    features: [
      "كل مميزات الخطة المتميزة",
      "لوحة تحليل إحصائية ورسوم بيانية شاملة",
      "تصدير كامل لبيانات وسجلات المرضى",
      "ربط وتكامل مع منصات المراكز والعيادات",
      "خطة علاجية واختبارات ذكية بالذكاء الاصطناعي (AI)",
      "دعم وتغطية 24/7",
    ],
    recommended: false,
  },
];

type Step = "plans" | "payment" | "confirm";

export default function SpecialistSubscriptionPage() {
  const [step, setStep] = useState<Step>("plans");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("pro");

  const [subInfo, setSubInfo] = useState<{
    status?: string;
    price?: number;
    endDate?: string;
    isSuspended?: boolean;
    statusLabel?: string;
    plan?: string;
  }>({});
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/specialist/subscription")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && res.data) {
          setSubInfo(res.data);
        }
      });
  }, [step]);

  // Calculate current active plan pricing
  const currentPlans = basePlans.map((p) => {
    const isYearly = billingCycle === "yearly";
    // 17% discount for yearly
    const yearlyTotalPrice = Math.round(p.monthlyPrice * 12 * 0.83);
    const yearlyMonthlyEquivalent = Math.round(yearlyTotalPrice / 12);
    const originalYearly = p.monthlyPrice * 12;
    const savings = originalYearly - yearlyTotalPrice;

    return {
      ...p,
      price: isYearly ? yearlyTotalPrice : p.monthlyPrice,
      monthlyEquivalent: isYearly ? yearlyMonthlyEquivalent : p.monthlyPrice,
      originalPrice: isYearly ? originalYearly : null,
      savings: isYearly ? savings : 0,
      periodLabel: isYearly ? "سنوياً" : "شهرياً",
    };
  });

  const selectedPlan =
    currentPlans.find((p) => p.id === selectedPlanId) || currentPlans[1];

  const handlePay = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/specialist/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: selectedPlan.price,
          billingCycle,
          planId: selectedPlan.id,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubInfo({
          status: "ACTIVE",
          price: selectedPlan.price,
          statusLabel: "نشط",
          plan: selectedPlan.name,
          endDate: data.data.subscription?.endDate,
        });
        setStep("confirm");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
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
        <div className="w-24 h-24 rounded-full bg-[#1D5B79]/10 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-12 h-12 text-[#1D5B79]" />
        </div>
        <h1 className="text-2xl font-900 text-[#1F2937] mb-3">تم الاشتراك بنجاح!</h1>
        <p className="text-[#6B7280] mb-2">
          مرحباً بك في خطة{" "}
          <span className="font-800" style={{ color: selectedPlan.color }}>
            {selectedPlan.name} ({selectedPlan.periodLabel})
          </span>
        </p>
        <p className="text-sm text-[#9CA3AF] mb-8">
          تم سداد المبلغ واختفاء تنبيه السداد وتفعيل حسابك المهني بنجاح.
        </p>
        <div className="bg-white rounded-2xl border border-[#D6E8F0] p-5 mb-6 text-right space-y-3 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#1F2937]">
              {selectedPlan.name} ({selectedPlan.periodLabel})
            </span>
            <span className="text-[#6B7280]">الخطة المختارة</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#1D5B79]">
              {selectedPlan.price.toLocaleString("ar-DZ")} دج
            </span>
            <span className="text-[#6B7280]">المبلغ المدفوع</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-700 text-[#1F2937]">
              •••• {cardData.number.slice(-4) || "1234"}
            </span>
            <span className="text-[#6B7280]">طريقة الدفع</span>
          </div>
        </div>
        <a
          href="/specialist/dashboard"
          className="inline-block px-6 py-3 bg-[#1D5B79] text-white rounded-xl text-sm font-700 hover:bg-[#174A62] transition-colors shadow"
        >
          الانتقال إلى لوحة التحكم
        </a>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div>
        <PageHeader
          title="إتمام الدفع"
          subtitle={`خطة ${selectedPlan.name} — ${selectedPlan.price.toLocaleString("ar-DZ")} دج / ${selectedPlan.periodLabel}`}
          icon={CreditCard}
          iconColor={selectedPlan.color}
          iconBg={selectedPlan.bg}
        />
        <div className="max-w-lg mx-auto">
          {/* Card Preview */}
          <div
            className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${selectedPlan.color}, ${selectedPlan.color}99)`,
            }}
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
          <div className="bg-white rounded-2xl border border-[#D6E8F0] p-6 space-y-4 shadow-sm">
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                رقم البطاقة
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) =>
                  setCardData({ ...cardData, number: formatCard(e.target.value) })
                }
                placeholder="1234 5678 9012 3456"
                className="input-rtl tracking-widest"
                maxLength={19}
              />
            </div>
            <div>
              <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                اسم حامل البطاقة
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                placeholder="AHMED BEN OMAR"
                className="input-rtl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                  تاريخ الانتهاء
                </label>
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
                <label className="text-sm font-600 text-[#6B7280] block mb-1.5">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                    })
                  }
                  placeholder="•••"
                  className="input-rtl"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAF3F7] space-y-1.5">
              <div className="flex justify-between items-center text-xs text-[#6B7280]">
                <span>دورة الفوترة</span>
                <span>{billingCycle === "yearly" ? "سنوية (-17%)" : "شهرية"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-700 text-[#6B7280]">المجموع النهائي</span>
                <span className="text-xl font-900 text-[#1F2937]">
                  {selectedPlan.price.toLocaleString("ar-DZ")} دج
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("plans")}
                className="px-4 py-3 border border-[#D6E8F0] rounded-xl text-sm font-700 text-[#6B7280] hover:bg-[#EAF3F7] transition-colors"
              >
                رجوع
              </button>
              <button
                onClick={handlePay}
                disabled={processing}
                className="flex-1 py-3 text-white rounded-xl text-sm font-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow"
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

  const isActive = subInfo.status === "ACTIVE";

  return (
    <div>
      <PageHeader
        title="الاشتراك والباقات المهنية للمختصين"
        subtitle="اختر الباقة المناسبة لممارستك وعدد حالاتك، مع إمكانية الاشتراك السنوي بتوفير 17%"
        icon={CreditCard}
        iconColor="#1D5B79"
        iconBg="#1D5B7915"
      />

      {/* Current Plan Banner */}
      <div
        className={`border rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm ${
          isActive
            ? "bg-[#1D5B79]/10 border-[#1D5B79]/30"
            : "bg-amber-50 border-amber-300"
        }`}
      >
        <div>
          <p
            className={`text-sm font-800 ${
              isActive ? "text-[#1D5B79]" : "text-amber-900"
            }`}
          >
            اشتراكك الحالي: {isActive ? subInfo.plan || "المتميز" : "الخطة التجريبية (0 دج)"}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {isActive
              ? `ينتهي في ${subInfo.endDate || "الشهر القادم"} — الاشتراك نشط`
              : `يلزم سداد الاشتراك خلال 3 أيام قبل ${
                  subInfo.endDate || "تاريخ انتهاء فترة التجربة"
                }`}
          </p>
        </div>
        <span
          className={`text-xs font-700 px-3 py-1.5 rounded-full ${
            isActive
              ? "bg-[#1D5B79] text-white"
              : "bg-amber-600 text-white flex items-center gap-1"
          }`}
        >
          {!isActive && <AlertTriangle className="w-3.5 h-3.5" />}
          {isActive ? "نشط" : "معلق (0 دج)"}
        </span>
      </div>

      {/* Monthly / Annual Toggle Switch */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#D6E8F0]/40 p-1.5 rounded-2xl flex items-center border border-[#D6E8F0] shadow-inner">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-xl text-sm font-800 transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-[#1F2937] shadow-sm"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            اشتراك شهري
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2.5 rounded-xl text-sm font-800 transition-all flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-[#1D5B79] text-white shadow-sm"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>اشتراك سنوي</span>
            <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-[11px] font-900 rounded-full animate-pulse">
              خصم 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentPlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all relative flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg ${
                isSelected ? "shadow-lg -translate-y-1" : "border-[#D6E8F0]"
              }`}
              style={isSelected ? { borderColor: plan.color } : {}}
            >
              {plan.recommended && (
                <div
                  className="absolute -top-3 right-1/2 translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-800 text-white flex items-center gap-1 shadow"
                  style={{ backgroundColor: plan.color }}
                >
                  <Star className="w-3.5 h-3.5" /> الأكثر اختياراً
                </div>
              )}

              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: plan.bg }}
                >
                  <Zap className="w-6 h-6" style={{ color: plan.color }} />
                </div>

                <h3 className="text-lg font-900 text-[#1F2937] mb-1">{plan.name}</h3>

                {/* Price Display */}
                <div className="mb-5">
                  {billingCycle === "yearly" && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#9CA3AF] line-through">
                        {(plan.monthlyPrice * 12).toLocaleString("ar-DZ")} دج
                      </span>
                      <span className="text-xs font-800 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        وفر {plan.savings.toLocaleString("ar-DZ")} دج (-17%)
                      </span>
                    </div>
                  )}
                  <div className="flex items-end gap-1">
                    <span
                      className="text-3xl font-900"
                      style={{ color: plan.color }}
                    >
                      {plan.price.toLocaleString("ar-DZ")}
                    </span>
                    <span className="text-sm text-[#6B7280] mb-1">
                      دج / {plan.periodLabel}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-[11px] text-[#6B7280] mt-1">
                      تعادل {plan.monthlyEquivalent.toLocaleString("ar-DZ")} دج / شهرياً
                    </p>
                  )}
                </div>

                <p className="text-xs font-800 text-[#1F2937] mb-2 uppercase tracking-wider">
                  مميزات الباقة المهنية:
                </p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#4B5563]"
                    >
                      <Check
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: plan.color }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setStep("payment");
                }}
                className="w-full py-2.5 rounded-xl text-sm font-700 transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
                style={
                  isSelected
                    ? { backgroundColor: plan.color, color: "#fff" }
                    : { backgroundColor: plan.bg, color: plan.color }
                }
              >
                اختيار هذه الباقة ({plan.periodLabel})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <p className="text-center text-xs text-[#9CA3AF] flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        جميع المعاملات مشفرة ومحمية — يمكنك التبديل أو الإلغاء في أي وقت
      </p>
    </div>
  );
}
