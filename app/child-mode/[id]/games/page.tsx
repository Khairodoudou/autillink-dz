"use client";
// app/child-mode/[id]/games/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Shapes,
  Palette,
  Volume2,
  SmilePlus,
  Clock,
  BarChart3,
  Star,
  CheckCircle,
  X,
} from "lucide-react";

const games = [
  {
    id: "color-match",
    title: "مطابقة الألوان",
    description: "طابق كل لون مع اسمه الصحيح بسرعة وممتعة!",
    icon: Palette,
    color: "#E97F6B",
    bg: "#E97F6B15",
    level: "سهل",
    duration: "3 دقائق",
    playable: true,
  },
  {
    id: "shape-sort",
    title: "ترتيب الأشكال",
    description: "صنّف الأشكال الهندسية حسب لونها وحجمها.",
    icon: Shapes,
    color: "#1D5B79",
    bg: "#1D5B7915",
    level: "متوسط",
    duration: "5 دقائق",
    playable: false,
  },
  {
    id: "animal-sounds",
    title: "أصوات الحيوانات",
    description: "اسمع صوت الحيوان وخمّن اسمه الصحيح.",
    icon: Volume2,
    color: "#2E8B7E",
    bg: "#2E8B7E15",
    level: "سهل",
    duration: "4 دقائق",
    playable: false,
  },
  {
    id: "face-feelings",
    title: "وجوه المشاعر",
    description: "تعرّف على مشاعر الوجوه وعبّر عنها بالكلمات.",
    icon: SmilePlus,
    color: "#6B4C93",
    bg: "#6B4C9315",
    level: "متوسط",
    duration: "5 دقائق",
    playable: false,
  },
];

// Mini-game: Color Match
const colorItems = [
  { id: "red",    label: "أحمر",  color: "#EF4444" },
  { id: "blue",   label: "أزرق",  color: "#3B82F6" },
  { id: "green",  label: "أخضر",  color: "#22C55E" },
  { id: "yellow", label: "أصفر",  color: "#EAB308" },
  { id: "purple", label: "بنفسجي", color: "#A855F7" },
  { id: "orange", label: "برتقالي", color: "#F97316" },
];

function ColorMatchGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);

  // Shuffle options each round
  const correct = colorItems[current];
  const options = [...colorItems].sort(() => Math.random() - 0.5).slice(0, 4);
  if (!options.find((o) => o.id === correct.id)) {
    options[0] = correct;
    options.sort(() => Math.random() - 0.5);
  }

  const answer = (id: string) => {
    if (feedback) return;
    const isCorrect = id === correct.id;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= colorItems.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 900);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFeedback(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5B942]/20 flex items-center justify-center mb-4">
          <Star className="w-10 h-10 text-[#F5B942] fill-[#F5B942]" />
        </div>
        <h2 className="text-2xl font-900 text-[#1F2937] mb-2">
          أحسنت!
        </h2>
        <p className="text-[#6B7280] mb-6">
          نتيجتك: {score} من {colorItems.length}
        </p>
        <button
          onClick={restart}
          className="px-8 py-3 bg-[#E97F6B] text-white rounded-full font-700 shadow hover:bg-[#d4624d] transition-colors"
        >
          العب مجدداً
        </button>
        <button onClick={onBack} className="mt-3 text-sm text-[#6B7280] hover:text-[#1F2937]">
          العودة إلى الألعاب
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Score & Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1 text-sm text-[#6B7280]">
          <Star className="w-4 h-4 text-[#F5B942]" />
          <span>{score}</span>
        </div>
        <div className="text-sm text-[#6B7280]">
          {current + 1} / {colorItems.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E8D8C4] rounded-full h-2 mb-8">
        <div
          className="bg-[#E97F6B] h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / colorItems.length) * 100}%` }}
        />
      </div>

      {/* Color Display */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[#6B7280] text-sm mb-3">ما اسم هذا اللون؟</p>
        <div
          className="w-32 h-32 rounded-3xl shadow-lg"
          style={{ backgroundColor: correct.color }}
        />
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let btnStyle = "bg-white border-2 border-[#E8D8C4] text-[#1F2937]";
          if (feedback) {
            if (opt.id === correct.id) {
              btnStyle = "bg-green-50 border-2 border-green-400 text-green-700";
            } else if (opt.id !== correct.id && feedback === "wrong") {
              btnStyle = "bg-red-50 border-2 border-red-300 text-red-600 opacity-60";
            }
          }
          return (
            <button
              key={opt.id}
              onClick={() => answer(opt.id)}
              className={`py-4 rounded-2xl text-base font-700 flex items-center justify-center gap-2 transition-all active:scale-95 ${btnStyle}`}
            >
              {feedback && opt.id === correct.id && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {feedback && opt.id !== correct.id && (
                <X className="w-4 h-4 text-red-400 opacity-60" />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function GamesPage() {
  const params = useParams();
  const childId = params.id as string;
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === "color-match") {
    return (
      <div className="min-h-screen bg-[#FDF6EC]">
        <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setActiveGame(null)}
            className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-800 text-[#1F2937]">مطابقة الألوان</h1>
          <div className="w-9" />
        </div>
        <ColorMatchGame onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">ألعاب ممتعة</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-6 pb-8">
        <p className="text-sm text-[#6B7280] text-center mb-6">
          اختر لعبتك المفضلة وابدأ التسلية
        </p>
        <div className="space-y-4">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-white rounded-2xl border border-[#E8D8C4] p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: game.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: game.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-800 text-[#1F2937] mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {game.level}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <Clock className="w-3.5 h-3.5" />
                        {game.duration}
                      </span>
                    </div>
                    <button
                      onClick={() => game.playable && setActiveGame(game.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-700 transition-all active:scale-95 ${
                        game.playable
                          ? "text-white shadow hover:opacity-90"
                          : "bg-[#F5E8D4] text-[#9CA3AF] cursor-not-allowed"
                      }`}
                      style={
                        game.playable ? { backgroundColor: game.color } : {}
                      }
                    >
                      {game.playable ? "ابدأ اللعب الآن" : "قريباً"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
