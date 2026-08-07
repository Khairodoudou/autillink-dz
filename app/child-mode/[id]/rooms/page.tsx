"use client";
// app/child-mode/[id]/rooms/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Stethoscope,
  Scissors,
  ShoppingCart,
  GraduationCap,
  Clock,
  ChevronLeft,
  Star,
  CheckCircle,
  Volume2,
  Sparkles,
  Award,
  HeartPulse,
  Navigation,
  Trees,
  Bus,
} from "lucide-react";

interface ScenarioStep {
  title: string;
  emoji: string;
  text: string;
  soundEffect?: string;
  actionText: string;
  tip?: string;
}

const rooms = [
  {
    id: "clinic",
    title: "عيادة الطبيب",
    description: "تعلم ماذا يحدث عند زيارة الطبيب — الفحص والأدوات والطمأنينة.",
    icon: Stethoscope,
    color: "#1D5B79",
    bg: "from-[#1D5B79] to-[#2478a0]",
    duration: "10 دقائق",
    badge: "الأكثر استخداماً",
  },
  {
    id: "barber",
    title: "صالون الحلاقة",
    description: "تمرّن على زيارة الحلاق — الأصوات والحركات والتعاون.",
    icon: Scissors,
    color: "#E97F6B",
    bg: "from-[#E97F6B] to-[#d4624d]",
    duration: "8 دقائق",
    badge: null,
  },
  {
    id: "shop",
    title: "المتجر الصغير",
    description: "تعلم كيف تطلب ما تريد وتتعامل مع البائع بثقة.",
    icon: ShoppingCart,
    color: "#2E8B7E",
    bg: "from-[#2E8B7E] to-[#22685e]",
    duration: "12 دقائق",
    badge: "جديد",
  },
  {
    id: "classroom",
    title: "الفصل الدراسي",
    description: "استعد للمدرسة — تعلم قواعد الفصل والتفاعل مع المعلم والزملاء.",
    icon: GraduationCap,
    color: "#6B4C93",
    bg: "from-[#6B4C93] to-[#513877]",
    duration: "15 دقائق",
    badge: null,
  },
  {
    id: "dentist",
    title: "طبيب الأسنان",
    description: "تمرّن على زيارة طبيب الأسنان — العناية بالأسنان وفحص الكرسي المريح.",
    icon: HeartPulse,
    color: "#06B6D4",
    bg: "from-[#06B6D4] to-[#0891B2]",
    duration: "10 دقائق",
    badge: "قريباً",
    available: false,
  },
  {
    id: "airport",
    title: "مطار السفر والرحلات",
    description: "تمرّن على إجراءات المطار وركوب الطائرة والهدوء وأحزمة الأمان.",
    icon: Navigation,
    color: "#8B5CF6",
    bg: "from-[#8B5CF6] to-[#7C3AED]",
    duration: "15 دقائق",
    badge: "قريباً",
    available: false,
  },
  {
    id: "park",
    title: "حديقة الألعاب والرياضة",
    description: "تمرّن على التفاعل واللعب الجماعي مع الأصدقاء في حديقة الألعاب.",
    icon: Trees,
    color: "#10B981",
    bg: "from-[#10B981] to-[#059669]",
    duration: "12 دقائق",
    badge: "قريباً",
    available: false,
  },
  {
    id: "bus",
    title: "محطة الحافلات والنقل",
    description: "تمرّن على ركوب وسائل النقل العامة والنظام والانتظار.",
    icon: Bus,
    color: "#F59E0B",
    bg: "from-[#F59E0B] to-[#D97706]",
    duration: "10 دقائق",
    badge: "قريباً",
    available: false,
  },
];

const roomScenarios: Record<
  string,
  {
    title: string;
    color: string;
    steps: ScenarioStep[];
  }
