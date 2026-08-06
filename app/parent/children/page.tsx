"use client";
// app/parent/children/page.tsx
import { useState } from "react";
import Link from "next/link";
import { UserPlus, LogIn, Star, Flame, Activity, ChevronLeft, Check, Sparkles, Lock, Palette } from "lucide-react";
import { mockChildren } from "@/lib/mock-data";
import type { Child } from "@/lib/mock-data";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import { Users } from "lucide-react";

const levelColors: Record<string, { bg: string; text: string; label: string }> = {
  خفيف:  { bg: "#2E8B7E15", text: "#2E8B7E", label: "خفيف" },
  متوسط: { bg: "#F5B94215", text: "#b8860b", label: "متوسط" },
  شديد:  { bg: "#E97F6B15", text: "#d4624d", label: "شديد" },
};

const colorPresets = [
  { color: "#E97F6B", label: "مرجاني" },
  { color: "#2E8B7E", label: "زمردي" },
  { color: "#6B4C93", label: "بنفسجي" },
  { color: "#1D5B79", label: "أزرق كحلي" },
  { color: "#F5B942", label: "ذهبي" },
  { color: "#EC4899", label: "وردي" },
];

export default function ChildrenPage() {
  const [childrenList, setChildrenList] = useState<Child[]>(mockChildren);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: 5,
    birthDate: "2021-05-10",
    pin: "1234",
    diagnosisLevel: "متوسط" as "خفيف" | "متوسط" | "شديد",
    avatarColor: "#2E8B7E",
    specialistName: "د. سارة كمال",
    centerName: "مركز الأمل لرعاية التوحد — الجزائر العاصمة",
  });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const initial = formData.name.trim()[0];
    const newChild: Child = {
      id: `child-${Date.now()}`,
      name: formData.name.trim(),
      age: Number(formData.age),
      birthDate: formData.birthDate,
      pin: formData.pin || "1234",
      avatarColor: formData.avatarColor,
      avatarInitial: initial,
      parentId: "parent-001",
      specialistName: formData.specialistName,
      centerName: formData.centerName,
      diagnosisLevel: formData.diagnosisLevel,
      joinDate: new Date().toISOString().split("T")[0],
      stars: 0,
      streakDays: 1,
      lastActivity: "الآن",
      stats: {
        mood: 4,
        sleep: 8,
        tantrums: 0,
        newWords: 0,
        exercises: 0,
        appointments: 0,
      },
      weeklyMood: [4, 4, 4, 4, 4, 4, 4],
      weeklySleep: [8, 8, 8, 8, 8, 8, 8],
    };

    setChildrenList((prev) => [...prev, newChild]);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      setShowAddModal(false);
      // Reset form
      setFormData({
        name: "",
        age: 5,
        birthDate: "2021-05-10",
        pin: "1234",
        diagnosisLevel: "متوسط",
        avatarColor: "#2E8B7E",
        specialistName: "د. سارة كمال",
        centerName: "مركز الأمل لرعاية التوحد — الجزائر العاصمة",
      });
    }, 1200);
  };

  return (
    <div>
      <PageHeader
        title="أطفالي"
        subtitle="إدارة ملفات أطفالك ودخول وضع الطفل"
        icon={Users}
        iconColor="#2E8B7E"
        iconBg="#2E8B7E15"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E8B7E] text-white rounded-xl text-sm font-700 hover:bg-[#22685e] transition-all active:scale-95 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            إضافة طفل
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {childrenList.map((child) => {
          const level = levelColors[child.diagnosisLevel] ?? levelColors["متوسط"];
          return (
            <div
              key={child.id}
              className="bg-white rounded-2xl border border-[#E8D8C4] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Top Color Bar */}
              <div
                className="h-2"
                style={{ backgroundColor: child.avatarColor }}
              />

              <div className="p-6">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-900 shadow-md"
                    style={{ backgroundColor: child.avatarColor }}
                  >
                    {child.avatarInitial}
                  </div>
                  <div>
                    <h2 className="text-lg font-800 text-[#1F2937]">{child.name}</h2>
                    <p className="text-sm text-[#6B7280]">{child.age} سنوات</p>
                    <span
                      className="inline-block mt-1 text-xs font-700 px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: level.bg, color: level.text }}
                    >
                      {level.label}
                    </span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center bg-[#FDF6EC] rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
                    </div>
                    <p className="text-base font-900 text-[#1F2937]">{child.stars}</p>
                    <p className="text-xs text-[#6B7280]">نجمة</p>
                  </div>
                  <div className="text-center bg-[#FDF6EC] rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="w-3.5 h-3.5 text-[#E97F6B]" />
                    </div>
                    <p className="text-base font-900 text-[#1F2937]">{child.streakDays}</p>
                    <p className="text-xs text-[#6B7280]">يوم</p>
                  </div>
                  <div className="text-center bg-[#FDF6EC] rounded-xl py-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="w-3.5 h-3.5 text-[#2E8B7E]" />
                    </div>
                    <p className="text-base font-900 text-[#1F2937]">{child.stats.exercises}</p>
                    <p className="text-xs text-[#6B7280]">تمارين</p>
                  </div>
                </div>

                {/* Specialist Info */}
                <div className="bg-[#F5E8D4] rounded-xl p-3 mb-5">
                  <p className="text-xs text-[#6B7280] mb-0.5">الأخصائي المتابع</p>
                  <p className="text-sm font-700 text-[#1F2937]">{child.specialistName}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{child.centerName}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/parent/children/${child.id}/enter-pin`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-700 text-white transition-all active:scale-95 hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: child.avatarColor }}
                  >
                    <LogIn className="w-4 h-4" />
                    دخول وضع الطفل
                  </Link>
                  <button className="w-11 h-11 rounded-xl border border-[#E8D8C4] flex items-center justify-center text-[#6B7280] hover:bg-[#F5E8D4] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Child Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-[#E8D8C4] rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-[#9CA3AF] hover:border-[#2E8B7E] hover:text-[#2E8B7E] transition-all group min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="w-7 h-7" />
          </div>
          <span className="text-sm font-700">إضافة طفل جديد</span>
        </button>
      </div>

      {/* MODAL: إضافة طفل جديد */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة طفل جديد إلى العائلة"
        size="lg"
      >
        {successMsg ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 bg-[#2E8B7E]/15 rounded-full flex items-center justify-center mx-auto text-[#2E8B7E] animate-bounce">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-900 text-[#1F2937]">تمت إضافة الطفل بنجاح!</h3>
            <p className="text-sm text-[#6B7280]">تم إنشاء ملف الطفل ورمز PIN بنجاح</p>
          </div>
        ) : (
          <form onSubmit={handleAddChild} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-700 text-[#1F2937] block mb-1.5">اسم الطفل الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: أيمن بن علي"
                    className="w-full input-rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-700 text-[#1F2937] block mb-1.5">العمر (سنوات) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={18}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full input-rtl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-700 text-[#1F2937] block mb-1.5">تاريخ الميلاد</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full input-rtl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-700 text-[#1F2937] block mb-1.5">مستوى التشخيص *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["خفيف", "متوسط", "شديد"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, diagnosisLevel: lvl })}
                        className={`py-2 rounded-xl text-xs font-800 transition-all border-2 ${
                          formData.diagnosisLevel === lvl
                            ? "border-[#2E8B7E] bg-[#2E8B7E]/10 text-[#2E8B7E]"
                            : "border-[#E8D8C4] text-[#6B7280] hover:bg-[#F5E8D4]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-700 text-[#1F2937] flex items-center justify-between mb-1.5">
                    <span>رمز PIN الخاص بوضع الطفل</span>
                    <span className="text-xs text-[#9CA3AF] flex items-center gap-1 font-400">
                      <Lock className="w-3 h-3" /> 4 أرقام
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                    placeholder="1234"
                    className="w-full input-rtl font-mono tracking-widest text-center text-lg font-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-700 text-[#1F2937] flex items-center gap-1 mb-2">
                    <Palette className="w-4 h-4 text-[#2E8B7E]" />
                    <span>لون الملف المفضل</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarColor: preset.color })}
                        className={`w-9 h-9 rounded-xl transition-all relative flex items-center justify-center ${
                          formData.avatarColor === preset.color
                            ? "scale-110 shadow-md ring-2 ring-offset-2 ring-[#1F2937]"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {formData.avatarColor === preset.color && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Card Preview */}
              <div className="bg-[#FDF6EC] p-5 rounded-2xl border border-[#E8D8C4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-800 text-[#2E8B7E] mb-3 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> معاينة ملف الطفل
                  </div>

                  {/* Card Simulation */}
                  <div className="bg-white rounded-2xl border border-[#E8D8C4] shadow-sm overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: formData.avatarColor }} />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-900 shadow-sm"
                          style={{ backgroundColor: formData.avatarColor }}
                        >
                          {formData.name.trim() ? formData.name.trim()[0] : "؟"}
                        </div>
                        <div>
                          <h4 className="text-sm font-800 text-[#1F2937]">
                            {formData.name.trim() || "اسم الطفل"}
                          </h4>
                          <p className="text-xs text-[#6B7280]">{formData.age} سنوات</p>
                          <span
                            className="inline-block mt-0.5 text-[10px] font-700 px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: levelColors[formData.diagnosisLevel].bg,
                              color: levelColors[formData.diagnosisLevel].text,
                            }}
                          >
                            {formData.diagnosisLevel}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#F5E8D4] rounded-lg p-2 text-xs text-[#6B7280]">
                        <p className="font-700 text-[#1F2937]">{formData.specialistName}</p>
                        <p className="text-[10px] truncate">{formData.centerName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E8D8C4] text-xs text-[#6B7280] space-y-1">
                  <p>• سيتم إنشاء رمز PIN تلقائياً لدخول وضع الطفل.</p>
                  <p>• يمكن للأخصائي تعديل التقارير والتطورات فور الإضافة.</p>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D8C4]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E8D8C4] text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2E8B7E] text-white text-sm font-800 hover:bg-[#22685e] transition-all shadow-sm active:scale-95"
              >
                حفظ وإضافة الطفل
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
