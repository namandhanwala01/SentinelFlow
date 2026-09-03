import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderVariant?: 'default' | 'critical' | 'high' | 'brand';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  title,
  subtitle,
  actions,
  icon,
  padding = 'md',
  borderVariant = 'default',
  onClick,
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3.5';
      case 'lg':
        return 'p-6';
      case 'md':
      default:
        return 'p-5';
    }
  };

  const getBorderClass = () => {
    switch (borderVariant) {
      case 'critical':
        return 'border-red-300 ring-1 ring-red-100';
      case 'high':
        return 'border-orange-300 ring-1 ring-orange-100';
      case 'brand':
        return 'border-indigo-300 ring-1 ring-indigo-100';
      case 'default':
      default:
        return 'border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${getBorderClass()} shadow-sm hover:border-slate-300 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      {(header || title || subtitle || actions) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          {header ? (
            header
          ) : (
            <div className="flex items-center gap-2.5">
              {icon && <span className="text-indigo-600 shrink-0">{icon}</span>}
              <div>
                {title && <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-tight">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={getPaddingClass()}>{children}</div>
    </div>
  );
};
