import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon: LucideIcon;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'neutral' | 'brand';
  subtext?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  icon: Icon,
  variant = 'neutral',
  subtext,
  onClick,
}) => {
  const getIconContainerStyles = () => {
    switch (variant) {
      case 'critical':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'brand':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getCardAccentBorder = () => {
    switch (variant) {
      case 'critical':
        return 'hover:border-red-300';
      case 'high':
        return 'hover:border-orange-300';
      case 'medium':
        return 'hover:border-amber-300';
      case 'low':
        return 'hover:border-emerald-300';
      case 'brand':
        return 'hover:border-indigo-300';
      case 'neutral':
      default:
        return 'hover:border-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm transition-all duration-150 ${getCardAccentBorder()} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`p-2 rounded-lg shrink-0 ${getIconContainerStyles()}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              trend.isNeutral
                ? 'text-slate-600'
                : trend.isPositive
                ? 'text-emerald-700'
                : 'text-red-700'
            }`}
          >
            <span>{trend.value}</span>
            {trend.label && <span className="font-normal text-slate-500">{trend.label}</span>}
          </span>
        )}
        {subtext && <span className="text-slate-500 text-right truncate">{subtext}</span>}
      </div>
    </div>
  );
};