> = {
  clinic: {
    title: "عيادة الطبيب",
    color: "#1D5B79",
    steps: [
      {
        title: "غرفة الانتظار بهدوء",
        emoji: "🏥",
        text: "أهلاً بك في العيادة! نجلس في غرفة الانتظار بهدوء ونلعب بالألعاب حتى يطلب الطبيب دخولنا.",
        actionText: "ادخل لغرفة الفحص 🚪",
        tip: "تذكر: المكان آمن والطبيب موجود ليعتني بصحتك.",
      },
      {
        title: "التعرف والترحيب بالطبيب",
        emoji: "🧑‍⚕️",
        text: "الطبيب يبتسم ويسلّم عليك بالاسم! يقول لك: 'مرحباً يا شجاع، سأقوم بفحص سريع ولطيف'.",
        actionText: "ابتسم وسلّم على الطبيب 🤝",
        tip: "يمكنك رد السلام بابتسامة وهدوء.",
      },
      {
        title: "فحص دقات القلب بالسماعة",
        emoji: "🩺",
        text: "الطبيب يستخدم السماعة لسماع دقات قلبك القوي! السماعة باردة قليلاً على الصدر لكنها لا تؤلم إطلاقاً.",
        soundEffect: "طخ... طخ... طخ... (دقات قلب ممتازة! ❤️)",
        actionText: "تنفس بهدوء ورائع 🫁",
        tip: "خذ نفساً عميقاً واسترخِ.",
      },
      {
        title: "فحص الحلق والضوء الكاشف",
        emoji: "😮",
        text: "الطبيب ينظر إلى الحلق بضوء صغير ولطيف. يطلب منك فتح فمك وقول: 'آآآآه' بصوت واضح.",
        soundEffect: "آآآآه... فحص ممتاز وخالي من المشاكل!",
        actionText: "افتح فمك وقول آآآه ✨",
        tip: "الأمر ينتهي في ثوانٍ معدودة!",
      },
      {
        title: "الانتهاء ووسام الشجاعة",
        emoji: "🏅",
        text: "رائع جداً! أنهيت الفحص بنجاح وبطل الحكاية كسب وسام الشجاعة ونجمة ذهبية!",
        actionText: "احصل على النجمة والإنهاء ⭐",
      },
    ],
  },
  barber: {
    title: "صالون الحلاقة",
    color: "#E97F6B",
    steps: [
      {
        title: "الجلوس على كرسي الحلاقة",
        emoji: "🪑",
        text: "مرحباً بك في صالون الحلاقة! نجلس على الكرسي الدوار الممتع ونضع غطاء حماية الملابس.",
        actionText: "اجلس بثقة على الكرسي ✂️",
        tip: "الكرسي مريح ويمكنه الدوران والارتفاع!",
      },
      {
        title: "الاستماع لصوت الماكينة",
        emoji: "🎧",
        text: "الحلاق يشغل ماكينة قص الشعر. صوتها مثل زنين النحلة: (ززززز)، وهو صوت آمن ولا يؤلم إطلاقاً!",
        soundEffect: "🔊 ززززز... ززززز... أصوات حلاقة لطيفة وآمنة",
        actionText: "استمع للصوت بهدوء 😌",
        tip: "الماكينة تقص الشعر فقط دون أي ألم.",
      },
      {
        title: "رش الماء وتمشيط الشعر",
        emoji: "💦",
        text: "الحلاق يرش رشة ماء خفيفة ومنعشة على الشعر، ثم يمشّطه بالفرشاة النظيفة.",
        actionText: "رش الماء وتمشيط الشعر 💇‍♂️",
        tip: "احساس منعش ولطيف!",
      },
      {
        title: "رؤية النتيجة في المرآة",
        emoji: "🪞",
        text: "انظر للمرآة أمامك! مظهرك جديد وجذاب وأنيق جداً يا بطل! الحلاق يبتسم ويقول: ممتاز!",
        actionText: "شاهد مظهرك الجديد ونهنئك ⭐",
      },
    ],
  },
  shop: {
    title: "المتجر الصغير",
    color: "#2E8B7E",
    steps: [
      {
        title: "أخذ السلة واختيار المنتجات",
        emoji: "🛒",
        text: "مرحباً بك في المتجر! نأخذ سلة التسوق ونمشي في الممرات بهدوء لاختيار ما نحتاجه.",
        actionText: "اختر تفاحة وعصيراً طازجاً 🍎🧃",
        tip: "نضع المنتجات في السلة برفق.",
      },
      {
        title: "الانتظار في الدور",
        emoji: "⏳",
        text: "نذهب نحو كاونتر الصندوق ونقف في الدور بهدوء حتى ينتهي الزبون الذي أمامنا.",
        actionText: "انتظر دورك بثقة 🚶‍♂️",
        tip: "الانتظار يدل على الأدب والنظام.",
      },
      {
        title: "التحدث مع البائع والدفع",
        emoji: "💵",
        text: "نضع المنتجات أمام البائع ونقول: 'مرحباً'، ثم نسلمه النقود أو بطاقات الشراء.",
        actionText: "سلم النقود وقل شكراً 🤝",
        tip: "البائع يبتسم ويعطيك الباقي والحقيبة.",
      },
      {
        title: "أخذ حقيبة التسوق",
        emoji: "🛍️",
        text: "تأخذ حقيبة مشترياتك وتقول للبائع: 'شكراً جزيلاً!'. لقد قمت بالشراء بمفردك بنجاح!",
        actionText: "أنهِ تجربة التسوق بنجاح ⭐",
      },
    ],
  },
  classroom: {
    title: "الفصل الدراسي",
    color: "#6B4C93",
    steps: [
      {
        title: "دخول الفصل والجلوس",
        emoji: "🎒",
        text: "مرحباً بك في المدرسة! نضع حقيبتنا في المكان المخصص ونجلس في المقعد بهدوء.",
        actionText: "اجلس في مقعدك الخاص 🪑",
        tip: "الفصل مكان ممتع للتعلم وتكوين الصداقات.",
      },
      {
        title: "رفع اليد للمشاركة في الدرس",
        emoji: "✋",
        text: "المعلم يطرح سؤالاً رائعاً! عندما نعرف الإجابة، نرفع يدنا بهدوء وننتظر المعلم يأذن لنا بالإجابة.",
        actionText: "ارفع يدك واشترك بالدرس 💡",
        tip: "رفع اليد طريقة ممتازة ومؤدبة للمشاركة.",
      },
      {
        title: "وقت الاستراحة واللعب مع الأصدقاء",
        emoji: "⚽",
        text: "يدق جرس الاستراحة! نخرج للساحة ونلعب مع زملائنا ونشاركهم الألعاب والضحك.",
        actionText: "العب وشارك أصدقائك 😃",
        tip: "المشاركة تجعل اللعب أكثر متعة!",
      },
      {
        title: "نهاية اليوم الدراسي الممتع",
        emoji: "🏫",
        text: "أحسنت يا شجاع! أنهيت يوماً دراسياً ممتعاً وتعلّمت معلومات جديدة وقيم رائعة!",
        actionText: "احصل على نجوم اليوم الدراسي ⭐",
      },
    ],
  },
};

