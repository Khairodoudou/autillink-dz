"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Users,
  Stethoscope,
  Building2,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

/* ─── Role Configuration & Images ────────────────────────── */
const roles = [
  {
    id: "parent",
    label: "ولي أمر",
    sublabel: "للآباء والأمهات والأوصياء",
    icon: Users,
    color: "#2E8B7E",
    bg: "#2E8B7E10",
    border: "#2E8B7E30",
    description: "تابع طفلك، تواصل مع الأخصائي واستقبل التقارير فورياً.",
    image: "/images/parent-role.png",
    badge: "فضاء الأسر والأولياء",
    title: "تابع طفلك وتواصل مع أخصائيه بسهولة",
    subtitle: "لوحة متابعة تفاعلية، تقارير سلوكية دورية، وألعاب تعليمية حسية مخصصة لطفلك.",
  },
  {
    id: "specialist",
    label: "أخصائي / معالج",
    sublabel: "طبيب، معالج نفسي، مختص نطق",
    icon: Stethoscope,
    color: "#1D5B79",
    bg: "#1D5B7910",
    border: "#1D5B7930",
    description: "تابع مرضاك، قيّم وأرسل التقارير للأسر والمركز.",
    image: "/images/specialist-role.png",
    badge: "فضاء الأخصائيين والمعالجين",
    title: "أدوات تقييم ومتابعة دقيقة للمرضى",
    subtitle: "أدر حالاتك المرضية، أنشئ التقارير السريرية فورياً وتواصل بفعالية مع الأولياء والمركز.",
  },
  {
    id: "admin",
    label: "إدارة مركز",
    sublabel: "مدير مركز أو جمعية متخصصة",
    icon: Building2,
    color: "#6B4C93",
    bg: "#6B4C9310",
    border: "#6B4C9330",
    description: "أدر فريقك، راقب التقدم واشترك بالخطة المؤسسية.",
    image: "/images/admin-role.png",
    badge: "فضاء إدارة المراكز",
    title: "إدارة مؤسسية شاملة للمركز والأطقم",
    subtitle: "لوحة قيادة مركزية لمراقبة أداء الأخصائيين، تنظيم المواعيد والتحكم في الخطة المؤسسية.",
  },
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string>("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const currentRole = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <div className="w-full py-10 px-4 sm:px-8 lg:px-12 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl shadow-[#1D5B79]/15 border border-[#E8D8C4] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] items-stretch">
        
        {/* Left Side: Visual Illustration Panel (Switches Image & Copy Dynamically) */}
        <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-full bg-gradient-to-br from-[#1D5B79] via-[#1D5B79] to-[#2E8B7E] flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden order-last lg:order-first">
          
          {/* Role Dynamic Image Background */}
          <Image
            key={currentRole.id}
            src={currentRole.image}
            alt={currentRole.title}
            fill
            className="object-cover object-center opacity-40 mix-blend-overlay scale-105 transition-all duration-700 hover:scale-100"
            priority
          />

          {/* Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#163f56]/95 via-[#1D5B79]/65 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1D5B79]/30 to-[#163f56]/80 pointer-events-none" />

          {/* Top Brand Badge */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <span className="block text-xl font-800 text-white leading-none">أوتيلينك دي زي</span>
              <span className="text-xs font-700 text-white/80 tracking-widest uppercase mt-0.5 block">AutiLink DZ</span>
            </div>
          </div>

          {/* Center Dynamic Content */}
          <div className="relative z-10 my-auto py-8 max-w-lg transition-all duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-700 mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              <span>{currentRole.badge}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-900 leading-tight mb-4 text-white">
              {currentRole.title}
            </h2>
            <p className="text-white/85 text-sm md:text-base leading-relaxed font-400">
              {currentRole.subtitle}
            </p>
          </div>

          {/* Bottom Step Indicator & Trust Badge */}
          <div className="relative z-10 border-t border-white/20 pt-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/85">
              <ShieldCheck className="w-4.5 h-4.5 text-[#F5B942]" />
              <span>منصة جزائرية موثوقة لمتابعة التوحد</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full transition-all ${step === 1 ? "bg-[#F5B942] w-6" : "bg-white/40"}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all ${step === 2 ? "bg-[#F5B942] w-6" : "bg-white/40"}`} />
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel (6 Cols on desktop) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {step === 1 ? (
              /* Step 1: Role Selection */
              <div>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-700 bg-[#1D5B79]/10 text-[#1D5B79] mb-2">
                    الخطوة 1 من 2
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-900 text-[#1F2937] mb-2">
                    ما هو دورك في أوتيلينك؟
                  </h1>
                  <p className="text-[#6B7280] text-sm">
                    اختر نوع الحساب المناسب لتهيئة الواجهة المخصصة لاحتياجاتك.
                  </p>
                </div>

                {/* Roles Cards Grid */}
                <div className="space-y-3.5 mb-8">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        id={`role-${role.id}`}
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-right transition-all cursor-pointer w-full ${
                          isSelected
                            ? "border-[#1D5B79] bg-[#1D5B79]/5 shadow-md scale-[1.01]"
                            : "border-[#E8D8C4] hover:border-[#1D5B79]/40 hover:bg-[#FDF6EC]/40"
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                          style={{
                            background: isSelected ? role.color : `${role.color}15`,
                            color: isSelected ? "#FFFFFF" : role.color,
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-800 text-[#1F2937] text-base">
                              {role.label}
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-[#1D5B79] flex-shrink-0" />
                            )}
                          </div>
                          <span className="block text-xs font-600 text-[#9CA3AF] mb-1">
                            {role.sublabel}
                          </span>
                          <p className="text-xs text-[#6B7280] leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-2.5 w-full h-13 rounded-2xl bg-gradient-to-r from-[#1D5B79] to-[#2478a0] text-white font-700 text-base hover:from-[#163f56] hover:to-[#1D5B79] transition-all duration-300 shadow-xl shadow-[#1D5B79]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>متابعة إدخال البيانات</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Step 2: Input Form */
              <div>
                {/* Back Button & Role Badge */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-xs font-700 text-[#6B7280] hover:text-[#1D5B79] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                    <span>تغيير نوع الحساب</span>
                  </button>
                  <div
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-700 border"
                    style={{
                      background: currentRole.bg,
                      color: currentRole.color,
                      borderColor: currentRole.border,
                    }}
                  >
                    <currentRole.icon className="w-3.5 h-3.5" />
                    <span>{currentRole.label}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl font-900 text-[#1F2937] mb-1">
                    إكمال إنشاء الحساب
                  </h1>
                  <p className="text-[#6B7280] text-xs">
                    أدخل معلوماتك الأساسية لإنشاء حسابك على المنصة
                  </p>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-700 text-[#374151] mb-1.5">
                      الاسم الكامل *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="register-name"
                        placeholder="الاسم واللقب"
                        className="input-rtl input-icon-right h-12 text-sm"
                        required
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  {/* Center Name (Admin role) */}
                  {selectedRole === "admin" && (
                    <div>
                      <label className="block text-xs font-700 text-[#374151] mb-1.5">
                        اسم المركز أو الجمعية *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="register-center"
                          placeholder="مركز النور لرعاية التوحد"
                          className="input-rtl input-icon-right h-12 text-sm"
                          required
                        />
                        <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Specialty (Specialist role) */}
                  {selectedRole === "specialist" && (
                    <div>
                      <label className="block text-xs font-700 text-[#374151] mb-1.5">
                        التخصص الطبي / التربوي *
                      </label>
                      <div className="relative">
                        <select
                          id="register-specialty"
                          className="input-rtl input-icon-right h-12 text-sm appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="">اختر تخصصك</option>
                          <option value="psychologist">أخصائي نفسي</option>
                          <option value="speech">أخصائي أرطوفوني (نطق)</option>
                          <option value="educator">مربّي متخصص</option>
                          <option value="doctor">طبيب أطفال</option>
                          <option value="other">تخصص آخر</option>
                        </select>
                        <Stethoscope className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-700 text-[#374151] mb-1.5">
                      رقم الهاتف *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="register-phone"
                        placeholder="05XXXXXXXX"
                        className="input-rtl input-icon-right h-12 text-sm text-left"
                        dir="ltr"
                        required
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-700 text-[#374151] mb-1.5">
                      البريد الإلكتروني *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="register-email"
                        placeholder="example@email.com"
                        className="input-rtl input-icon-right h-12 text-sm text-left"
                        dir="ltr"
                        required
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-700 text-[#374151] mb-1.5">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="register-password"
                        placeholder="8 أحرف على الأقل"
                        className="input-rtl input-icon-both h-12 text-sm"
                        required
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1D5B79] transition-colors p-1"
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

                  {/* Terms */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="register-terms"
                      className="w-4 h-4 mt-0.5 accent-[#1D5B79] cursor-pointer flex-shrink-0"
                      required
                    />
                    <label
                      htmlFor="register-terms"
                      className="text-xs text-[#6B7280] cursor-pointer leading-relaxed"
                    >
                      أوافق على{" "}
                      <Link href="/terms" className="text-[#1D5B79] font-700 hover:underline">
                        شروط الاستخدام
                      </Link>{" "}
                      و{" "}
                      <Link href="/privacy" className="text-[#1D5B79] font-700 hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="register-submit"
                    className="flex items-center justify-center gap-2.5 w-full h-12 rounded-2xl bg-gradient-to-r from-[#1D5B79] to-[#2478a0] text-white font-700 text-sm hover:from-[#163f56] hover:to-[#1D5B79] transition-all duration-300 shadow-lg shadow-[#1D5B79]/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-3"
                  >
                    <UserPlus className="w-4.5 h-4.5" />
                    <span>إنشاء الحساب</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Login Link Footer */}
          <div className="mt-6 pt-4 border-t border-[#E8D8C4]/60 text-center">
            <p className="text-xs md:text-sm text-[#6B7280]">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="text-[#1D5B79] font-800 hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
