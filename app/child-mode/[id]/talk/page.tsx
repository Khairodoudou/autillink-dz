"use client";
// app/child-mode/[id]/talk/page.tsx
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Volume2 } from "lucide-react";

const categories = [
  { id: "feelings", label: "مشاعري" },
  { id: "needs",    label: "حاجياتي" },
  { id: "food",     label: "طعام" },
  { id: "games",    label: "ألعاب" },
];

const pictograms: Record<string, { id: string; label: string; icon: string }[]> = {
  feelings: [
    { id: "happy",    label: "سعيد",    icon: "😄" },
    { id: "sad",      label: "حزين",    icon: "😢" },
    { id: "angry",    label: "غاضب",    icon: "😠" },
    { id: "scared",   label: "خائف",    icon: "😨" },
    { id: "tired",    label: "متعب",    icon: "😴" },
    { id: "excited",  label: "متحمس",   icon: "🤩" },
    { id: "calm",     label: "هادئ",    icon: "😌" },
    { id: "confused", label: "محتار",   icon: "😕" },
  ],
  needs: [
    { id: "water",  label: "ماء",     icon: "💧" },
    { id: "eat",    label: "أكل",     icon: "🍽️" },
    { id: "toilet", label: "دورة مياه", icon: "🚻" },
    { id: "sleep",  label: "نوم",     icon: "🛌" },
    { id: "hug",    label: "عناق",    icon: "🤗" },
    { id: "quiet",  label: "هدوء",    icon: "🤫" },
    { id: "help",   label: "مساعدة",  icon: "🙋" },
    { id: "stop",   label: "توقف",    icon: "✋" },
  ],
  food: [
    { id: "apple",   label: "تفاح",   icon: "🍎" },
    { id: "banana",  label: "موز",    icon: "🍌" },
    { id: "bread",   label: "خبز",    icon: "🍞" },
    { id: "milk",    label: "حليب",   icon: "🥛" },
    { id: "rice",    label: "أرز",    icon: "🍚" },
    { id: "chicken", label: "دجاج",   icon: "🍗" },
    { id: "cookies", label: "بسكويت", icon: "🍪" },
    { id: "juice",   label: "عصير",   icon: "🥤" },
  ],
  games: [
    { id: "ball",   label: "كرة",     icon: "⚽" },
    { id: "puzzle", label: "ألغاز",   icon: "🧩" },
    { id: "car",    label: "سيارة",   icon: "🚗" },
    { id: "book",   label: "كتاب",    icon: "📚" },
    { id: "paint",  label: "رسم",     icon: "🎨" },
    { id: "music",  label: "موسيقى",  icon: "🎵" },
    { id: "blocks", label: "مكعبات",  icon: "🧱" },
    { id: "phone",  label: "تلفون",   icon: "📱" },
  ],
};

// NOTE: we use icon characters here as placeholder pictogram visuals only.
// In production these would be proper SVG illustrations.

const colors: Record<string, string> = {
  feelings: "#E97F6B",
  needs: "#1D5B79",
  food: "#2E8B7E",
  games: "#6B4C93",
};

export default function TalkPage() {
  const params = useParams();
  const childId = params.id as string;
  const [activeCategory, setActiveCategory] = useState("feelings");
  const [sentence, setSentence] = useState<string[]>([]);

  const addWord = (word: string) => {
    setSentence((prev) => [...prev, word]);
  };

  const removeWord = (idx: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearSentence = () => setSentence([]);

  const accentColor = colors[activeCategory];

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">أتكلم بالصور</h1>
        <div className="w-9" />
      </div>

      {/* Sentence Builder */}
      <div className="mx-4 mt-4 mb-3">
        <div className="bg-white rounded-2xl border-2 border-[#E8D8C4] p-3 min-h-[72px] flex items-center gap-2 flex-wrap">
          {sentence.length === 0 ? (
            <span className="text-[#9CA3AF] text-sm">اضغط على الصور لبناء جملتك...</span>
          ) : (
            sentence.map((word, idx) => (
              <button
                key={idx}
                onClick={() => removeWord(idx)}
                className="bg-[#F5E8D4] text-[#1F2937] px-3 py-1 rounded-full text-sm font-600 flex items-center gap-1 hover:bg-[#E8D8C4] transition-colors"
              >
                {word}
                <X className="w-3 h-3 text-[#6B7280]" />
              </button>
            ))
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={clearSentence}
            className="flex-1 py-2 rounded-xl bg-[#F5E8D4] text-[#6B7280] text-sm font-600 hover:bg-[#E8D8C4] transition-colors"
          >
            مسح الكل
          </button>
          <button
            className="flex-1 py-2 rounded-xl text-white text-sm font-600 flex items-center justify-center gap-2 transition-opacity"
            style={{ backgroundColor: accentColor }}
          >
            <Volume2 className="w-4 h-4" />
            نطق الجملة
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-700 transition-all ${
              activeCategory === cat.id
                ? "text-white shadow-md"
                : "bg-white border border-[#E8D8C4] text-[#6B7280]"
            }`}
            style={
              activeCategory === cat.id
                ? { backgroundColor: colors[cat.id] }
                : {}
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Pictogram Grid */}
      <div className="grid grid-cols-4 gap-3 px-4 pb-8">
        {pictograms[activeCategory].map((item) => (
          <button
            key={item.id}
            onClick={() => addWord(item.label)}
            className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border-2 border-[#E8D8C4] active:scale-95 transition-transform hover:border-opacity-60 shadow-sm"
            style={{ borderColor: `${accentColor}30` }}
          >
            <span className="text-3xl leading-none">{item.icon}</span>
            <span className="text-xs font-700 text-[#1F2937] text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
