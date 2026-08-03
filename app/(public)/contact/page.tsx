"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  Compass,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "contact@autilinkdz.com",
    link: "mailto:contact@autilinkdz.com",
    color: "#1D5B79",
    bg: "#1D5B7910",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "+213 555 000 000",
    link: "tel:+213555000000",
    color: "#2E8B7E",
    bg: "#2E8B7E10",
  },
  {
    icon: MapPin,
    title: "العنوان",
    value: "الجزائر العاصمة، الجزائر",
    link: null,
    color: "#E97F6B",
    bg: "#E97F6B10",
  },
  {
    icon: Clock,
    title: "أوقات الدعم",
    value: "من الأحد إلى الخميس، 9:00 — 17:00",
    link: null,
    color: "#6B4C93",
    bg: "#6B4C9310",
  },
];

const subjects = [
  "استفسار عام",
  "مشكلة تقنية",
  "طلب عرض توضيحي",
  "الشراكة مع مركز",
  "الاشتراك والدفع",
  "اقتراح أو تغذية راجعة",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#FDF6EC] min-h-screen">
      {/* Hero */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden border-b border-[#E8D8C4]/60">
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
        <div className="container-rtl relative z-10 text-center max-w-3xl mx-auto">
          <div className="badge-primary inline-flex mb-6">
            <MessageCircle className="w-3.5 h-3.5" />
            نحن هنا لمساعدتك
          </div>
          <h1 className="text-4xl md:text-5xl font-900 text-[#1F2937] mb-6">
            تواصل معنا
          </h1>
          <p className="text-[#6B7280] text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            لديك سؤال، اقتراح أو تريد عرضاً توضيحياً للمنصة؟ فريقنا متاح لمساعدتك والإجابة عن جميع استفساراتك.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 md:py-20">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-800 text-[#1F2937] mb-6">
                معلومات التواصل
              </h2>
              <div className="flex flex-col gap-4">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  const content = (
                    <div
                      className="flex items-start gap-4 p-4 rounded-2xl border border-[#E8D8C4] bg-white hover:shadow-md transition-all"
                      style={{ borderRight: `4px solid ${info.color}` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: info.bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: info.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-600 text-[#6B7280] mb-0.5">
                          {info.title}
                        </div>
                        <div className="text-sm font-600 text-[#1F2937]">
                          {info.value}
                        </div>
                      </div>
                    </div>
                  );

                  return info.link ? (
                    <a key={i} href={info.link}>
                      {content}
                    </a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E8D8C4] shadow-sm">
                {!submitted ? (
                  <>
                    <h2 className="text-2xl font-800 text-[#1F2937] mb-6">
                      أرسل رسالتك
                    </h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                      className="flex flex-col gap-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-name" className="block text-sm font-600 text-[#374151] mb-2">
                            الاسم الكامل *
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            placeholder="اسمك واللقب"
                            className="input-rtl"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-sm font-600 text-[#374151] mb-2">
                            البريد الإلكتروني *
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            placeholder="example@email.com"
                            className="input-rtl text-left"
                            dir="ltr"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-600 text-[#374151] mb-2">
                          رقم الهاتف (اختياري)
                        </label>
                        <input
                          type="tel"
                          id="contact-phone"
                          placeholder="05XXXXXXXX"
                          className="input-rtl text-left"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-sm font-600 text-[#374151] mb-2">
                          موضوع الرسالة *
                        </label>
                        <select id="contact-subject" className="input-rtl" required>
                          <option value="">اختر الموضوع</option>
                          {subjects.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-600 text-[#374151] mb-2">
                          الرسالة *
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          placeholder="اكتب رسالتك هنا..."
                          className="input-rtl resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        id="contact-submit"
                        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-[#1D5B79] to-[#2478a0] text-white font-700 hover:from-[#163f56] hover:to-[#1D5B79] transition-all shadow-lg hover:scale-[1.01] cursor-pointer"
                      >
                        <Send className="w-5 h-5" />
                        <span>إرسال الرسالة</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-[#2E8B7E]/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-[#2E8B7E]" />
                    </div>
                    <h3 className="text-2xl font-800 text-[#1F2937] mb-3">
                      تم إرسال رسالتك بنجاح
                    </h3>
                    <p className="text-[#6B7280] leading-relaxed max-w-sm mx-auto">
                      شكراً لتواصلك معنا. سيرد عليك فريقنا في أقرب وقت خلال ساعات العمل.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm text-[#1D5B79] font-700 hover:underline"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="pb-24">
        <div className="container-rtl">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8D8C4] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-700 text-[#1D5B79] uppercase tracking-wider block mb-1">
                  موقع المقر الرئيسي
                </span>
                <h2 className="text-2xl font-800 text-[#1F2937] flex items-center gap-2.5">
                  <MapPin className="w-6 h-6 text-[#E97F6B]" />
                  <span>خريطة الموقع — الجزائر العاصمة</span>
                </h2>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#6B7280] font-500 bg-[#FDF6EC] px-3.5 py-2 rounded-full border border-[#E8D8C4]">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2E8B7E] animate-pulse" />
                <span>أوقات العمل: الأحد إلى الخميس (9:00 - 17:00)</span>
              </div>
            </div>

            {/* Google Maps iFrame Container */}
            <div className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden border border-[#E8D8C4] shadow-inner">
              <iframe
                title="موقع أوتيلينك دي زي - الجزائر العاصمة"
                src="https://maps.google.com/maps?q=Algiers,Algeria&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Location Card Overlay */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8D8C4] shadow-xl max-w-xs text-right">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#1D5B79] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-800 text-[#1D5B79]">أوتيلينك دي زي</span>
                    <span className="text-[10px] font-600 text-[#2E8B7E]">المقر الرئيسي</span>
                  </div>
                </div>
                <p className="text-xs text-[#374151] leading-relaxed">
                  الجزائر العاصمة، الجزائر. تتوفر المواقف واستقبال الزوار بموعد مسبق.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
