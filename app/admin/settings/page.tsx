"use client";
// app/admin/settings/page.tsx
import { useState } from "react";
import { Settings, Shield, Lock, Save, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function AdminSettingsPage() {
  const [permissions, setPermissions] = useState({
    parentCanMessageSpecialist: true,
    specialistCanCreateAssessments: true,
    centerAdminCanApproveSpecialists: false,
    publicCanViewPricing: true,
    automaticChildPinRequirement: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="إعدادات النظام والأذونات"
        subtitle="التحكم في الصلاحيات والإعدادات العامة للمنصة"
        icon={Settings}
        iconColor="#6B4C93"
        iconBg="#6B4C9315"
      />

      <div className="bg-white rounded-2xl border border-[#E5D9F2] p-6 shadow-sm max-w-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5D9F2] pb-4">
          <Shield className="w-6 h-6 text-[#6B4C93]" />
          <h2 className="text-base font-800 text-[#1F2937]">إعدادات الصلاحيات العامة</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "parentCanMessageSpecialist", label: "السماح لأولياء الأمور بمراسلة الأخصائي مباشرة" },
            { key: "specialistCanCreateAssessments", label: "تفعيل إنشاء التقييمات المتقدمة للأخصائيين" },
            { key: "centerAdminCanApproveSpecialists", label: "سماح لمديري المراكز باعتتماد أخصائيين جدد دون مراجعة" },
            { key: "publicCanViewPricing", label: "عرض خطط الأسعار في الواجهة العامة" },
            { key: "automaticChildPinRequirement", label: "فرض رمز PIN إجباري عند الانتقال لوضع الطفل" },
          ].map(({ key, label }) => {
            const active = permissions[key as keyof typeof permissions];
            return (
              <div
                key={key}
                className="flex items-center justify-between py-2.5 border-b border-[#F5F0FA] last:border-0"
              >
                <span className="text-sm font-600 text-[#1F2937]">{label}</span>
                <button
                  onClick={() => toggle(key as keyof typeof permissions)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    active ? "bg-[#6B4C93]" : "bg-[#E5D9F2]"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      active ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#E5D9F2] flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-700 transition-all ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-[#6B4C93] text-white hover:bg-[#583d7a]"
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "تم الحفظ بنجاح" : "حفظ الإعدادات"}
          </button>
        </div>
      </div>
    </div>
  );
}
