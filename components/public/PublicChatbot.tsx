"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Headphones,
  ArrowLeft,
  Minus,
  CheckCircle2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: string[];
  link?: { href: string; label: string };
}

const quickPrompts = [
  "ما هي منصة أوتيلينك؟",
  "كيف أسجّل كولي أمر؟",
  "كيف ينضم الأخصائي أو المركز؟",
  "ما هو نظام البيكتوغرام؟",
  "هل البيانات آمنة ومحميّة؟",
];

const botKnowledgeBase: {
  keywords: string[];
  reply: string;
  quickReplies?: string[];
  link?: { href: string; label: string };
}[] = [
  {
    keywords: ["منصة", "ما هي", "تعريف", "أوتيلينك", "autilink", "ماهي"],
    reply:
      "أوتيلينك دي زي (AutiLink DZ) هي منصة رقمية جزائرية متخصصة ومصممة لدعم أطفال طيف التوحد وأسرهم. تربط المنصة الأولياء بالأخصائيين النفسيين والأرطفونيين ومراكز الرعاية لتوفير متابعة يومية وشاملة ومنظمة.",
    quickReplies: ["كيف أسجّل كولي أمر؟", "المميزات والخدمات"],
    link: { href: "/about", label: "معرفة المزيد منا" },
  },
  {
    keywords: ["ولي", "والد", "أب", "أم", "أسرة", "عائلة", "تسجيل ولي"],
    reply:
      "يمكن للأولياء التسجيل مجاناً بصفة 'ولي أمر'. بعد التسجيل، يمكنك إضافة ملف طفلك، متابعة مزاجه وسلوكه اليومي، استخدام ألعاب التطبيق والتواصل المباشر مع الأخصائي المعالج.",
    quickReplies: ["إنشاء حساب ولي أمر", "كيف يتواصل الأخصائي؟"],
    link: { href: "/register?role=parent", label: "إنشاء حساب ولي أمر" },
  },
  {
    keywords: ["أخصائي", "طبيب", "أرطفوني", "نفساني", "مركز", "جمعية", "عيادة"],
    reply:
      "تتيح المنصة للأخصائيين والمراكز المؤسسية لوحة قيادة متكاملة لإدارة ملفات الأطفال، كتابة تقارير الجلسات، استخدام النماذج والتقييمات السريرية، وتوزيع الأدوار بين أفراد الطقم الطبي.",
    quickReplies: ["تسجيل مركز أو أخصائي", "المميزات والخدمات"],
    link: { href: "/register?role=admin", label: "تسجيل مركز أو أخصائي" },
  },
  {
    keywords: ["بيكتوغرام", "صور", "تواصل", "جدول", "تعبير", "صوت"],
    reply:
      "جدول التواصل المصور (بيكتوغرام) هو أداة بصريّة تفاعلية تحتوي على صور ورموز واضحة تمكن الطفل من التعبير عن مشاعره واحتياجاته بنقرة واحدة، مع خيار نطق الاسم صوتياً.",
    quickReplies: ["تطوير المهارات", "تجربة المنصة"],
    link: { href: "/features", label: "استكشاف جدول البيكتوغرام" },
  },
  {
    keywords: ["أمان", "خصوصية", "تشفير", "قانون", "بيانات", "حماية"],
    reply:
      "جميع البيانات والمعلومات السلوكية والطبية مشفّرة وتخضع لأعلى معايير الحماية الرقمية والالتزام بالقوانين الجزائرية لحماية المعطيات الشخصية (قانون 18-07). لا يمكن لأحد الاطلاع على ملف الطفل سوى الوالدين والأخصائي المعتمد.",
    quickReplies: ["سياسة الخصوصية", "الأسئلة الشائعة"],
    link: { href: "/privacy", label: "قراءة سياسة الخصوصية" },
  },
  {
    keywords: ["دعم", "اتصال", "مساعدة", "هاتف", "بريد", "تواصل", "سؤال"],
    reply:
      "فريق الدعم الفني متواجد لمساعدتكم دائماً! يمكنك مراسلتنا عبر البريد contact@autilinkdz.com أو الاتصال بالهاتف +213 555 000 000.",
    quickReplies: ["صفحة اتصل بنا", "الأسئلة الشائعة"],
    link: { href: "/contact", label: "الانتقال لصفحة التواصل" },
  },
];

