// components/ui/EmptyState.tsx
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor = "#6B7280",
  iconBg = "#F5E8D4",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-10 h-10" style={{ color: iconColor }} />
      </div>
      <h3 className="text-lg font-700 text-[#1F2937] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
}
