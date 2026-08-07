"use client";
// app/child-mode/[id]/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Flame, Gamepad2, MessageSquare, BookOpen, Home, ArrowLeft } from "lucide-react";

const sections = [
  {
    id: "games",
    label: "ألعاب ممتعة",
    icon: Gamepad2,
    bg: "from-[#E97F6B] to-[#d4624d]",
    shadow: "shadow-[#E97F6B]/30",
    href: (id: string) => `/child-mode/${id}/games`,
  },
  {
    id: "talk",
    label: "أتكلم بالصور",
    icon: MessageSquare,
    bg: "from-[#1D5B79] to-[#2478a0]",
    shadow: "shadow-[#1D5B79]/30",
    href: (id: string) => `/child-mode/${id}/talk`,
  },
  {
    id: "rooms",
    label: "غرف نتمرّن",
    icon: Home,
    bg: "from-[#2E8B7E] to-[#22685e]",
    shadow: "shadow-[#2E8B7E]/30",
    href: (id: string) => `/child-mode/${id}/rooms`,
  },
  {
    id: "stories",
    label: "قصص حلوة",
    icon: BookOpen,
    bg: "from-[#6B4C93] to-[#513877]",
    shadow: "shadow-[#6B4C93]/30",
    href: (id: string) => `/child-mode/${id}/stories`,
  },
];

export default function ChildHomePage() {
  const params = useParams();
  const childId = params.id as string;
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/child/${childId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          setChild(res.data);
        } else {
          setChild({
            name: "الطفل",
            avatarColor: "#E97F6B",
            avatarInitial: "ط",
            stars: 0,
            streakDays: 1,
          });
        }
      })
      .catch(() => {
        setChild({
          name: "الطفل",
          avatarColor: "#E97F6B",
          avatarInitial: "ط",
          stars: 0,
          streakDays: 1,
        });
      });
  }, [childId]);

  if (!child) return <div className="min-h-screen p-12 text-center text-[#9CA3AF]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F6] via-[#FDF6EC] to-[#FFF0EB]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between">
        <Link
          href="/parent/children"
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Child Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-800 text-[#1F2937] leading-none">
              {child.name}
            </p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <Flame className="w-3 h-3 text-[#E97F6B]" />
                {child.streakDays} يوم
              </span>
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                {child.stars} نجمة
              </span>
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xl font-900 shadow"
            style={{ backgroundColor: child.avatarColor }}
          >
            {child.avatarInitial}
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl font-900 text-[#1F2937] mb-1">
          مرحباً {child.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-[#6B7280]">ماذا تريد أن تفعل اليوم؟</p>
      </div>

      {/* Stars Progress */}
      <div className="mx-4 mb-8 bg-white rounded-2xl p-4 border border-[#E8D8C4] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#6B7280]">تقدمك هذا الأسبوع</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[#F5B942] fill-[#F5B942]" />
            <span className="text-sm font-800 text-[#1F2937]">{child.stars} نجمة</span>
          </div>
        </div>
        <div className="w-full bg-[#F5E8D4] rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-[#F5B942] to-[#E97F6B] h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min((child.stars / 100) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[#9CA3AF]">0</span>
          <span className="text-xs text-[#9CA3AF]">100 نجمة</span>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.href(childId)}
              className={`bg-gradient-to-br ${section.bg} rounded-3xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg ${section.shadow} active:scale-95 transition-transform duration-150 aspect-square`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Icon className="w-9 h-9 text-white" />
              </div>
              <span className="text-lg font-800 text-white text-center leading-tight">
                {section.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Streak Badge */}
      <div className="mx-4 mb-8 bg-gradient-to-r from-[#F5B942]/10 to-[#E97F6B]/10 rounded-2xl p-4 border border-[#F5B942]/20 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#F5B942]/20 flex items-center justify-center flex-shrink-0">
          <Flame className="w-6 h-6 text-[#E97F6B]" />
        </div>
        <div>
          <p className="text-sm font-800 text-[#1F2937]">
            سلسلة {child.streakDays} أيام متواصلة
          </p>
          <p className="text-xs text-[#6B7280]">
            استمر في اللعب اليومي للحفاظ على سلسلتك
          </p>
        </div>
      </div>
    </div>
  );
}
