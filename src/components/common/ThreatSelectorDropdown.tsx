import React, { useState, useRef, useEffect } from 'react';
import { useThreatContext } from '../../context/ThreatContext';
import { ChevronDown, ShieldAlert, Check } from 'lucide-react';
import { getRiskBadgeClasses } from '../../utils/formatters';

export const ThreatSelectorDropdown: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { threats, selectedThreat, setSelectedThreatId } = useThreatContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 rounded-lg px-3 py-2 text-xs md:text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[240px]"
      >
        <div className="flex items-center gap-2 truncate">
          <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0" />
          <span className="truncate">{selectedThreat.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getRiskBadgeClasses(selectedThreat.risk)}`}>
            {selectedThreat.risk} {selectedThreat.riskScore}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 rounded-xl bg-white border border-slate-200 shadow-elevated z-50 py-1.5 focus:outline-none animate-in fade-in-50 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Select Active Threat Context
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {threats.map((threat) => {
              const isSelected = threat.id === selectedThreat.id;
              return (
                <button
                  key={threat.id}
                  onClick={() => {
                    setSelectedThreatId(threat.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-indigo-50/70 text-indigo-900 font-semibold' : 'text-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">{threat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${getRiskBadgeClasses(threat.risk)}`}>
                        {threat.risk}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {threat.affectedSystem} • Score {threat.riskScore} • Stage: {threat.currentStage}
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
