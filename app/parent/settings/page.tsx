"use client";
// app/parent/settings/page.tsx
import { useState } from "react";
import { Settings, User, Lock, Bell, Shield, Save, Eye, EyeOff } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const tabs = [
  { id: "account", label: "الحساب", icon: User },
  { id: "security", label: "الأمان", icon: Lock },
  { id: "notifications", label: "الإشعارات", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [account, setAccount] = useState({
    name: "محمد بن علي",
    email: "mohammed.benali@gmail.com",
    phone: "0661 234 567",
    wilaya: "الجزائر",
    address: "حي السعادة، الجزائر",
  });

  const [passwords, setPasswords] = useState({ old: "", newPass: "", confirm: "" });

  const [notifications, setNotifications] = useState({
    newReport: true,
    newMessage: true,
    appointmentReminder: true,
    sessionCompleted: false,
    weeklyDigest: true,
    promotions: false,
  });

  const notifLabels: Record<string, string> = {
    newReport: "تقرير جديد من الأخصائي",
    newMessage: "رسالة جديدة",
    appointmentReminder: "تذكير بالمواعيد",
    sessionCompleted: "انتهاء جلسة",
    weeklyDigest: "ملخص أسبوعي",
    promotions: "العروض والترقيات",
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        subtitle="إدارة حسابك وتفضيلاتك"
        icon={Settings}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
      />

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E8D8C4] p-2 flex lg:flex-col gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-600 transition-all w-full text-right ${
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

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E8D8C4] p-6">
          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[#F5E8D4]">
                <div className="w-16 h-16 rounded-2xl bg-[#2E8B7E] flex items-center justify-center text-white text-2xl font-900">
                  م
                </div>
                <div>
                  <p className="text-base font-800 text-[#1F2937]">{account.name}</p>
                  <p className="text-sm text-[#6B7280]">{account.email}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">ولي أمر — مشترك منذ يناير 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-600 text-[#6B7280] block mb-1.5">الاسم الكامل</label>
                  <input
                    type="text"
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    className="input-rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-600 text-[#6B7280] block mb-1.5">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    className="input-rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-600 text-[#6B7280] block mb-1.5">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={account.phone}
                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                    className="input-rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-600 text-[#6B7280] block mb-1.5">الولاية</label>
                  <input
                    type="text"
                    value={account.wilaya}
                    onChange={(e) => setAccount({ ...account, wilaya: e.target.value })}
                    className="input-rtl"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-600 text-[#6B7280] block mb-1.5">العنوان</label>
                  <input
                    type="text"
                    value={account.address}
                    onChange={(e) => setAccount({ ...account, address: e.target.value })}
                    className="input-rtl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-800 text-[#1F2937] mb-4">تغيير كلمة المرور</h3>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="text-sm font-600 text-[#6B7280] block mb-1.5">كلمة المرور الحالية</label>
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
                  <div>
                    <label className="text-sm font-600 text-[#6B7280] block mb-1.5">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={passwords.newPass}
                        onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                        className="input-rtl pl-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-600 text-[#6B7280] block mb-1.5">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="input-rtl"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F5E8D4]">
                <div className="flex items-start gap-3 p-4 bg-[#F5E8D4] rounded-xl">
                  <Shield className="w-5 h-5 text-[#2E8B7E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-700 text-[#1F2937]">نصائح لكلمة مرور قوية</p>
                    <ul className="text-xs text-[#6B7280] mt-1 space-y-0.5">
                      <li>• 8 أحرف على الأقل</li>
                      <li>• تضمين أرقام وحروف كبيرة وصغيرة</li>
                      <li>• تجنب المعلومات الشخصية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="text-base font-800 text-[#1F2937] mb-4">تفضيلات الإشعارات</h3>
              {Object.entries(notifications).map(([key, enabled]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-[#F5E8D4] last:border-0"
                >
                  <span className="text-sm text-[#1F2937]">{notifLabels[key]}</span>
                  <button
                    onClick={() =>
                      setNotifications({ ...notifications, [key]: !enabled })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      enabled ? "bg-[#2E8B7E]" : "bg-[#E8D8C4]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        enabled ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 pt-4 border-t border-[#F5E8D4] flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-700 transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-[#2E8B7E] text-white hover:bg-[#22685e]"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
