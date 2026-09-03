import React from 'react';
import { getRiskColorHex } from '../../utils/formatters';

interface RiskGaugeProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  change?: number; // e.g. +4 or -52
  showLevelText?: boolean;
  isSimulated?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 'lg',
  label = 'RISK SCORE',
  change,
  showLevelText = true,
  isSimulated = false,
}) => {
  const getRiskLevel = (val: number) => {
    if (val >= 80) return { text: 'CRITICAL', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-300', textClass: 'text-red-700' };
    if (val >= 60) return { text: 'HIGH RISK', color: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-300', textClass: 'text-orange-700' };
    if (val >= 40) return { text: 'MEDIUM RISK', color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-300', textClass: 'text-amber-700' };
    return { text: 'LOW RISK', color: '#16a34a', bg: 'bg-emerald-50', border: 'border-emerald-300', textClass: 'text-emerald-700' };
  };

  const level = getRiskLevel(score);

  // SVG dimensions & calculations
  const dimension = size === 'lg' ? 180 : size === 'md' ? 140 : 100;
  const strokeWidth = size === 'lg' ? 14 : size === 'md' ? 11 : 8;
  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg
          className="transform -rotate-90"
          width={dimension}
          height={dimension}
        >
          {/* Background circle track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={getRiskColorHex(level.text.split(' ')[0])}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</span>
          <div className="flex items-baseline justify-center">
            <span
              className={`font-black tracking-tight ${
                size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'
              } text-slate-900`}
            >
              {score}
            </span>
            <span className="text-slate-400 font-semibold text-xs ml-1">/100</span>
          </div>
          {isSimulated && (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5">
              PREDICTED
            </span>
          )}
        </div>
      </div>

      {showLevelText && (
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${level.bg} ${level.border} ${level.textClass}`}>
            {level.text}
          </div>
          {change !== undefined && (
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
              <span className={change > 0 ? 'text-red-600 font-semibold' : change < 0 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                {change > 0 ? `+${change}` : change} pts
              </span>
              <span>vs previous baseline</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
