"use client";
// app/child-mode/[id]/talk/page.tsx
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Volume2, Sparkles, RotateCcw } from "lucide-react";

const categories = [
  { id: "feelings", label: "مشاعري" },
  { id: "needs",    label: "حاجياتي" },
  { id: "food",     label: "طعام" },
  { id: "games",    label: "ألعاب" },
  { id: "family",   label: "عائلتي" },
  { id: "actions",  label: "أفعال" },
  { id: "places",   label: "أماكن" },
  { id: "clothes",  label: "ملابسي" },
  { id: "school",   label: "المدرسة" },
];

const pictograms: Record<string, { id: string; label: string; icon: string }[]> = {
  feelings: [
    { id: "happy",     label: "سعيد",     icon: "😄" },
    { id: "sad",       label: "حزين",     icon: "😢" },
    { id: "angry",     label: "غاضب",     icon: "😠" },
    { id: "scared",    label: "خائف",     icon: "😨" },
    { id: "tired",     label: "متعب",     icon: "😴" },
    { id: "excited",   label: "متحمس",    icon: "🤩" },
    { id: "calm",      label: "هادئ",     icon: "😌" },
    { id: "confused",  label: "محتار",    icon: "😕" },
    { id: "shy",       label: "خجول",     icon: "🫣" },
    { id: "sick",      label: "مريض",     icon: "🤒" },
    { id: "proud",     label: "فخور",     icon: "🦁" },
    { id: "surprised", label: "متفاجئ",   icon: "😲" },
    { id: "brave",     label: "شجاع",     icon: "🦸‍♂️" },
    { id: "safe",      label: "آمن",      icon: "🛡️" },
    { id: "nervous",   label: "متوتر",    icon: "😬" },
    { id: "loved",     label: "محبوب",    icon: "💖" },
  ],
  needs: [
    { id: "water",   label: "ماء",      icon: "💧" },
    { id: "eat",     label: "أكل",      icon: "🍽️" },
    { id: "toilet",  label: "دورة مياه", icon: "🚻" },
    { id: "sleep",   label: "نوم",      icon: "🛌" },
    { id: "hug",     label: "عناق",     icon: "🤗" },
    { id: "quiet",   label: "هدوء",     icon: "🤫" },
    { id: "help",    label: "مساعدة",   icon: "🙋" },
    { id: "stop",    label: "توقف",     icon: "✋" },
    { id: "medicine",label: "دواء",     icon: "💊" },
    { id: "wash",    label: "غسيل اليدين", icon: "🧼" },
    { id: "charger", label: "شاحن",     icon: "🔌" },
    { id: "rest",    label: "راحة",     icon: "🛋️" },
    { id: "umbrella",label: "مظلة",     icon: "☂️" },
    { id: "tissue",  label: "منديل",    icon: "🧻" },
    { id: "listen",  label: "استماع",   icon: "🎧" },
    { id: "bandage", label: "ألم",      icon: "🩹" },
  ],
  food: [
    { id: "apple",    label: "تفاح",    icon: "🍎" },
    { id: "banana",   label: "موز",     icon: "🍌" },
    { id: "bread",    label: "خبز",     icon: "🍞" },
    { id: "milk",     label: "حليب",    icon: "🥛" },
    { id: "rice",     label: "أرز",     icon: "🍚" },
    { id: "chicken",  label: "دجاج",    icon: "🍗" },
    { id: "cookies",  label: "بسكويت",  icon: "🍪" },
    { id: "juice",    label: "عصير",    icon: "🥤" },
    { id: "egg",      label: "بيض",     icon: "🥚" },
    { id: "cheese",   label: "جبن",     icon: "🧀" },
    { id: "pizza",    label: "بيتزا",   icon: "🍕" },
    { id: "fries",    label: "بطاطس",   icon: "🍟" },
    { id: "cucumber", label: "خيار",    icon: "🥒" },
    { id: "tomato",   label: "طماطم",   icon: "🍅" },
    { id: "cake",     label: "كعك",     icon: "🎂" },
    { id: "icecream", label: "مثلجات",  icon: "🍦" },
  ],
  games: [
    { id: "ball",    label: "كرة",      icon: "⚽" },
    { id: "puzzle",  label: "ألغاز",    icon: "🧩" },
    { id: "car",     label: "سيارة",    icon: "🚗" },
    { id: "book",    label: "كتاب",     icon: "📚" },
    { id: "paint",   label: "رسم",      icon: "🎨" },
    { id: "music",   label: "موسيقى",   icon: "🎵" },
    { id: "blocks",  label: "مكعبات",   icon: "🧱" },
    { id: "phone",   label: "تلفون",    icon: "📱" },
    { id: "teddy",   label: "دمية",     icon: "🧸" },
    { id: "plane",   label: "طائرة",    icon: "✈️" },
    { id: "bike",    label: "دراجة",    icon: "🚲" },
    { id: "slide",   label: "زحليقة",   icon: "🛝" },
    { id: "gamepad", label: "لعبة فيديو", icon: "🎮" },
    { id: "bubbles", label: "فقاعات",   icon: "🫧" },
    { id: "crayons", label: "ألوان",    icon: "🖍️" },
    { id: "clay",    label: "صلصال",    icon: "🏺" },
  ],
  family: [
    { id: "mom",     label: "أمي",      icon: "👩" },
    { id: "dad",     label: "أبي",      icon: "👨" },
    { id: "brother", label: "أخي",      icon: "👦" },
    { id: "sister",  label: "أختي",     icon: "👧" },
    { id: "grandpa", label: "جدي",      icon: "👴" },
    { id: "grandma", label: "جدتي",     icon: "👵" },
    { id: "baby",    label: "طفل",      icon: "👶" },
    { id: "friend",  label: "صديقي",    icon: "🧑‍🤝‍🧑" },
    { id: "teacher", label: "معلمتي",   icon: "👩‍🏫" },
    { id: "doctor",  label: "طبيبي",    icon: "🧑‍⚕️" },
    { id: "uncle",   label: "عمي",      icon: "🧔" },
    { id: "aunt",    label: "عمتي",     icon: "🧕" },
  ],
  actions: [
    { id: "walk",    label: "أمشي",     icon: "🚶" },
    { id: "run",     label: "أركض",     icon: "🏃" },
    { id: "swim",    label: "أسبح",     icon: "🏊" },
    { id: "play",    label: "ألعب",     icon: "🎮" },
    { id: "listen",  label: "أسمع",     icon: "🎧" },
    { id: "look",    label: "أنظر",     icon: "👁️" },
    { id: "read",    label: "أقرأ",     icon: "📖" },
    { id: "write",   label: "أكتب",     icon: "✍️" },
    { id: "wash",    label: "أغسل",     icon: "🧼" },
    { id: "cook",    label: "أطبخ",     icon: "🍳" },
    { id: "laugh",   label: "أضحك",     icon: "🤣" },
    { id: "dance",   label: "أرقص",     icon: "💃" },
  ],
  places: [
    { id: "home",      label: "البيت",     icon: "🏠" },
    { id: "school",    label: "المدرسة",   icon: "🏫" },
    { id: "clinic",    label: "العيادة",   icon: "🏥" },
    { id: "barber",    label: "الحلاق",    icon: "💇" },
    { id: "park",      label: "الحديقة",   icon: "🌳" },
    { id: "shop",      label: "المتجر",    icon: "🛒" },
    { id: "mosque",    label: "المسجد",    icon: "🕌" },
    { id: "beach",     label: "الشاطئ",    icon: "🏖️" },
    { id: "stadium",   label: "الملعب",    icon: "🏟️" },
    { id: "funfair",   label: "الملاهي",   icon: "🎡" },
  ],
  clothes: [
    { id: "shirt",     label: "قميص",     icon: "👕" },
    { id: "pants",     label: "بنطال",    icon: "👖" },
    { id: "shoes",     label: "حذاء",     icon: "👟" },
    { id: "socks",     label: "جورب",     icon: "🧦" },
    { id: "cap",       label: "قبعة",     icon: "🧢" },
    { id: "coat",      label: "معطف",     icon: "🧥" },
    { id: "glasses",   label: "نظارة",    icon: "👓" },
    { id: "dress",     label: "فستان",    icon: "👗" },
    { id: "watch",     label: "ساعة",     icon: "⌚" },
    { id: "bag",       label: "حقيبة",    icon: "🎒" },
  ],
  school: [
    { id: "pencil",    label: "قلم",      icon: "✏️" },
    { id: "notebook",  label: "كراسة",    icon: "📓" },
    { id: "bag",       label: "حقيبة",    icon: "🎒" },
    { id: "scissors",  label: "مقص",      icon: "✂️" },
    { id: "desk",      label: "طاولة",    icon: "🪑" },
    { id: "board",     label: "سبورة",    icon: "🛹" },
    { id: "colors",    label: "ألوان",    icon: "🎨" },
    { id: "ruler",     label: "مسطرة",    icon: "📏" },
    { id: "book",      label: "كتاب",     icon: "📚" },
    { id: "bell",      label: "جرس",      icon: "🔔" },
  ],
};

