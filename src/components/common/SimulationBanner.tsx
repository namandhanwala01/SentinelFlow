import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SimulationBannerProps {
  className?: string;
  threatName?: string;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({
  className = '',
  threatName,
}) => {
  return (
    <div
      className={`rounded-xl bg-indigo-50/70 border border-indigo-200 p-3.5 sm:p-4 flex items-start sm:items-center gap-3 text-indigo-950 ${className}`}
    >
      <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5 sm:mt-0 shadow-sm">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded border border-indigo-200">
            Defensive Action Sandbox
          </span>
          {threatName && (
            <span className="text-xs font-semibold text-slate-700">
              Evaluating countermeasures for: <strong className="text-slate-900">{threatName}</strong>
            </span>
          )}
        </div>
        <p className="text-xs text-indigo-900/90 mt-1 font-medium leading-relaxed">
          <strong className="text-indigo-950 font-bold">Simulation only</strong> — no real infrastructure changes, firewall modifications, or account lockouts will be performed. Test and forecast the risk-reduction impact of containment actions safely.
        </p>
      </div>
    </div>
  );
};
