import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  GitFork,
  TrendingUp,
  HelpCircle,
  FlaskConical,
  CheckCircle2,
  Activity,
  Server,
  Settings,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useThreatContext } from '../../context/ThreatContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { metrics, selectedThreat } = useThreatContext();

  const mainNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Threats', path: '/threats', icon: ShieldAlert, badge: metrics.totalThreats },
    { name: 'Attack Intelligence', path: '/attack-intelligence', icon: GitFork },
    { name: 'Forecast', path: '/forecast', icon: TrendingUp, aiBadge: true },
    { name: 'Explainability', path: '/explainability', icon: HelpCircle },
    { name: 'What-if Simulator', path: '/what-if', icon: FlaskConical, heroBadge: 'HERO' },
    { name: 'Recommendations', path: '/recommendations', icon: CheckCircle2, badge: '7' },
  ];

  const monitoringItems = [
    { name: 'Events Stream', path: '/events', icon: Activity, live: true },
    { name: 'Systems Monitored', path: '/systems', icon: Server, badge: metrics.systemsMonitored },
  ];

  const settingsItems = [
    { name: 'Settings & Config', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">SENTINEL<span className="text-indigo-600">FLOW</span></span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Enterprise SOC Suite</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation links scroll area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Core Workflow
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/threats' && location.pathname.startsWith('/threats'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.heroBadge && (
                        <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                          {item.heroBadge}
                        </span>
                      )}
                      {item.aiBadge && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles className="h-2.5 w-2.5" /> AI
                        </span>
                      )}
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-indigo-200 text-indigo-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Monitoring Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monitoring & Assets
            </div>
            <nav className="space-y-1">
              {monitoringItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.live && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        LIVE
                      </span>
                    )}

                    {item.badge !== undefined && !item.live && (
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Settings Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Configuration
            </div>
            <nav className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Selected Threat Context Quick-Card in Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <NavLink
            to={`/threats/${selectedThreat.id}`}
            className="block p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span className="uppercase tracking-wider">Active Threat</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="font-semibold text-slate-900 text-xs truncate">{selectedThreat.name}</div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
              <span>{selectedThreat.affectedSystem}</span>
              <span className="font-bold text-red-600">{selectedThreat.riskScore}/100</span>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
