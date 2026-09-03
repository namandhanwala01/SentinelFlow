import React from 'react';
import { ContributingFactor } from '../../types';
import { Card } from '../common/Card';
import { HelpCircle, BarChart3, Info } from 'lucide-react';

interface ContributingFactorsListProps {
  factors: ContributingFactor[];
  threatName?: string;
}

export const ContributingFactorsList: React.FC<ContributingFactorsListProps> = ({
  factors,
  threatName,
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Identity':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Network':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Behavior':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Device':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Access':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <Card
      title="Contributing Risk Factors"
      subtitle={threatName ? `Feature importance breakdown for ${threatName}` : 'Model signal weights'}
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.id} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900">{factor.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getCategoryBadge(
                    factor.category
                  )}`}
                >
                  {factor.category}
                </span>
              </div>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{factor.weight}%</span>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${factor.weight}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-800">Evidence:</strong> {factor.evidence}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
