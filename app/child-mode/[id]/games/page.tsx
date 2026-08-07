"use client";
// app/child-mode/[id]/games/page.tsx
import { useState, useCallback } from "react";
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
  Hash,
  Brain,
  Compass,
  Pencil,
  Layers,
  Music,
  Sparkles,
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
    description: "صنّف الأشكال الهندسية واختر الشكل الصحيح بسرعة!",
    icon: Shapes,
    color: "#1D5B79",
    bg: "#1D5B7915",
    level: "متوسط",
    duration: "5 دقائق",
    playable: true,
  },
  {
    id: "count-stars",
    title: "عدّ النجوم",
    description: "عدّ النجوم الظاهرة واختر العدد الصحيح!",
    icon: Hash,
    color: "#F5B942",
    bg: "#F5B94215",
    level: "سهل",
    duration: "3 دقائق",
    playable: true,
  },
  {
    id: "animal-sounds",
    title: "أصوات الحيوانات",
    description: "اسمع صوت الحيوان وخمّن اسمه الصحيح والتمييز السمعي.",
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
    description: "تعرّف على مشاعر الوجوه والتعابير العاطفية والتواصل.",
    icon: SmilePlus,
    color: "#6B4C93",
    bg: "#6B4C9315",
    level: "متوسط",
    duration: "5 دقائق",
    playable: false,
  },
  {
    id: "memory-cards",
    title: "ذاكرة الصور",
    description: "اعثر على بطاقات الصور المتطابقة واختبر قوة الذاكرة والتركيز.",
    icon: Brain,
    color: "#EC4899",
    bg: "#EC489915",
    level: "متوسط",
    duration: "5 دقائق",
    playable: false,
  },
  {
    id: "maze-challenge",
    title: "متاهة المغامرة",
    description: "وجّه الشخصية واكتشف المسار الصحيح للخروج من المتاهة.",
    icon: Compass,
    color: "#8B5CF6",
    bg: "#8B5CF615",
    level: "متوسط",
    duration: "6 دقائق",
    playable: false,
  },
  {
    id: "letter-tracing",
    title: "تتبع الحروف والأرقام",
    description: "ارسم وتتبع النقاط لرسم الحروف والأرقام بطريقة ممتعة.",
    icon: Pencil,
    color: "#06B6D4",
    bg: "#06B6D415",
    level: "سهل",
    duration: "4 دقائق",
    playable: false,
  },
  {
    id: "story-sequence",
    title: "ترتيب تسلسل القصة",
    description: "رتب الأحداث والصور حسب التسلسل المنطقي والزمني.",
    icon: Layers,
    color: "#10B981",
    bg: "#10B98115",
    level: "متوسط",
    duration: "5 دقائق",
    playable: false,
  },
  {
    id: "piano-melodies",
    title: "أنغام البيانو والموسيقى",
    description: "عزف نغمات الموسيقى اللطيفة والتعرف على الأصوات.",
    icon: Music,
    color: "#F43F5E",
    bg: "#F43F5E15",
    level: "سهل",
    duration: "3 دقائق",
    playable: false,
  },
];

// ─── Color Match Game ─────────────────────────────────────────────────────────

const colorItems = [
  { id: "red",    label: "أحمر",    color: "#EF4444" },
  { id: "blue",   label: "أزرق",    color: "#3B82F6" },
  { id: "green",  label: "أخضر",    color: "#22C55E" },
  { id: "yellow", label: "أصفر",    color: "#EAB308" },
  { id: "purple", label: "بنفسجي", color: "#A855F7" },
  { id: "orange", label: "برتقالي", color: "#F97316" },
];

function ColorMatchGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);

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
      if (current + 1 >= colorItems.length) setDone(true);
      else setCurrent((c) => c + 1);
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
        <h2 className="text-2xl font-900 text-[#1F2937] mb-2">أحسنت! 🎉</h2>
        <p className="text-[#6B7280] mb-6">نتيجتك: {score} من {colorItems.length}</p>
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1 text-sm text-[#6B7280]">
          <Star className="w-4 h-4 text-[#F5B942]" />
          <span>{score}</span>
        </div>
        <div className="text-sm text-[#6B7280]">{current + 1} / {colorItems.length}</div>
      </div>
      <div className="w-full bg-[#E8D8C4] rounded-full h-2 mb-8">
        <div
          className="bg-[#E97F6B] h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / colorItems.length) * 100}%` }}
        />
      </div>
      <div className="flex flex-col items-center mb-8">
        <p className="text-[#6B7280] text-sm mb-3">ما اسم هذا اللون؟</p>
        <div className="w-32 h-32 rounded-3xl shadow-lg" style={{ backgroundColor: correct.color }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let btnStyle = "bg-white border-2 border-[#E8D8C4] text-[#1F2937]";
          if (feedback) {
            if (opt.id === correct.id) btnStyle = "bg-green-50 border-2 border-green-400 text-green-700";
            else if (feedback === "wrong") btnStyle = "bg-red-50 border-2 border-red-300 text-red-600 opacity-60";
          }
          return (
            <button
              key={opt.id}
              onClick={() => answer(opt.id)}
              className={`py-4 rounded-2xl text-base font-700 flex items-center justify-center gap-2 transition-all active:scale-95 ${btnStyle}`}
            >
              {feedback && opt.id === correct.id && <CheckCircle className="w-4 h-4 text-green-500" />}
              {feedback && opt.id !== correct.id && <X className="w-4 h-4 text-red-400 opacity-60" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shape Sort Game ──────────────────────────────────────────────────────────

type ShapeType = "circle" | "square" | "triangle" | "diamond" | "star" | "hexagon";

interface ShapeItem {
  id: string;
  shape: ShapeType;
  label: string;
  color: string;
}

const shapeItems: ShapeItem[] = [
  { id: "circle",   shape: "circle",   label: "دائرة",    color: "#EF4444" },
  { id: "square",   shape: "square",   label: "مربع",     color: "#3B82F6" },
  { id: "triangle", shape: "triangle", label: "مثلث",     color: "#22C55E" },
  { id: "diamond",  shape: "diamond",  label: "معيّن",    color: "#A855F7" },
  { id: "star",     shape: "star",     label: "نجمة",     color: "#F5B942" },
  { id: "hexagon",  shape: "hexagon",  label: "سداسي",    color: "#F97316" },
];

function ShapeDisplay({ shape, color, size = 96 }: { shape: ShapeType; color: string; size?: number }) {
  const s = size;
  const half = s / 2;
  switch (shape) {
    case "circle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={half} cy={half} r={half - 4} fill={color} />
        </svg>
      );
    case "square":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect x={6} y={6} width={s - 12} height={s - 12} rx={6} fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${half},6 ${s - 6},${s - 6} 6,${s - 6}`} fill={color} />
        </svg>
      );
    case "diamond":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={`${half},4 ${s - 4},${half} ${half},${s - 4} 4,${half}`} fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <text x={half} y={half + s * 0.15} textAnchor="middle" fontSize={s * 0.7} fill={color}>
            ★
          </text>
        </svg>
      );
    case "hexagon":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (Math.PI / 180) * (60 * i - 30);
              const r = half - 6;
              return `${half + r * Math.cos(a)},${half + r * Math.sin(a)}`;
            }).join(" ")}
            fill={color}
          />
        </svg>
      );
  }
}

function ShapeSortGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);

  // Shuffle order once per mount using a stable seed approach
  const [order] = useState(() => [...shapeItems].sort(() => Math.random() - 0.5));

  const correct = order[current];
  const options = useCallback((): ShapeItem[] => {
    const shuffled = [...shapeItems].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!shuffled.find((o) => o.id === correct.id)) {
      shuffled[0] = correct;
      shuffled.sort(() => Math.random() - 0.5);
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])();

  const answer = (id: string) => {
    if (feedback) return;
    const isCorrect = id === correct.id;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= order.length) setDone(true);
      else setCurrent((c) => c + 1);
    }, 1000);
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
        <div className="w-20 h-20 rounded-full bg-[#1D5B79]/15 flex items-center justify-center mb-4">
          <Star className="w-10 h-10 text-[#1D5B79]" />
        </div>
        <h2 className="text-2xl font-900 text-[#1F2937] mb-2">رائع جداً! 🎉</h2>
        <p className="text-[#6B7280] mb-6">نتيجتك: {score} من {order.length}</p>
        <button
          onClick={restart}
          className="px-8 py-3 bg-[#1D5B79] text-white rounded-full font-700 shadow hover:bg-[#174a62] transition-colors"
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-sm text-[#6B7280]">
          <Star className="w-4 h-4 text-[#F5B942]" />
          <span>{score}</span>
        </div>
        <div className="text-sm text-[#6B7280]">{current + 1} / {order.length}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#D6E8F0] rounded-full h-2 mb-8">
        <div
          className="bg-[#1D5B79] h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / order.length) * 100}%` }}
        />
      </div>

      {/* Shape Display */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[#6B7280] text-sm mb-4">ما اسم هذا الشكل؟</p>
        <div
          className={`w-36 h-36 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            feedback === "correct"
              ? "ring-4 ring-green-400 ring-offset-2 scale-105"
              : feedback === "wrong"
              ? "ring-4 ring-red-400 ring-offset-2 scale-95"
              : ""
          }`}
          style={{ backgroundColor: `${correct.color}20` }}
        >
          <ShapeDisplay shape={correct.shape} color={correct.color} size={90} />
        </div>
        {feedback === "correct" && (
          <p className="mt-3 text-green-600 font-700 text-sm animate-bounce">✅ ممتاز!</p>
        )}
        {feedback === "wrong" && (
          <p className="mt-3 text-red-500 font-700 text-sm">❌ حاول مرة أخرى</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let cls = "bg-white border-2 border-[#D6E8F0] text-[#1F2937]";
          if (feedback) {
            if (opt.id === correct.id) cls = "bg-green-50 border-2 border-green-400 text-green-700";
            else if (feedback === "wrong") cls = "bg-red-50 border-2 border-red-200 text-red-500 opacity-50";
          }
          return (
            <button
              key={opt.id}
              onClick={() => answer(opt.id)}
              className={`py-4 rounded-2xl text-base font-700 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${cls}`}
            >
              {feedback && opt.id === correct.id && <CheckCircle className="w-4 h-4 text-green-500" />}
              {feedback && opt.id !== correct.id && feedback === "wrong" && (
                <X className="w-4 h-4 text-red-400" />
              )}
              <ShapeDisplay shape={opt.shape} color={opt.color} size={24} />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Count Stars Game ─────────────────────────────────────────────────────────

interface CountRound {
  count: number;
  options: number[];
}

function generateRound(): CountRound {
  const count = Math.floor(Math.random() * 9) + 1; // 1–9
  const optionSet = new Set<number>([count]);
  while (optionSet.size < 4) {
    const n = Math.floor(Math.random() * 9) + 1;
    optionSet.add(n);
  }
  const options = [...optionSet].sort(() => Math.random() - 0.5);
  return { count, options };
}

const TOTAL_COUNT_ROUNDS = 6;

function CountStarsGame({ onBack }: { onBack: () => void }) {
  const [rounds] = useState<CountRound[]>(() =>
    Array.from({ length: TOTAL_COUNT_ROUNDS }, generateRound)
  );
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const round = rounds[current];

  const answer = (n: number) => {
    if (feedback) return;
    setSelected(n);
    const isCorrect = n === round.count;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (current + 1 >= TOTAL_COUNT_ROUNDS) setDone(true);
      else setCurrent((c) => c + 1);
    }, 1000);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFeedback(null);
    setSelected(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5B942]/20 flex items-center justify-center mb-4 text-4xl">
          🌟
        </div>
        <h2 className="text-2xl font-900 text-[#1F2937] mb-2">أحسنت العدّ! 🎉</h2>
        <p className="text-[#6B7280] mb-6">نتيجتك: {score} من {TOTAL_COUNT_ROUNDS}</p>
        <button
          onClick={restart}
          className="px-8 py-3 bg-[#F5B942] text-white rounded-full font-700 shadow hover:bg-[#e0a830] transition-colors"
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-sm text-[#6B7280]">
          <Star className="w-4 h-4 text-[#F5B942] fill-[#F5B942]" />
          <span>{score}</span>
        </div>
        <div className="text-sm text-[#6B7280]">{current + 1} / {TOTAL_COUNT_ROUNDS}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F5B942]/20 rounded-full h-2 mb-6">
        <div
          className="bg-[#F5B942] h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / TOTAL_COUNT_ROUNDS) * 100}%` }}
        />
      </div>

      <p className="text-[#6B7280] text-sm text-center mb-4">كم عدد النجوم؟</p>

      {/* Stars Display */}
      <div
        className={`mx-auto bg-[#F5B942]/10 border-2 border-[#F5B942]/30 rounded-3xl p-6 mb-8 flex flex-wrap justify-center items-center gap-2 max-w-xs min-h-[130px] transition-all ${
          feedback === "correct" ? "ring-4 ring-green-400 ring-offset-2" : ""
        }`}
      >
        {Array.from({ length: round.count }).map((_, i) => (
          <span key={i} className="text-3xl leading-none select-none" style={{ animation: `bounce ${0.5 + i * 0.05}s ease-in-out infinite alternate` }}>
            ⭐
          </span>
        ))}
      </div>

      {feedback === "correct" && (
        <p className="text-center text-green-600 font-700 text-sm mb-3 animate-pulse">✅ إجابة صحيحة!</p>
      )}
      {feedback === "wrong" && (
        <p className="text-center text-red-500 font-700 text-sm mb-3">❌ الإجابة الصحيحة هي {round.count}</p>
      )}

      {/* Number Options */}
      <div className="grid grid-cols-2 gap-3">
        {round.options.map((n) => {
          let cls =
            "bg-white border-2 border-[#F5B942]/30 text-[#1F2937] hover:border-[#F5B942]";
          if (feedback) {
            if (n === round.count) cls = "bg-green-50 border-2 border-green-400 text-green-700";
            else if (n === selected && feedback === "wrong") cls = "bg-red-50 border-2 border-red-300 text-red-500 opacity-60";
          }
          return (
            <button
              key={n}
              onClick={() => answer(n)}
              className={`py-5 rounded-2xl text-3xl font-900 transition-all active:scale-95 shadow-sm ${cls}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Game Shell ───────────────────────────────────────────────────────────────

function GameShell({
  title,
  color,
  onClose,
  children,
}: {
  title: string;
  color: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-800" style={{ color }}>{title}</h1>
        <div className="w-9" />
      </div>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GamesPage() {
  const params = useParams();
  const childId = params.id as string;
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === "color-match") {
    return (
      <GameShell title="مطابقة الألوان" color="#E97F6B" onClose={() => setActiveGame(null)}>
        <ColorMatchGame onBack={() => setActiveGame(null)} />
      </GameShell>
    );
  }

  if (activeGame === "shape-sort") {
    return (
      <GameShell title="ترتيب الأشكال" color="#1D5B79" onClose={() => setActiveGame(null)}>
        <ShapeSortGame onBack={() => setActiveGame(null)} />
      </GameShell>
    );
  }

  if (activeGame === "count-stars") {
    return (
      <GameShell title="عدّ النجوم" color="#F5B942" onClose={() => setActiveGame(null)}>
        <CountStarsGame onBack={() => setActiveGame(null)} />
      </GameShell>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
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
              <div key={game.id} className="bg-white rounded-2xl border border-[#E8D8C4] p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: game.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: game.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-800 text-[#1F2937]">{game.title}</h3>
                      {game.playable ? (
                        <span
                          className="text-[10px] font-800 px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: game.color }}
                        >
                          متاح
                        </span>
                      ) : (
                        <span className="text-[10px] font-800 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          قريباً
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">{game.description}</p>
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
                      style={game.playable ? { backgroundColor: game.color } : {}}
                    >
                      {game.playable ? "ابدأ اللعب الآن ←" : "قريباً..."}
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
