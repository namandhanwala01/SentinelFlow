import React from 'react';
import { getRiskBadgeClasses } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'neutral' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
        return getRiskBadgeClasses('CRITICAL');
      case 'high':
        return getRiskBadgeClasses('HIGH');
      case 'medium':
        return getRiskBadgeClasses('MEDIUM');
      case 'low':
        return getRiskBadgeClasses('LOW');
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold';
      case 'brand':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300 font-medium';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      case 'md':
      default:
        return 'px-2.5 py-1 text-xs';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-600';
      case 'info':
        return 'bg-blue-600';
      case 'brand':
        return 'bg-indigo-600';
      case 'neutral':
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />}
      {children}
    </span>
  );
};
