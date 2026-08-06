// components/ui/StatCard.tsx
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "#1D5B79",
  iconBg = "#1D5B7910",
  trend,
  trendValue,
  description,
  className = "",
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-[#E8D8C4] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-600 ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-900 text-[#1F2937] mb-1">{value}</div>
      <div className="text-sm font-600 text-[#6B7280]">{title}</div>
      {description && (
        <div className="text-xs text-[#9CA3AF] mt-2">{description}</div>
      )}
    </div>
  );
}
