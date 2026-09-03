import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border border-transparent shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-sm focus-visible:ring-2 focus-visible:ring-red-500 font-medium';
      case 'outline':
        return 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-sm font-medium';
      case 'ghost':
        return 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 border border-transparent font-medium';
      case 'secondary':
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 shadow-sm font-medium';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 text-xs rounded-md gap-1.5';
      case 'lg':
        return 'px-4 py-2.5 text-sm rounded-lg gap-2.5 font-semibold';
      case 'md':
      default:
        return 'px-3.5 py-2 text-xs md:text-sm rounded-md gap-2';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