export default function RoomsPage() {
  const params = useParams();
  const childId = params.id as string;

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setStepIndex(0);
    setCompleted(false);
  };

  const handleNextStep = () => {
    if (!activeRoomId) return;
    const scenario = roomScenarios[activeRoomId];
    if (!scenario) return;

    if (stepIndex + 1 >= scenario.steps.length) {
      setCompleted(true);
    } else {
      setStepIndex((s) => s + 1);
    }
  };

  const currentScenario = activeRoomId ? roomScenarios[activeRoomId] : null;

  if (currentScenario) {
    if (completed) {
      return (
        <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6 animate-bounce shadow">
            <Award className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-900 text-[#1F2937] mb-2">
            أحسنت يا بطل! 🎉
          </h2>
          <p className="text-[#6B7280] mb-6 max-w-sm">
            أكملت التدريب على غرفة{" "}
            <span className="font-800 text-[#1F2937]">
              {currentScenario.title}
            </span>{" "}
            بنجاح وشجاعة، وحصلت على +5 نجوم جديدة!
          </p>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-full mb-8 text-amber-900 text-sm font-800">
            <Star className="w-5 h-5 text-[#F5B942] fill-[#F5B942]" />
            <span>+5 نجوم مضافة لرصيدك</span>
          </div>

          <button
            onClick={() => setActiveRoomId(null)}
            className="px-8 py-3.5 bg-[#1D5B79] text-white font-800 rounded-2xl shadow-lg hover:bg-[#174A62] transition-colors"
          >
            العودة إلى قائمة الغرف
          </button>
        </div>
      );
    }

    const currentStep = currentScenario.steps[stepIndex];
    const totalSteps = currentScenario.steps.length;

    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col justify-between">
        {/* Top Header */}
        <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setActiveRoomId(null)}
            className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280] hover:bg-[#E8D8C4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-800 text-[#1F2937]">
              {currentScenario.title}
            </h1>
            <p className="text-[11px] text-[#6B7280]">
              الخطوة {stepIndex + 1} من {totalSteps}
            </p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E8D8C4] h-2">
          <div
            className="h-2 transition-all duration-300"
            style={{
              backgroundColor: currentScenario.color,
              width: `${((stepIndex + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>

        {/* Main Step Content */}
        <div className="px-4 py-6 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl border-2 border-[#E8D8C4] p-6 shadow-md text-center relative overflow-hidden">
            {/* Step Emoji Badge */}
            <div
              className="w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center text-5xl shadow-sm border"
              style={{
                backgroundColor: `${currentScenario.color}15`,
                borderColor: `${currentScenario.color}30`,
              }}
            >
              {currentStep.emoji}
            </div>

            <h2 className="text-xl font-900 text-[#1F2937] mb-3">
              {currentStep.title}
            </h2>

            <p className="text-base font-700 text-[#4B5563] leading-relaxed mb-6">
              {currentStep.text}
            </p>

            {/* Sound Effect Notice if present */}
            {currentStep.soundEffect && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-5 text-blue-900 text-xs font-700 flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600 animate-pulse flex-shrink-0" />
                <span>{currentStep.soundEffect}</span>
              </div>
            )}

            {/* Sensory Tip */}
            {currentStep.tip && (
              <div className="bg-[#FDF6EC] border border-[#E8D8C4] rounded-2xl p-3 text-[12px] font-600 text-[#6B7280] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F5B942] flex-shrink-0" />
                <span>{currentStep.tip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-[#E8D8C4] max-w-lg mx-auto w-full">
          <button
            onClick={handleNextStep}
            className="w-full py-4 rounded-2xl text-base font-800 text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
            style={{ backgroundColor: currentScenario.color }}
          >
            <span>{currentStep.actionText}</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C4] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link
          href={`/child-mode/${childId}`}
          className="w-9 h-9 rounded-xl bg-[#F5E8D4] flex items-center justify-center text-[#6B7280]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-800 text-[#1F2937]">غرف نتمرّن</h1>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-6 pb-8 max-w-4xl mx-auto">
        <p className="text-sm text-[#6B7280] text-center mb-6">
          تمرّن على المواقف الحياتية في بيئة آمنة وممتعة
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8D8C4] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Top Banner */}
                <div
                  className={`bg-gradient-to-r ${room.bg} p-5 flex items-center gap-4`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-800 text-white">
                        {room.title}
                      </h3>
                      {room.badge && (
                        <span
                          className={`text-xs font-700 px-2 py-0.5 rounded-full ${
                            room.available === false
                              ? "bg-amber-400 text-amber-950 font-800"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {room.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{room.duration}</span>
                    </div>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
                    {room.description}
                  </p>
                  {room.available !== false ? (
                    <button
                      onClick={() => startRoom(room.id)}
                      className="w-full py-3 rounded-xl text-sm font-700 text-white flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90 shadow-sm cursor-pointer mt-auto"
                      style={{ backgroundColor: room.color }}
                    >
                      ادخل الغرفة
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl text-sm font-700 bg-[#F5E8D4] text-[#9CA3AF] cursor-not-allowed mt-auto"
                    >
                      قريباً...
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