const colors: Record<string, string> = {
  feelings: "#E97F6B",
  needs:    "#1D5B79",
  food:     "#2E8B7E",
  games:    "#6B4C93",
  family:   "#F59E0B",
  actions:  "#EC4899",
  places:   "#06B6D4",
  clothes:  "#8B5CF6",
  school:   "#10B981",
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



  const accentColor = colors[activeCategory] || "#1D5B79";

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">أتكلم بالصور (PECS)</h1>
        <div className="w-9" />
      </div>

      {/* Sentence Builder */}
      <div className="mx-4 mt-4 mb-3 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border-2 border-[#E8D8C4] p-3.5 min-h-[80px] flex items-center gap-2 flex-wrap shadow-sm">
          {sentence.length === 0 ? (
            <span className="text-[#9CA3AF] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              اضغط على الصور لبناء جملتك والتحدث...
            </span>
          ) : (
            sentence.map((word, idx) => (
              <button
                key={idx}
                onClick={() => removeWord(idx)}
                className="bg-[#F5E8D4] text-[#1F2937] px-3.5 py-1.5 rounded-xl text-sm font-800 flex items-center gap-1.5 hover:bg-[#E8D8C4] transition-colors shadow-sm animate-in zoom-in-95 duration-150"
              >
                <span>{word}</span>
                <X className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            ))
          )}
        </div>
        <div className="flex gap-2.5 mt-2.5">
          <button
            onClick={clearSentence}
            className="flex-1 py-2.5 rounded-xl bg-[#F5E8D4] text-[#6B7280] text-sm font-700 hover:bg-[#E8D8C4] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            مسح الكل
          </button>
          <button
            disabled
            className="flex-1 py-2.5 rounded-xl bg-[#F5E8D4] text-[#9CA3AF] text-sm font-800 flex items-center justify-center gap-2 cursor-not-allowed border-2 border-dashed border-[#E8D8C4]"
          >
            <Volume2 className="w-4 h-4" />
            نطق الجملة — قريباً
          </button>
        </div>
      </div>

      {/* Category Tabs Header */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-800 transition-all ${
                  isSelected
                    ? "text-white shadow-md scale-105"
                    : "bg-white border border-[#E8D8C4] text-[#6B7280] hover:bg-[#FDF6EC]"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: colors[cat.id] }
                    : {}
                }
              >
                {cat.label}
                <span className="mr-1 text-[10px] opacity-80">
                  ({pictograms[cat.id]?.length || 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pictogram Grid */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-8 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
          {(pictograms[activeCategory] || []).map((item) => (
            <button
              key={item.id}
              onClick={() => addWord(item.label)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-[#E8D8C4] active:scale-95 transition-all hover:border-opacity-100 shadow-sm hover:shadow-md cursor-pointer aspect-square"
              style={{ borderColor: `${accentColor}40` }}
            >
              <span className="text-4xl leading-none select-none">{item.icon}</span>
              <span className="text-sm font-800 text-[#1F2937] text-center leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
