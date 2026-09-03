import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
  User,
  Check,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import { useThreatContext } from '../../context/ThreatContext';
import { useNavigate } from 'react-router-dom';
import { ScenarioTriggerModal } from '../simulator/ScenarioTriggerModal';

interface TopHeaderProps {
  onMenuToggle: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuToggle }) => {
  const { searchQuery, setSearchQuery, selectedThreat, setSelectedThreatId } = useThreatContext();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: '1',
      title: 'High Risk Threat Detected on DC-01',
      time: '2 min ago',
      type: 'critical',
      threatId: 'THREAT-001',
      text: 'Kerberos pre-auth anomaly flagged. 87/100 risk score.',
    },
    {
      id: '2',
      title: 'Attack Forecast Escalation Alert',
      time: '12 min ago',
      type: 'high',
      threatId: 'THREAT-001',
      text: 'Credential Access probability increased to 78%.',
    },
    {
      id: '3',
      title: 'Anomalous Egress on DB-PROD-01',
      time: '25 min ago',
      type: 'medium',
      threatId: 'THREAT-006',
      text: '4.2 GB data transfer detected over port 8443.',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, hosts, IP addresses, MITRE IDs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: SOC Status, Notifications, User profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Attack Simulator Trigger Button */}
        <button
          type="button"
          onClick={() => setSimulatorOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <FlaskConical className="h-4 w-4 text-indigo-600 animate-pulse" />
          <span>Attack Simulator</span>
        </button>

        {/* System Health Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SOC ENGINE ONLINE</span>
        </div>

        {/* Active Threat Quick Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
          <span>Context:</span>
          <strong className="text-slate-900 truncate max-w-[120px]">{selectedThreat.name}</strong>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen) setUnreadCount(0);
            }}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-label="View Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-elevated z-50 py-2 focus:outline-none animate-in fade-in-50 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Security Alerts</span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                    3 New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedThreatId(n.threatId);
                      setNotificationsOpen(false);
                      navigate(`/threats/${n.threatId}`);
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-slate-900">{n.title}</div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.text}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                      <span>Investigate Threat</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/events');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View Full Event Stream →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SA
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">SOC Analyst 1</div>
            <div className="text-[10px] font-medium text-slate-500">Tier 3 Defense</div>
          </div>
        </div>
      </div>

      {/* Simulator Modal */}
      <ScenarioTriggerModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
      />
    </header>
  );
};

