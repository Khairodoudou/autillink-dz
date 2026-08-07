"use client";
// app/child-mode/[id]/stories/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Sparkles,
  Volume2,
} from "lucide-react";

interface StoryPageItem {
  pageNumber: number;
  emoji: string;
  text: string;
}

interface StoryItem {
  id: string;
  title: string;
  description: string;
  color: string;
  bg: string;
  badge: string | null;
  readable?: boolean;
  content: StoryPageItem[];
}

const storiesData: StoryItem[] = [
  {
    id: "story-001",
    title: "يوم آدم في المدرسة",
    description:
      "قصة عن يوم مميز في المدرسة حيث تعلم آدم كيف يتعرف على أصدقاء جدد.",
    color: "#E97F6B",
    bg: "#E97F6B15",
    badge: "مفضلة",
    content: [
      {
        pageNumber: 1,
        emoji: "🎒",
        text: "استيقظ آدم بنشاط، وارتدى ملابسه المدرسية الملونة وهو يبتسم.",
      },
      {
        pageNumber: 2,
        emoji: "🚌",
        text: "ركب آدم حافلة المدرسة الصفراء وسلّم على السائق والأصدقاء بابتسامة.",
      },
      {
        pageNumber: 3,
        emoji: "🏫",
        text: "وصل آدم إلى المدرسة، ووجدت معلمته اللطيفة ترحب به عند الباب بطلب دافئ.",
      },
      {
        pageNumber: 4,
        emoji: "🪑",
        text: "جلس آدم في مقعده، وفتح كراسته ليرسم أشجاراً وزهوراً مبهجة مع المعلمة.",
      },
      {
        pageNumber: 5,
        emoji: "🍎",
        text: "في وقت الاستراحة، شارك آدم وجبته اللذيذة مع صديقه الجديد سامي.",
      },
      {
        pageNumber: 6,
        emoji: "⚽",
        text: "لعب آدم وسامي بالكرة الملونة في ساحة المدرسة واستمتعا كثيراً.",
      },
      {
        pageNumber: 7,
        emoji: "📚",
        text: "تعلمنا في نهاية اليوم كيف نحترم الآخرين ونساعد أصدقاءنا بطلب ولطف.",
      },
      {
        pageNumber: 8,
        emoji: "🌟",
        text: "عاد آدم إلى البيت مسروراً وحكى لوالديه عن يومه المميز والرائع!",
      },
    ],
  },
  {
    id: "story-002",
    title: "المشاعر الجميلة",
    description:
      "رحلة ممتعة مع مشاعرنا — الفرح والحزن والغضب — وكيف نعبّر عنها.",
    color: "#1D5B79",
    bg: "#1D5B7915",
    badge: "جديد",
    content: [
      {
        pageNumber: 1,
        emoji: "😊",
        text: "المشاعر هي ما نشعر به في قلوبنا، وكل مشاعرنا مهمة وطبيعية جداً!",
      },
      {
        pageNumber: 2,
        emoji: "😃",
        text: "السعادة تجعلنا نبتسم ونشعر بالدفء والنشاط كالشمس المشرقة الدافئة.",
      },
      {
        pageNumber: 3,
        emoji: "😢",
        text: "الحزن يأتي أحياناً، وعندما نحزن يمكننا التحدث مع الوالدين أو أخذ حضن دافئ.",
      },
      {
        pageNumber: 4,
        emoji: "😡",
        text: "الغضب يجعلنا ننزعج، ولكن التنفس العميق والعدّ إلى 5 يساعدنا لنتهدأ.",
      },
      {
        pageNumber: 5,
        emoji: "🤝",
        text: "عندما نفهم مشاعرنا، يمكننا التعبير عنها بالكلمات والهدوء بطلب ولطف.",
      },
      {
        pageNumber: 6,
        emoji: "💖",
        text: "أنت رائع وتستطيع دائماً مشاركة مشاعرك مع من تحبهم وثوقاً بنفسك!",
      },
    ],
  },
  {
    id: "story-003",
    title: "حيوانات الغابة",
    description:
      "قصة عن حيوانات الغابة وأصواتها الجميلة. تعلم معنا أسماء الحيوانات.",
    color: "#2E8B7E",
    bg: "#2E8B7E15",
    badge: null,
    content: [
      {
        pageNumber: 1,
        emoji: "🦁",
        text: "في الغابة الخضراء الساحرة، يعيش الأسد القوي وهو يزأر بحكمة ولطف!",
      },
      {
        pageNumber: 2,
        emoji: "🐘",
        text: "الفيل اللطيف بخرطومه الطويل يحب اللعب بالماء والرش على الأصدقاء.",
      },
      {
        pageNumber: 3,
        emoji: "🐒",
        text: "القرد النشيط يقفز بين الأشجار الخضراء ويأكل الموز اللذيذ بفرح.",
      },
      {
        pageNumber: 4,
        emoji: "🦒",
        text: "الزرافة الطويلة تستطيع الأكل من أعلى أغصان الأشجار العالية الملونة.",
      },
      {
        pageNumber: 5,
        emoji: "🐰",
        text: "الأرنب السريع يقفز في الحقول ويحب أكل الجزر الطازج المنعش.",
      },
      {
        pageNumber: 6,
        emoji: "🐼",
        text: "الباندا المحبوب ينام بهدوء ويأكل خشب الخيزران الأخضر الممتع.",
      },
      {
        pageNumber: 7,
        emoji: "🦜",
        text: "الببغاء الملون يغرد بكلمات ممتعة ويطير بين الزهور الجميلة.",
      },
      {
        pageNumber: 8,
        emoji: "🐢",
        text: "السلحفاة الصبورة تمشي بهدوء وتحمل بيتها الصغير على ظهرها بحب.",
      },
      {
        pageNumber: 9,
        emoji: "🐬",
        text: "الدلفين الذكي يقفز فوق أمواج البحر الزرقاء بكل مرح وحيوية.",
      },
      {
        pageNumber: 10,
        emoji: "🌟",
        text: "كل الحيوانات تعيش بتناغم وجمال، والتعرف عليها ممتع ومفيد جداً!",
      },
    ],
  },
  {
    id: "story-004",
    title: "سوبر طفل",
    description: "أنت البطل! قصة عن طفل شجاع تغلب على خوفه وساعد أصدقاءه.",
    color: "#6B4C93",
    bg: "#6B4C9315",
    badge: "رائج",
    content: [
      {
        pageNumber: 1,
        emoji: "🦸‍♂️",
        text: "أنت طفل مميز وتملك قوى خارقة في المحاولة والتعلم والاجتهاد!",
      },
      {
        pageNumber: 2,
        emoji: "💡",
        text: "القوة الأولى هي الفضول وحب الاستكشاف والتفكير في أفكار ذكية.",
      },
      {
        pageNumber: 3,
        emoji: "❤️",
        text: "القوة الثانية هي الطيبة ومساعدة الآخرين بابتسامة صادقة ولطيفة.",
      },
      {
        pageNumber: 4,
        emoji: "🛡️",
        text: "عندما تواجه صعوبة، السوبر طفل يتنفس بهدوء ويحاول مرة أخرى دون استسلام.",
      },
      {
        pageNumber: 5,
        emoji: "🎨",
        text: "السوبر طفل يعبر عن خياله بالرسم واللعب والابتكار الجميل.",
      },
      {
        pageNumber: 6,
        emoji: "🤝",
        text: "الشجاعة هي أن نجرب أشياء جديدة ونتغلب على الخوف بثقة وتفاؤل.",
      },
      {
        pageNumber: 7,
        emoji: "🌟",
        text: "أنت بطل كل يوم بالتعاون والاجتهاد والابتسامة المشرقة دائماً!",
      },
    ],
  },
  {
    id: "story-005",
    title: "يوم في المستشفى",
    description: "لا تخف من الطبيب! تعلم ماذا يحدث عند زيارة الطبيب بطريقة ممتعة.",
    color: "#F5B942",
    bg: "#F5B94215",
    badge: null,
    content: [
      {
        pageNumber: 1,
        emoji: "🏥",
        text: "العيادة والمستشفى مكان آمن أُعدّ لمساعدتنا ونموّنا بصحة وأمان.",
      },
      {
        pageNumber: 2,
        emoji: "🩺",
        text: "الطبيب والممرض أصدقاء لطاف يرتدون معاطف بيضاء نظيفة ويسلمون عليك.",
      },
      {
        pageNumber: 3,
        emoji: "🌡️",
        text: "قياس الحرارة والفحص أمر سريع ومهم للاطمئنان على صحتك وقوتك.",
      },
      {
        pageNumber: 4,
        emoji: "🍎",
        text: "الأكل الصحي والنوم الباكر يجعل جسمك قوياً وشجاعاً ومفعماً بالنشاط.",
      },
      {
        pageNumber: 5,
        emoji: "💊",
        text: "الدواء الموصوف يجعلك تشعر بالراحة والاستعادة بسرعة ولطف.",
      },
      {
        pageNumber: 6,
        emoji: "🎈",
        text: "في نهاية الفحص، يبتسم الطبيب ويعطيك بالوناً ملوناً أو ملصق أبطال!",
      },
      {
        pageNumber: 7,
        emoji: "🛋️",
        text: "الراحة في البيت مع المشروبات الدافئة تساعدك لتكون بنشاط وصحة.",
      },
      {
        pageNumber: 8,
        emoji: "😃",
        text: "الابتسامة والطمأنينة هي أفضل طريقة لتتغلب على أي خوف بسهولة.",
      },
      {
        pageNumber: 9,
        emoji: "🌟",
        text: "أنت شجاع وقوي دائماً في كل موقف يخوضه الأبطال!",
      },
    ],
  },
  {
    id: "story-006",
    title: "رحلة الفضاء والتلسكوب",
    description: "رحلة مشوقة بين النجوم والكواكب والتعرف على المجموعة الشمسية.",
    color: "#3B82F6",
    bg: "#3B82F615",
    badge: "جديد",
    content: [
      {
        pageNumber: 1,
        emoji: "🚀",
        text: "في ليلة صافية، نظر رامي عبر التلسكوب وشاهد النجوم المتلألئة في السماء.",
      },
      {
        pageNumber: 2,
        emoji: "🌕",
        text: "القمر المنير يبتسم في السماء، ويدور حول كوكبنا الأرض بهدوء وجمال.",
      },
      {
        pageNumber: 3,
        emoji: "🪐",
        text: "كوكب زحل المذهل يملك حلقات ملونة رائعة تدور حوله بنظام بديع.",
      },
      {
        pageNumber: 4,
        emoji: "☀️",
        text: "الشمس الذهبية هي نجمة كبيرة تعطينا الضوء والدفء كل صباح.",
      },
      {
        pageNumber: 5,
        emoji: "🛰️",
        text: "المكوك الفضائي ينطلق كالصاروخ ليحلق ويلتقط صوراً للكواكب البعيدة.",
      },
      {
        pageNumber: 6,
        emoji: "👨‍🚀",
        text: "رائد الفضاء يرتدي بدلة بيضاء آمنة ويسبح في الفضاء بخفة وسعادة.",
      },
      {
        pageNumber: 7,
        emoji: "🌍",
        text: "كوكبنا الأرض هو الكوكب الأزرق الجميل الذي نحبه ونحافظ على بيئته.",
      },
      {
        pageNumber: 8,
        emoji: "🌟",
        text: "الكون واسع ومليء بالأسرار والعلوم الشيقة التي نتعلمها بالاجتهاد!",
      },
    ],
  },
  {
    id: "story-007",
    title: "سرّ الغابة السحرية",
    description: "مغامرة استكشافية للتعرف على النباتات والورود والأشجار النادرة.",
    color: "#10B981",
    bg: "#10B98115",
    badge: "قريباً",
    readable: false,
    content: [],
  },
  {
    id: "story-008",
    title: "صديقي الآلي الذكي",
    description: "قصة تفاعلية عن بناء صديق آلي يتعلم مساعدة الناس والمشاركة.",
    color: "#EC4899",
    bg: "#EC489915",
    badge: "قريباً",
    readable: false,
    content: [],
  },
  {
    id: "story-009",
    title: "مدينة الألوان والموسيقى",
    description: "عالم مليء بالألوان والأنغام الموسيقية وتنمية الذوق الفني.",
    color: "#8B5CF6",
    bg: "#8B5CF615",
    badge: "قريباً",
    readable: false,
    content: [],
  },
];

