"use client";
// app/parent/children/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, LogIn, Star, Flame, Activity, Check, Sparkles, Lock, Palette, Edit3, Trash2, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";

const levelColors: Record<string, { bg: string; text: string; label: string }> = {
  "خفيف":  { bg: "#2E8B7E15", text: "#2E8B7E", label: "خفيف" },
  "متوسط": { bg: "#F5B94215", text: "#b8860b", label: "متوسط" },
  "شديد":  { bg: "#E97F6B15", text: "#d4624d", label: "شديد" },
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
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChild, setEditingChild] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadChildren = () => {
    setLoading(true);
    fetch("/api/parent/children")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setChildrenList(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChildren();
  }, []);

  // Add Form State
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

  // Edit Form State
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    age: 5,
    birthDate: "",
    pin: "",
    diagnosisLevel: "متوسط" as "خفيف" | "متوسط" | "شديد",
    avatarColor: "#2E8B7E",
  });

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await fetch("/api/parent/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMsg(true);
        loadChildren();
        setTimeout(() => {
          setSuccessMsg(false);
          setShowAddModal(false);
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
      }
    } catch (err) {
      console.error("Failed to add child", err);
    }
  };

  const openEditModal = (child: any) => {
    setEditingChild(child);
    setEditData({
      id: child.id,
      name: child.name,
      age: child.age,
      birthDate: child.birthDate || "2021-05-10",
      pin: "", // Leave blank to keep existing PIN
      diagnosisLevel: child.diagnosisLevel || "متوسط",
      avatarColor: child.avatarColor || "#2E8B7E",
    });
  };

  const handleEditChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.name.trim() || !editData.id) return;

    try {
      const res = await fetch(`/api/parent/children/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setEditSuccessMsg(true);
        loadChildren();
        setTimeout(() => {
          setEditSuccessMsg(false);
          setEditingChild(null);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to update child info", err);
    }
  };

  const handleDeleteChild = async (id: string, name: string) => {
    if (!confirm(`هل أنت تأكد من إمكانية حذف ملف الطفل "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/parent/children/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEditingChild(null);
        loadChildren();
      }
    } catch (err) {
      console.error("Failed to delete child", err);
    }
  };

  return (
    <div>
      <PageHeader
        title="أطفالي"
        subtitle="إدارة وتعديل ملفات أطفالك ودخول وضع الطفل"
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
              className="bg-white rounded-2xl border border-[#E8D8C4] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Top Color Bar */}
                <div
                  className="h-2.5"
                  style={{ backgroundColor: child.avatarColor }}
                />

                <div className="p-6">
                  {/* Avatar + Name + Edit button */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-900 shadow-md flex-shrink-0"
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

                    <button
                      onClick={() => openEditModal(child)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E8D8C4] text-xs font-700 text-[#1D5B79] bg-[#1D5B79]/5 hover:bg-[#1D5B79]/15 transition-colors"
                      title="تعديل ملف الطفل"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
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
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-2">
                <Link
                  href={`/parent/children/${child.id}/enter-pin`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-700 text-white transition-all active:scale-95 hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  <LogIn className="w-4 h-4" />
                  دخول وضع الطفل
                </Link>
                <button
                  onClick={() => openEditModal(child)}
                  className="w-11 h-11 rounded-xl border border-[#E8D8C4] flex items-center justify-center text-[#1D5B79] hover:bg-[#F5E8D4] transition-colors"
                  title="تعديل معلومات الطفل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
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

      {/* MODAL 1: إضافة طفل جديد */}
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

      {/* MODAL 2: تعديل بيانات الطفل */}
      <Modal
        isOpen={Boolean(editingChild)}
        onClose={() => setEditingChild(null)}
        title={`تعديل ملف الطفل: ${editingChild?.name || ""}`}
        size="lg"
      >
        {editSuccessMsg ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 bg-[#2E8B7E]/15 rounded-full flex items-center justify-center mx-auto text-[#2E8B7E] animate-bounce">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-900 text-[#1F2937]">تم التحديث بنجاح!</h3>
            <p className="text-sm text-[#6B7280]">تم تحديث معلومات الطفل بنجاح</p>
          </div>
        ) : (
          <form onSubmit={handleEditChild} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Edit Form Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-700 text-[#1F2937] block mb-1.5">اسم الطفل الكامل *</label>
                  <input
                    type="text"
                    required
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
                      value={editData.age}
                      onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })}
                      className="w-full input-rtl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-700 text-[#1F2937] block mb-1.5">تاريخ الميلاد</label>
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
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
                        onClick={() => setEditData({ ...editData, diagnosisLevel: lvl })}
                        className={`py-2 rounded-xl text-xs font-800 transition-all border-2 ${
                          editData.diagnosisLevel === lvl
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
                    <span>تغيير رمز PIN (اختياري)</span>
                    <span className="text-xs text-[#9CA3AF] flex items-center gap-1 font-400">
                      <Lock className="w-3 h-3" /> اتركه فارغاً للحفاظ على القديم
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editData.pin}
                    onChange={(e) => setEditData({ ...editData, pin: e.target.value.replace(/\D/g, "") })}
                    placeholder="رمز جديد (مثال: 5678)"
                    className="w-full input-rtl font-mono tracking-widest text-center text-lg font-700"
                  />
                </div>

                <div>
                  <label className="text-sm font-700 text-[#1F2937] flex items-center gap-1 mb-2">
                    <Palette className="w-4 h-4 text-[#2E8B7E]" />
                    <span>تغيير لون الملف</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => setEditData({ ...editData, avatarColor: preset.color })}
                        className={`w-9 h-9 rounded-xl transition-all relative flex items-center justify-center ${
                          editData.avatarColor === preset.color
                            ? "scale-110 shadow-md ring-2 ring-offset-2 ring-[#1F2937]"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {editData.avatarColor === preset.color && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Edit Preview */}
              <div className="bg-[#FDF6EC] p-5 rounded-2xl border border-[#E8D8C4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-800 text-[#2E8B7E] mb-3 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> معاينة التعديلات
                  </div>

                  <div className="bg-white rounded-2xl border border-[#E8D8C4] shadow-sm overflow-hidden">
                    <div className="h-2.5" style={{ backgroundColor: editData.avatarColor }} />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-900 shadow-sm"
                          style={{ backgroundColor: editData.avatarColor }}
                        >
                          {editData.name.trim() ? editData.name.trim()[0] : "؟"}
                        </div>
                        <div>
                          <h4 className="text-sm font-800 text-[#1F2937]">
                            {editData.name.trim() || "اسم الطفل"}
                          </h4>
                          <p className="text-xs text-[#6B7280]">{editData.age} سنوات</p>
                          <span
                            className="inline-block mt-0.5 text-[10px] font-700 px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: levelColors[editData.diagnosisLevel].bg,
                              color: levelColors[editData.diagnosisLevel].text,
                            }}
                          >
                            {editData.diagnosisLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E8D8C4] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteChild(editData.id, editData.name)}
                    className="flex items-center gap-1.5 text-xs font-800 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الملف
                  </button>
                  <span className="text-xs text-[#9CA3AF]">معرّف الملف: {editData.id}</span>
                </div>
              </div>
            </div>

            {/* Edit Form Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D8C4]">
              <button
                type="button"
                onClick={() => setEditingChild(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E8D8C4] text-sm font-700 text-[#6B7280] hover:bg-[#F5E8D4] transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2E8B7E] text-white text-sm font-800 hover:bg-[#22685e] transition-all shadow-sm active:scale-95"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
