"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Users,
  Building2,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowLeft,
  Mail,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "parents" | "specialists" | "security" | "support";
  tags?: string[];
}

const categories = [
  { id: "all", label: "جميع الأسئلة", icon: HelpCircle },
  { id: "general", label: "عن المنصة", icon: Sparkles },
  { id: "parents", label: "الأولياء والأسر", icon: Users },
  { id: "specialists", label: "الأخصائيون والمراكز", icon: Building2 },
  { id: "security", label: "الأمان والخصوصية", icon: ShieldCheck },
  { id: "support", label: "الدعم والمساعدة", icon: Headphones },
];

const faqData: FaqItem[] = [
  {
    id: "g1",
    category: "general",
    question: "ما هي منصة أوتيلينك دي زي (AutiLink DZ)؟",
    answer:
      "منصة رقمية جزائرية متخصصة تربط بين الأولياء والأخصائيين النفسيين والأرطفونيين ومراكز رعاية أطفال طيف التوحد. تهدف المنصة إلى تسهيل ومتابعة تطوير مهارات الطفل اليومية والسلوكية بشكل منظّم وآمن.",
    tags: ["عن المنصة", "الهدف"],
  },
  {
    id: "g2",
    category: "general",
    question: "هل المنصة مصممة خصيصاً للبيئة الجزائرية؟",
    answer:
      "نعم، صُممت أوتيلينك دي زي مراعية للخصوصية الاجتماعية، اللغوية والثقافية الجزائرية. تدعم المنصة اللغة العربية، الفرنكوعربية، ونظام البيكتوغرام المصور المشهور المستعمل محلياً.",
    tags: ["الجزائر", "اللغة"],
  },
  {
    id: "g3",
    category: "general",
    question: "ما هي أهم الخدمات والوظائف التي توفرها المنصة؟",
    answer:
      "تتيح المنصة متابعة السلوك والمزاج اليومي، جدول تواصل تفاعلي بالصور (بيكتوغرام)، ألعاب تعليمية وحسية للطفل، مجتمع دعم أسري آمن، وقاعات محاكاة افتراضية لتحضير الطفل للمواقف اليومية.",
    tags: ["الوظائف", "الألعاب"],
  },
  {
    id: "p1",
    category: "parents",
    question: "كيف يمكنني كولي أمر التسجيل والبدء في استخدام المنصة؟",
    answer:
      "يمكنك التسجيل بسهولة عبر اختيار حساب 'ولي أمر' وإكمال البيانات الأساسية. بعد ذلك يمكنك إضافة ملف طفلك، بدء تدوين ملاحظاتك اليومية، أو ربط حسابك مباشرة بالأخصائي المتابع.",
    tags: ["التسجيل", "ولي أمر"],
  },
  {
    id: "p2",
    category: "parents",
    question: "هل يمكنني متابعة أكثر من طفل عبر حساب واحد؟",
    answer:
      "نعم بالتأكيد. تتيح لوحة تحكم الأسرة إضافة متابعة لعدة أطفال بشكل مستقل مع إمكانية متابعة تقارير كل طفل ومستواه بشكل منفصل بضغطة زر.",
    tags: ["الأطفال", "الحساب"],
  },
  {
    id: "p3",
    category: "parents",
    question: "ما هو جدول التواصل المصور (بيكتوغرام) وكيف يستعمله طفلي؟",
    answer:
      "هو جدول تفاعلي يحتوي على صور ورموز واضحة في فئات (المشاعر، الاحتياجات، الطعام، الألعاب). ينقر الطفل على الصورة للتعبير عما يريده مع خيار نطق الاسم صوتياً للمساعدة في التواصل.",
    tags: ["بيكتوغرام", "تواصل"],
  },
  {
    id: "p4",
    category: "parents",
    question: "كيف يتواصل معي الأخصائي المعالج لطفلي؟",
    answer:
      "عند ربط حسابك بالأخصائي، ستتلقى التقييمات، التقارير الدورية، والملاحظات السريرية فور تدوينها، كما توفر المنصة قناة محادثة آمنة لمشاركة الاستفسارات مباشرة.",
    tags: ["الأخصائي", "تقارير"],
  },
  {
    id: "s1",
    category: "specialists",
    question: "كيف يستفيد الأخصائي النفسي أو الأرطفوني من المنصة؟",
    answer:
      "تمنح المنصة الأخصائي لوحة تحكم متطورة لإدارة ملفات الأطفال المسندين إليه، إدخال تقارير الجلسات، تطبيق الاستمارات التقييمية الرقمية، ومشاركة النتائج بوضوح مع الأولياء.",
    tags: ["أخصائي", "تقييمات"],
  },
  {
    id: "s2",
    category: "specialists",
    question: "كيف تخدم المنصة مراكز الرعاية والجمعيات الجزائرية؟",
    answer:
      "تتيح للمراكز والمؤسسات إدارة فريق كامل من الأخصائيين، توزيع الأطفال حسب التخصصات، الاستفادة من إحصائيات عامة حول تطور الأطفال وتسيير المواعيد والتواصل مع الأسر.",
    tags: ["المراكز", "الإدارة"],
  },
  {
    id: "s3",
    category: "specialists",
    question: "هل تتوفر استمارات وتقارير تقييم جاهزة ومقننة؟",
    answer:
      "نعم، تشتمل المنصة على نماذج واستمارات تقييم معتمدة يتم احتساب نتائجها آلياً وتخزينها في التاريخ الطبي والتربوي الخاص بكل طفل.",
    tags: ["نماذج", "تقارير"],
  },
  {
    id: "sec1",
    category: "security",
    question: "هل بيانات طفلي ومعلوماته الشخصية والسلوكية آمنة؟",
    answer:
      "نعم، نضع أمان وخصوصية الأطفال على رأس أولوياتنا. جميع البيانات تشفّر وتخزن وفق أحدث معايير الحماية الرقمية والالتزام بالتشريعات الجزائرية لحماية المعطيات الشخصية (قانون 18-07).",
    tags: ["الأمان", "الخصوصية"],
  },
  {
    id: "sec2",
    category: "security",
    question: "من يملك صلاحية الوصول إلى ملفات طفلي والتقارير؟",
    answer:
      "لا يمكن لأي طرف خارجي الاطلاع على معلومات الطفل. فقط ولي الأمر والأخصائي المعتمد والمربوط بالملف رسمياً يمتلكان صلاحية الوصول والتفاعل.",
    tags: ["صلاحيات", "سرية"],
  },
  {
    id: "sec3",
    category: "security",
    question: "ماذا افعل في حال نسيت كلمة المرور الخاصة بحسابي؟",
    answer:
      "يمكنك النقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، وسيقوم النظام بإرسال رابط آمن لإعادة تعيين كلمة المرور عبر بريدك الإلكتروني المسجّل.",
    tags: ["كلمة المرور", "الحساب"],
  },
  {
    id: "sup1",
    category: "support",
    question: "كيف يمكنني التواصل مع فريق الدعم الفني لأوتيلينك؟",
    answer:
      "فريقنا في الخدمة دائماً! يمكنك التواصل معنا من خلال صفحة 'اتصل بنا'، عبر البريد الإلكتروني contact@autilinkdz.com أو الاتصال الهاتفي بمركز الدعم.",
    tags: ["تواصل", "دعم"],
  },
  {
    id: "sup2",
    category: "support",
    question: "هل يوفر الفريق تدريباً أو أدلة لاستعمال المنصة؟",
    answer:
      "نعم، نوفر أدلة استخدام خطوة بخطوة وفيديوهات توضيحية لتبسيط استخدام المنصة للأسر والمراكز، بالإضافة إلى جلسات توجيهية مجانية للمراكز والجمعيات الشريكة.",
    tags: ["تدريب", "مساعدة"],
  },
];

