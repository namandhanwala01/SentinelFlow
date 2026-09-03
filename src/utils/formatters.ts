import { RiskLevel, AttackStageStatus, SystemHealthStatus } from '../types';

export function getRiskBadgeClasses(risk: RiskLevel | string): string {
  switch (risk.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-50 text-red-700 border border-red-300 font-semibold';
    case 'HIGH':
      return 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold';
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold';
    case 'LOW':
    case 'HEALTHY':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold';
    case 'INFO':
    default:
      return 'bg-blue-50 text-blue-700 border border-blue-200 font-medium';
  }
}

export function getRiskDotColor(risk: RiskLevel | string): string {
  switch (risk.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-600';
    case 'HIGH':
      return 'bg-orange-600';
    case 'MEDIUM':
      return 'bg-amber-500';
    case 'LOW':
    case 'HEALTHY':
      return 'bg-emerald-600';
    case 'INFO':
    default:
      return 'bg-blue-600';
  }
}

export function getRiskColorHex(risk: RiskLevel | string): string {
  switch (risk.toUpperCase()) {
    case 'CRITICAL':
      return '#dc2626';
    case 'HIGH':
      return '#ea580c';
    case 'MEDIUM':
      return '#d97706';
    case 'LOW':
    case 'HEALTHY':
      return '#16a34a';
    case 'INFO':
    default:
      return '#2563eb';
  }
}

export function getSystemHealthClasses(status: SystemHealthStatus): string {
  switch (status) {
    case 'Critical':
      return 'bg-red-50 text-red-700 border border-red-300 font-semibold';
    case 'At Risk':
      return 'bg-orange-50 text-orange-800 border border-orange-300 font-semibold';
    case 'Healthy':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-300';
  }
}

export function getStageStatusClasses(status: AttackStageStatus): {
  badge: string;
  pill: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'completed':
      return {
        badge: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
        pill: 'bg-emerald-500 text-white',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
      };
    case 'current':
      return {
        badge: 'bg-red-50 text-red-700 border border-red-400 ring-2 ring-red-200',
        pill: 'bg-red-600 text-white animate-pulse',
        text: 'text-red-700 font-bold',
        dot: 'bg-red-600',
      };
    case 'predicted':
      return {
        badge: 'bg-amber-50 text-amber-800 border border-amber-300',
        pill: 'bg-amber-500 text-white',
        text: 'text-amber-800',
        dot: 'bg-amber-500',
      };
    case 'not-reached':
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 border border-slate-300',
        pill: 'bg-slate-300 text-slate-700',
        text: 'text-slate-600',
        dot: 'bg-slate-300',
      };
  }
}
