"use client";
// app/child-mode/[id]/page.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Flame, ArrowLeft, Sparkles, Trophy } from "lucide-react";
import ExitPinModal from "@/components/child-mode/ExitPinModal";

const sections = [
  {
    id: "games",
    label: "ألعاب ممتعة",
    emoji: "🎮",
    image: "/card_games.png",
    color: "#E97F6B",
    gradientFrom: "#E97F6B",
    gradientTo: "#d4624d",
    tagline: "العب وتعلم!",
    href: (id: string) => `/child-mode/${id}/games`,
  },
  {
    id: "talk",
    label: "أتكلم بالصور",
    emoji: "💬",
    image: "/card_talk.png",
    color: "#1D5B79",
    gradientFrom: "#1D5B79",
    gradientTo: "#2478a0",
    tagline: "عبّر بالصور!",
    href: (id: string) => `/child-mode/${id}/talk`,
  },
  {
    id: "rooms",
    label: "غرف نتمرّن",
    emoji: "🏠",
    image: "/card_rooms.png",
    color: "#2E8B7E",
    gradientFrom: "#2E8B7E",
    gradientTo: "#22685e",
    tagline: "تمرّن بأمان!",
    href: (id: string) => `/child-mode/${id}/rooms`,
  },
  {
    id: "stories",
    label: "قصص حلوة",
    emoji: "📖",
    image: "/card_stories.png",
    color: "#6B4C93",
    gradientFrom: "#6B4C93",
    gradientTo: "#513877",
    tagline: "اقرأ واستمتع!",
    href: (id: string) => `/child-mode/${id}/stories`,
  },
];

export default function ChildHomePage() {
  const params = useParams();
  const childId = params.id as string;
  const [child, setChild] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);

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

  if (!child)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F6] via-[#FDF6EC] to-[#FFF0EB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E97F6B]/20 animate-pulse" />
          <p className="text-[#9CA3AF] text-sm">جاري التحميل...</p>
        </div>
      </div>
    );

  const starsPercent = Math.min((child.stars / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F6] via-[#FDF6EC] to-[#FFF0EB]">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E8D8C4]/60 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => setShowExitModal(true)}
          className="w-10 h-10 rounded-2xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors cursor-pointer shadow-sm"
          title="الخروج"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Child Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-800 text-[#1F2937] leading-none">{child.name}</p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <Flame className="w-3 h-3 text-[#E97F6B]" />
                {child.streakDays} يوم
              </span>
              <span className="flex items-center gap-1 text-xs text-[#F5B942]">
                <Star className="w-3 h-3 fill-[#F5B942]" />
                {child.stars}
              </span>
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xl font-900 shadow-md"
            style={{ backgroundColor: child.avatarColor }}
          >
            {child.avatarInitial}
          </div>
        </div>
      </div>

      {/* ── Welcome Banner ──────────────────────────────── */}
      <div className="px-5 pt-7 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5B942]/15 border border-[#F5B942]/30 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
          <span className="text-xs font-800 text-[#B8860B]">يوم رائع يا بطل! ⭐</span>
        </div>
        <h1 className="text-3xl font-900 text-[#1F2937] mb-1 tracking-tight">
          مرحباً {child.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[#6B7280]">ماذا تريد أن تفعل اليوم؟</p>
      </div>

      {/* ── Stars Progress Card ─────────────────────────── */}
      <div className="mx-4 mb-6 bg-white rounded-3xl p-4 border border-[#E8D8C4]/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs font-700 text-[#6B7280]">تقدّمك هذا الأسبوع</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
            <span className="text-sm font-900 text-[#1F2937]">{child.stars}</span>
            <span className="text-xs text-[#6B7280]">/ 100</span>
          </div>
        </div>
        <div className="w-full bg-[#F5E8D4] rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${starsPercent}%`,
              background: "linear-gradient(90deg, #F5B942, #E97F6B)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-[#9CA3AF]">البداية</span>
          <span className="text-[11px] text-[#9CA3AF]">100 نجمة 🏆</span>
        </div>
      </div>

      {/* ── Activity Cards Grid ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href(childId)}
            className="group relative rounded-2xl overflow-hidden shadow-md active:scale-95 transition-transform duration-150 aspect-[4/4]"
            style={{ boxShadow: `0 5px 16px ${section.color}35` }}
          >
            {/* Background Image */}
            <Image
              src={section.image}
              alt={section.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 200px"
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${section.gradientFrom}22 0%, ${section.gradientFrom}BB 55%, ${section.gradientTo}EE 100%)`,
              }}
            />

            {/* Top Emoji Badge */}
            <div className="absolute top-3 right-3">
              <div className="w-10 h-10 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm border border-white/30">
                {section.emoji}
              </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[11px] font-600 text-white/75 mb-0.5">{section.tagline}</p>
              <h3 className="text-lg font-900 text-white leading-tight drop-shadow-sm">
                {section.label}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Streak Banner ───────────────────────────────── */}
      <div className="mx-4 mb-8 rounded-2xl overflow-hidden relative">
        <div
          className="p-4 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #FFF8EC, #FFF0E0)",
            border: "1px solid #F5B94240",
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F5B942]/20 flex items-center justify-center flex-shrink-0">
            <Flame className="w-7 h-7 text-[#E97F6B]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-900 text-[#1F2937]">
              🔥 سلسلة {child.streakDays} أيام متواصلة!
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              استمر في اللعب يومياً للحصول على مكافآت جديدة
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5B942]/20 flex items-center justify-center text-lg">
            🏅
          </div>
        </div>
      </div>

      {/* Exit PIN Modal */}
      <ExitPinModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        childId={childId}
      />
    </div>
  );
}