export default function PublicChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "مرحباً بك في منصة أوتيلينك دي زي! 👋 أنا مساعدك الذكي. كيف يمكنني إرشادك أو إجابة استفساراتك اليوم؟",
      timestamp: getCurrentTime(),
      quickReplies: quickPrompts,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function getCurrentTime() {
    return new Date().toLocaleTimeString("ar-DZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Simulate Bot response delay
    setTimeout(() => {
      const botResponse = generateBotReply(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const generateBotReply = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    const matched = botKnowledgeBase.find((item) =>
      item.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
    );

    if (matched) {
      return {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: matched.reply,
        timestamp: getCurrentTime(),
        quickReplies: matched.quickReplies,
        link: matched.link,
      };
    }

    return {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: "شكراً لتواصلك! لم أفهم سؤالك بدقة، لكن يمكنك الاطلاع على قسم الأسئلة الشائعة أو التواصل المباشر مع فريق الدعم الفني للحصول على إجابة مفصلة.",
      timestamp: getCurrentTime(),
      quickReplies: ["الأسئلة الشائعة", "تواصل مع الدعم"],
      link: { href: "/pricing", label: "الذهاب للأسئلة الشائعة" },
    };
  };

  const resetChat = () => {
    setMessages([
      {
        id: "init-reset",
        sender: "bot",
        text: "تمت إعادة تعيين المحادثة. كيف يمكنني مساعدتك الآن؟",
        timestamp: getCurrentTime(),
        quickReplies: quickPrompts,
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans select-none">
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip Badge */}
          {hasUnread && (
            <div className="absolute -top-12 left-0 bg-[#1D5B79] text-white text-xs font-700 px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap animate-bounce flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>مساعد أوتيلينك الذكي!</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="افتح المساعد الذكي"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#1D5B79] to-[#2E8B7E] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative group"
          >
            <Bot className="w-7 h-7 md:w-8 md:h-8" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </button>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[410px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-[#E8D8C4] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#1D5B79] via-[#2478a0] to-[#2E8B7E] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-800 text-sm md:text-base">مساعد أوتيلينك</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-700 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    متصل الآن
                  </span>
                </div>
                <p className="text-[0.7rem] text-white/80">إرشادات فورية وإجابات شاملة 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="إعادة المحادثة"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FDF6EC]/40 space-y-4 text-sm dir-rtl">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-xl bg-[#1D5B79] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                      isBot
                        ? "bg-white border border-[#E8D8C4] text-[#1F2937] rounded-tr-none"
                        : "bg-[#1D5B79] text-white rounded-tl-none font-500"
                    }`}
                  >
                    <p className="text-xs md:text-sm">{msg.text}</p>

                    {/* Actionable Link Badge if present */}
                    {msg.link && (
                      <div className="mt-3 pt-2.5 border-t border-[#E8D8C4]/60">
                        <Link
                          href={msg.link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D5B79]/10 text-[#1D5B79] hover:bg-[#1D5B79] hover:text-white transition-all text-xs font-700"
                        >
                          <span>{msg.link.label}</span>
                          <ArrowLeft className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span
                      className={`block text-[0.65rem] mt-1.5 text-left ${
                        isBot ? "text-gray-400" : "text-white/70"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="w-8 h-8 rounded-xl bg-[#2E8B7E] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Replies Options */}
            {messages[messages.length - 1]?.quickReplies && !isTyping && (
              <div className="pt-2 flex flex-wrap gap-1.5 pr-10">
                {messages[messages.length - 1].quickReplies!.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs font-600 px-3 py-1.5 rounded-xl bg-white border border-[#1D5B79]/30 text-[#1D5B79] hover:bg-[#1D5B79] hover:text-white transition-all duration-200 shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 pr-2">
                <div className="w-7 h-7 rounded-xl bg-[#1D5B79] text-white flex items-center justify-center text-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#E8D8C4] rounded-2xl rounded-tr-none px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#1D5B79] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#2E8B7E] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#E97F6B] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E8D8C4] flex items-center gap-2 dir-rtl"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FDF6EC] border border-[#E8D8C4] text-xs md:text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:bg-white focus:border-[#1D5B79] focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-2xl bg-[#1D5B79] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#163f56] transition-colors flex-shrink-0 shadow-sm"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
