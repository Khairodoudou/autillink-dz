"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Users, Building2, Star } from "lucide-react";

const stats = [
  {
    icon: MapPin,
    value: 48,
    suffix: "",
    label: "ولاية مغطاة",
    sublabel: "عبر كامل التراب الجزائري",
    color: "#1D5B79",
    bg: "#1D5B7912",
  },
  {
    icon: Users,
    value: 320,
    suffix: "+",
    label: "أخصائي مسجّل",
    sublabel: "أطباء ومختصي التوحد",
    color: "#2E8B7E",
    bg: "#2E8B7E12",
  },
  {
    icon: Building2,
    value: 85,
    suffix: "+",
    label: "مركز شريك",
    sublabel: "مراكز رعاية متخصصة",
    color: "#E97F6B",
    bg: "#E97F6B12",
  },
  {
    icon: Star,
    value: 1200,
    suffix: "+",
    label: "أسرة تستخدم المنصة",
    sublabel: "يثقون بخدماتنا يومياً",
    color: "#6B4C93",
    bg: "#6B4C9312",
  },
];

function useCountUp(target: number, duration = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(stat.value, 1800, visible);
  const Icon = stat.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="stat-card card-hover"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ease ${index * 150}ms`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: stat.bg }}
      >
        <Icon className="w-7 h-7" style={{ color: stat.color }} />
      </div>
      <div
        className="text-4xl md:text-5xl font-900 mb-2"
        style={{ color: stat.color }}
      >
        {count.toLocaleString("ar-DZ")}
        {stat.suffix}
      </div>
      <div className="text-[#1F2937] font-700 text-lg mb-1">{stat.label}</div>
      <div className="text-[#6B7280] text-sm">{stat.sublabel}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="section-padding bg-[#FDF6EC]">
      <div className="container-rtl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-primary inline-flex mb-4">
            <Star className="w-3.5 h-3.5" />
            أرقام حقيقية
          </div>
          <h2 className="text-3xl md:text-4xl font-800 text-[#1F2937] mb-4">
            نمو متواصل عبر{" "}
            <span className="text-gradient-primary">كامل الجزائر</span>
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            منصة أوتيلينك تتوسع يوماً بعد يوم لتغطية أكثر الأسر والمراكز المحتاجة للرعاية المتخصصة.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
