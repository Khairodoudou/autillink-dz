"use client";
// app/parent/settings/page.tsx
import { useState, useEffect } from "react";
import {
  Settings, User, Lock, Bell, Shield, Save, Eye, EyeOff,
  CheckCircle, AlertCircle, Loader2, Phone, MapPin, Mail, Home
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const tabs = [
  { id: "account", label: "الحساب", icon: User },
  { id: "security", label: "الأمان", icon: Lock },
  { id: "notifications", label: "الإشعارات", icon: Bell },
];

const WILAYAS = [
  "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار",
  "البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر",
  "الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة",
  "قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض",
  "إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي",
  "خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تيموشنت",
  "غرداية","غليزان",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [account, setAccount] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    wilaya: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    old: "",
    newPass: "",
    confirm: "",
  });

  const [passError, setPassError] = useState("");

  const [notifications, setNotifications] = useState({
    newReport: true,
    newMessage: true,
    appointmentReminder: true,
    sessionCompleted: false,
    weeklyDigest: true,
    promotions: false,
  });

  const notifLabels: Record<string, { label: string; desc: string }> = {
    newReport:           { label: "تقرير جديد من الأخصائي", desc: "استلام إشعار عند إرسال تقرير جديد" },
    newMessage:          { label: "رسالة جديدة", desc: "إشعار فوري عند وصول رسالة" },
    appointmentReminder: { label: "تذكير بالمواعيد", desc: "تذكير قبل 24 ساعة من الموعد" },
    sessionCompleted:    { label: "انتهاء جلسة", desc: "إشعار عند انتهاء جلسة الطفل" },
    weeklyDigest:        { label: "ملخص أسبوعي", desc: "تقرير موجز كل أسبوع بالأنشطة" },
    promotions:          { label: "العروض والترقيات", desc: "إشعارات العروض والخدمات الجديدة" },
  };

  // Load profile from backend
  useEffect(() => {
    fetch("/api/parent/me")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          const d = res.data;
          setAccount({
            id: d.id ?? "",
            name: d.name ?? "",
            email: d.email ?? "",
            phone: d.phone ?? "",
            wilaya: d.wilaya ?? "",
            address: d.address ?? "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Save account info
  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/parent/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.name,
          phone: account.phone,
          wilaya: account.wilaya,
          address: account.address,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showFeedback("success", "✓ تم حفظ المعلومات بنجاح");
        if (data.data) {
          const d = data.data;
          setAccount((prev) => ({
            ...prev,
            name: d.name ?? prev.name,
            email: d.email ?? prev.email,
            phone: d.phone ?? "",
            wilaya: d.wilaya ?? "",
            address: d.address ?? "",
          }));
        }
      } else {
        showFeedback("error", data.message || "حدث خطأ، يرجى المحاولة مجدداً");
      }
    } catch {
      showFeedback("error", "تعذر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setPassError("");
    if (!passwords.old) { setPassError("يرجى إدخال كلمة المرور الحالية"); return; }
    if (passwords.newPass.length < 8) { setPassError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError("كلمة المرور الجديدة وتأكيدها غير متطابقتين"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/parent/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.old,
          newPassword: passwords.newPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showFeedback("success", "تم تغيير كلمة المرور بنجاح ✓");
        setPasswords({ old: "", newPass: "", confirm: "" });
      } else {
        setPassError(data.message || "كلمة المرور الحالية غير صحيحة");
      }
    } catch {
      setPassError("تعذر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  // Save notifications (local only for now — can extend to API later)
  const handleSaveNotifications = () => {
    showFeedback("success", "تم حفظ تفضيلات الإشعارات ✓");
  };

  const avatarLetter = account.name ? account.name.trim()[0] : "م";

  const handleSave = () => {
    if (activeTab === "account") handleSaveAccount();
    else if (activeTab === "security") handleChangePassword();
    else if (activeTab === "notifications") handleSaveNotifications();
  };

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        subtitle="إدارة حسابك وتفضيلاتك الشخصية"
        icon={Settings}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedback.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {feedback.msg}
        </div>
      )}

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E8D8C4] p-2 flex lg:flex-col gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 transition-all w-full text-right ${
                  activeTab === id
                    ? "bg-[#2E8B7E] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F5E8D4]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8D8C4] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#6B7280] flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E8B7E]" />
              <span className="text-sm">جاري تحميل البيانات...</span>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-6">
                {/* ── ACCOUNT TAB ── */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    {/* Avatar & summary */}
                    <div className="flex items-center gap-4 pb-6 border-b border-[#F5E8D4]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E8B7E] to-[#1D5B79] flex items-center justify-center text-white text-2xl font-900 shadow-md">
                        {avatarLetter}
                      </div>
                      <div>
                        <p className="text-base font-900 text-[#1F2937]">
                          {account.name || "—"}
                        </p>
                        <p className="text-sm text-[#6B7280] mt-0.5">{account.email}</p>
                        <span className="inline-block mt-1 text-xs font-700 px-2.5 py-0.5 rounded-full bg-[#2E8B7E]/10 text-[#2E8B7E]">
                          ولي أمر
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
                      {/* Name */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-700 text-[#374151] mb-1.5">
                          <User className="w-3.5 h-3.5 text-[#2E8B7E]" />
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          value={account.name}
                          onChange={(e) => setAccount({ ...account, name: e.target.value })}
                          className="input-rtl"
                          placeholder="أدخل الاسم الكامل"
                        />
                      </div>

                      {/* Email (readonly) */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-700 text-[#374151] mb-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#2E8B7E]" />
                          البريد الإلكتروني
                          <span className="text-xs text-[#9CA3AF] font-500 mr-1">(لا يمكن التعديل)</span>
                        </label>
                        <input
                          type="email"
                          value={account.email}
                          readOnly
                          disabled
                          className="input-rtl opacity-60 cursor-not-allowed bg-[#F9FAFB]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-700 text-[#374151] mb-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#2E8B7E]" />
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          value={account.phone}
                          onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                          className="input-rtl"
                          placeholder="05XX XXX XXX"
                        />
                      </div>

                      {/* Wilaya */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-700 text-[#374151] mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E8B7E]" />
                          الولاية
                        </label>
                        <select
                          value={account.wilaya}
                          onChange={(e) => setAccount({ ...account, wilaya: e.target.value })}
                          className="input-rtl"
                        >
                          <option value="">— اختر الولاية —</option>
                          {WILAYAS.map((w) => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-1.5 text-sm font-700 text-[#374151] mb-1.5">
                          <Home className="w-3.5 h-3.5 text-[#2E8B7E]" />
                          العنوان التفصيلي
                        </label>
                        <input
                          type="text"
                          value={account.address}
                          onChange={(e) => setAccount({ ...account, address: e.target.value })}
                          className="input-rtl"
                          placeholder="مثال: حي السعادة، الجزائر العاصمة"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SECURITY TAB ── */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-900 text-[#1F2937] mb-1">تغيير كلمة المرور</h3>
                      <p className="text-xs text-[#6B7280] mb-5">
                        لحماية حسابك، تأكد من استخدام كلمة مرور قوية وفريدة
                      </p>

                      {passError && (
                        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-700 text-red-700">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {passError}
                        </div>
                      )}

                      <div className="space-y-4 max-w-sm" dir="rtl">
                        {/* Old password */}
                        <div>
                          <label className="text-sm font-700 text-[#374151] block mb-1.5">
                            كلمة المرور الحالية
                          </label>
                          <div className="relative">
                            <input
                              type={showOldPass ? "text" : "password"}
                              value={passwords.old}
                              onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                              className="input-rtl pl-10"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPass(!showOldPass)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                              {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* New password */}
                        <div>
                          <label className="text-sm font-700 text-[#374151] block mb-1.5">
                            كلمة المرور الجديدة
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPass ? "text" : "password"}
                              value={passwords.newPass}
                              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                              className="input-rtl pl-10"
                              placeholder="8 أحرف على الأقل"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {/* Strength indicator */}
                          {passwords.newPass.length > 0 && (
                            <div className="mt-2 flex gap-1">
                              {[1,2,3,4].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-colors ${
                                    passwords.newPass.length >= i * 2
                                      ? passwords.newPass.length >= 8
                                        ? "bg-emerald-400"
                                        : "bg-amber-400"
                                      : "bg-[#E8D8C4]"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Confirm password */}
                        <div>
                          <label className="text-sm font-700 text-[#374151] block mb-1.5">
                            تأكيد كلمة المرور الجديدة
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPass ? "text" : "password"}
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                              className={`input-rtl pl-10 ${
                                passwords.confirm && passwords.confirm !== passwords.newPass
                                  ? "border-red-400 focus:border-red-400"
                                  : passwords.confirm && passwords.confirm === passwords.newPass
                                  ? "border-emerald-400 focus:border-emerald-400"
                                  : ""
                              }`}
                              placeholder="أعد إدخال كلمة المرور"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-[#F0FAF9] border border-[#2E8B7E]/20 rounded-xl flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#2E8B7E] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-800 text-[#1F2937] mb-1">نصائح لكلمة مرور آمنة</p>
                        <ul className="text-xs text-[#6B7280] space-y-1">
                          <li className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${passwords.newPass.length >= 8 ? "bg-emerald-400" : "bg-[#E8D8C4]"}`} />
                            8 أحرف على الأقل
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${/[A-Z]/.test(passwords.newPass) ? "bg-emerald-400" : "bg-[#E8D8C4]"}`} />
                            تضمين حرف كبير (A-Z)
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${/[0-9]/.test(passwords.newPass) ? "bg-emerald-400" : "bg-[#E8D8C4]"}`} />
                            تضمين رقم واحد على الأقل
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── NOTIFICATIONS TAB ── */}
                {activeTab === "notifications" && (
                  <div className="space-y-2">
                    <h3 className="text-base font-900 text-[#1F2937] mb-1">تفضيلات الإشعارات</h3>
                    <p className="text-xs text-[#6B7280] mb-5">
                      اختر الإشعارات التي تريد استلامها
                    </p>
                    <div className="divide-y divide-[#F5E8D4]">
                      {Object.entries(notifications).map(([key, enabled]) => {
                        const info = notifLabels[key];
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between py-4 gap-4"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-800 text-[#1F2937]">{info.label}</p>
                              <p className="text-xs text-[#9CA3AF] mt-0.5">{info.desc}</p>
                            </div>
                            <button
                              onClick={() =>
                                setNotifications({ ...notifications, [key]: !enabled })
                              }
                              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                                enabled ? "bg-[#2E8B7E]" : "bg-[#E8D8C4]"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${
                                  enabled ? "right-1" : "left-1"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Footer */}
              <div className="px-6 py-4 border-t border-[#F5E8D4] bg-[#FAFAFA] flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-800 bg-[#2E8B7E] text-white hover:bg-[#22685e] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