export default function FaqContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    g1: true, // open first item by default
  });
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  // Filter items based on category & search term
  const filteredData = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags &&
        item.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FDF6EC] min-h-screen pb-20">
      {/* Hero Banner Header */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E8D8C4]/60 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
        <div className="container-rtl relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D5B79]/10 border border-[#1D5B79]/20 text-[#1D5B79] text-xs font-700 mb-6">
            <HelpCircle className="w-4 h-4" />
            مركز الأسئلة والأجوبة
          </div>
          <h1 className="text-3xl md:text-5xl font-900 text-[#1F2937] mb-4 leading-tight">
            الأسئلة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#1D5B79] to-[#2E8B7E]">
              الشائعة وإرشادات الاستخدام
            </span>
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg leading-relaxed mb-8">
            تجد هنا إجابات كاملة وشاملة عن كل استفساراتك حول منصة أوتيلينك دي زي، كيفية الاستخدام، الحسابات، والأمان.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute right-4 text-[#1D5B79] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سؤال أو كلمة مفتاحية (مثال: بيكتوغرام، ولي أمر، أمان...)"
                className="w-full pl-10 pr-12 py-4 rounded-2xl bg-[#FDF6EC]/80 border-2 border-[#E8D8C4] focus:border-[#1D5B79] focus:bg-white focus:outline-none transition-all duration-200 text-[#1F2937] placeholder-[#9CA3AF] text-sm md:text-base shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-12 md:py-16">
        <div className="container-rtl max-w-4xl mx-auto">
          {/* Category Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? faqData.length
                  : faqData.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-700 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-[#1D5B79] text-white shadow-md shadow-[#1D5B79]/20"
                      : "bg-white text-[#4B5563] border border-[#E8D8C4] hover:border-[#1D5B79]/40 hover:bg-[#1D5B79]/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#1D5B79]"}`} />
                  <span>{cat.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.7rem] font-800 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#FDF6EC] text-[#6B7280]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary */}
          {searchQuery && (
            <div className="mb-6 px-2 text-sm text-[#6B7280] flex items-center justify-between">
              <span>
                تم العثور على <strong className="text-[#1D5B79]">{filteredData.length}</strong> سؤال متعلق بـ &quot;{searchQuery}&quot;
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#1D5B79] font-700 underline hover:text-[#2E8B7E]"
              >
                إلغاء البحث
              </button>
            </div>
          )}

          {/* Accordions List */}
          {filteredData.length > 0 ? (
            <div className="space-y-4">
              {filteredData.map((item, idx) => {
                const isOpen = !!openItems[item.id];
                const userFeedback = feedback[item.id];

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                      isOpen
                        ? "border-[#1D5B79] shadow-md"
                        : "border-[#E8D8C4] hover:border-[#1D5B79]/40"
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-5 md:p-6 text-right flex items-start justify-between gap-4 focus:outline-none"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-xl text-xs font-800 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isOpen
                              ? "bg-[#1D5B79] text-white"
                              : "bg-[#1D5B79]/10 text-[#1D5B79]"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-800 text-[#1F2937] text-base md:text-lg leading-snug">
                            {item.question}
                          </h3>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {item.tags.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[0.65rem] font-600 px-2 py-0.5 rounded-md bg-[#FDF6EC] text-[#6B7280] border border-[#E8D8C4]/60"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen
                            ? "bg-[#1D5B79] text-white rotate-180"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-[#E8D8C4]/60 bg-[#FDF6EC]/30">
                        <p className="text-[#4B5563] text-sm md:text-base leading-relaxed pr-10">
                          {item.answer}
                        </p>

                        {/* Interactive Feedback Bar */}
                        <div className="mt-6 pt-4 border-t border-[#E8D8C4]/40 flex items-center justify-between text-xs text-[#6B7280] pr-10">
                          <span>هل كانت هذه الإجابة مفيدة لك؟</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(item.id, "up")}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                                userFeedback === "up"
                                  ? "bg-[#2E8B7E] text-white border-[#2E8B7E]"
                                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>نعم</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(item.id, "down")}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                                userFeedback === "down"
                                  ? "bg-[#E97F6B] text-white border-[#E97F6B]"
                                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>لا</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#E8D8C4]">
              <HelpCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-800 text-[#1F2937] mb-2">
                لم نجد نتائج مطابقة لمجال بحثك
              </h3>
              <p className="text-[#6B7280] text-sm max-w-md mx-auto mb-6">
                جرب البحث عن كلمات أخرى أو اختر فئة مختلفة من القائمة أعلاه.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-6 py-2.5 rounded-full bg-[#1D5B79] text-white text-sm font-700 hover:bg-[#163f56] transition-colors"
              >
                عرض كل الأسئلة
              </button>
            </div>
          )}

          {/* Direct Support Card Banner */}
          <div className="mt-16 bg-gradient-to-r from-[#1D5B79] to-[#2478a0] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-10 -translate-y-10 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-700 mb-3">
                  <MessageCircle className="w-3.5 h-3.5" />
                  فريق الدعم في الخدمة
                </span>
                <h3 className="text-2xl md:text-3xl font-800 mb-2">
                  لديك استفسار آخر لم تجد إجابته؟
                </h3>
                <p className="text-white/80 text-sm md:text-base max-w-xl">
                  لا تتردد في التواصل معنا مباشرًة. فريقنا يتفاعل معكم لإعطائكم التوجيهات والمساعدة الكاملة.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1D5B79] font-800 text-sm hover:bg-[#FDF6EC] transition-all shadow-md"
                >
                  <span>تواصل معنا</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:contact@autilinkdz.com"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-white/40 text-white font-700 text-sm hover:bg-white/10 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>راسلنا إلكترونياً</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