export default function StoriesPage() {
  const params = useParams();
  const childId = params.id as string;

  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setPageIndex(0);
    setIsFinished(false);
  };

  const activeStory = activeStoryId
    ? storiesData.find((s) => s.id === activeStoryId)
    : null;

  const handleNextPage = () => {
    if (!activeStory) return;
    if (pageIndex + 1 >= activeStory.content.length) {
      setIsFinished(true);
    } else {
      setPageIndex((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
  };

  // Active Reader View
  if (activeStory) {
    if (isFinished) {
      return (
        <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 animate-bounce shadow">
            <Award className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-900 text-[#1F2937] mb-2">
            أنهيت القصة بنجاح! 📖🎉
          </h2>
          <p className="text-[#6B7280] mb-6 max-w-sm">
            أحسنت القراءة يا بطل! أنهيت قصة{" "}
            <span className="font-800 text-[#1F2937]">
              "{activeStory.title}"
            </span>{" "}
            وحصلت على +5 نجوم قراءة مضافة لرصيدك!
          </p>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-full mb-8 text-amber-900 text-sm font-800">
            <Star className="w-5 h-5 text-[#F5B942] fill-[#F5B942]" />
            <span>+5 نجوم قراءة مضافة</span>
          </div>

          <button
            onClick={() => setActiveStoryId(null)}
            className="px-8 py-3.5 bg-[#E97F6B] text-white font-800 rounded-2xl shadow-lg hover:bg-[#d4624d] transition-colors"
          >
            العودة إلى قائمة القصص
          </button>
        </div>
      );
    }

    const currentPage = activeStory.content[pageIndex];
    const totalPages = activeStory.content.length;

    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col justify-between">
        {/* Reader Header */}
        <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setActiveStoryId(null)}
            className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-800 text-[#1F2937]">
              {activeStory.title}
            </h1>
            <p className="text-[11px] text-[#6B7280]">
              الصفحة {pageIndex + 1} من {totalPages}
            </p>
          </div>
          <div className="w-9" />
        </div>

        {/* Story Reading Progress Bar */}
        <div className="w-full bg-[#E8D8C4] h-2">
          <div
            className="h-2 transition-all duration-300"
            style={{
              backgroundColor: activeStory.color,
              width: `${((pageIndex + 1) / totalPages) * 100}%`,
            }}
          />
        </div>

        {/* Page Reader Content */}
        <div className="px-4 py-6 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl border-2 border-[#E8D8C4] p-8 shadow-md text-center relative">
            {/* Story Emoji Illustration */}
            <div
              className="w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-sm border"
              style={{
                backgroundColor: `${activeStory.color}15`,
                borderColor: `${activeStory.color}30`,
              }}
            >
              {currentPage.emoji}
            </div>

            <p className="text-xl font-800 text-[#1F2937] leading-relaxed mb-4">
              {currentPage.text}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF6EC] border border-[#E8D8C4] rounded-full text-xs font-700 text-[#6B7280]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>الصفحة {currentPage.pageNumber}</span>
            </div>
          </div>
        </div>

        {/* Page Navigation Bar */}
        <div className="p-4 bg-white border-t border-[#E8D8C4] max-w-lg mx-auto w-full flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
            className="px-4 py-3.5 rounded-2xl text-sm font-800 border border-[#E8D8C4] text-[#6B7280] disabled:opacity-40 flex items-center gap-1 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          <button
            onClick={handleNextPage}
            className="flex-1 py-3.5 rounded-2xl text-base font-800 text-white shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            style={{ backgroundColor: activeStory.color }}
          >
            <span>
              {pageIndex + 1 === totalPages
                ? "إنهاء القصة 🎉"
                : "الصفحة التالية"}
            </span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Stories Catalog Grid View (2 Stories Per Line)
  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Catalog Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">قصص حلوة</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-6 pb-8 max-w-4xl mx-auto">
        <p className="text-sm text-[#6B7280] text-center mb-6">
          اختر قصتك واستمتع بالقراءة التفاعلية
        </p>

        {/* 2 Stories Per Line Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {storiesData.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-[#E8D8C4] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: story.bg }}
                >
                  <BookOpen
                    className="w-7 h-7"
                    style={{ color: story.color }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-800 text-[#1F2937]">
                      {story.title}
                    </h3>
                    {story.readable !== false ? (
                      story.badge && (
                        <span
                          className="text-xs font-700 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${story.color}20`,
                            color: story.color,
                          }}
                        >
                          {story.badge}
                        </span>
                      )
                    ) : (
                      <span className="text-xs font-700 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        قريباً
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F5E8D4] flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {story.readable !== false
                      ? `${story.content.length} صفحات`
                      : "قريباً"}
                  </span>
                </div>
                {story.readable !== false ? (
                  <button
                    onClick={() => startStory(story.id)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-700 text-white transition-all active:scale-95 hover:opacity-90 shadow-sm cursor-pointer"
                    style={{ backgroundColor: story.color }}
                  >
                    اقرأ القصة
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-700 bg-[#F5E8D4] text-[#9CA3AF] cursor-not-allowed"
                  >
                    قريباً...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
