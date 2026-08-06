// components/ui/PageHeader.tsx
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "#1D5B79",
  iconBg = "#1D5B7915",
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {Icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-900 text-[#1F2937]">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
