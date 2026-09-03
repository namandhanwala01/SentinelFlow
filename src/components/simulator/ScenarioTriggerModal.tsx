import React, { useState } from 'react';
import { useThreatContext } from '../../context/ThreatContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SentinelFlowAPI } from '../../services/api';
import {
  FlaskConical,
  Play,
  X,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ScenarioTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioTriggerModal: React.FC<ScenarioTriggerModalProps> = ({ isOpen, onClose }) => {
  const { triggerScenario, refreshTelemetry } = useThreatContext();
  const [selectedScenario, setSelectedScenario] = useState<string>('privilege_escalation');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'custom'>('scenarios');

  // Custom Raw JSON payload state
  const [customJson, setCustomJson] = useState<string>(
    JSON.stringify(
      {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event_type: 'login',
        user: 'rahul.admin',
        source_ip: '185.220.101.5',
        destination_host: 'DC-01',
        destination_ip: '10.0.4.12',
        status: 'failed',
        severity: 'HIGH',
        device: 'Active Directory Security Sensor',
        details: 'Multiple failed Kerberos pre-authentication attempts from untrusted proxy.',
      },
      null,
      2
    )
  );
  const [customStatus, setCustomStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'normal_activity',
      name: 'Normal Operational Telemetry',
      category: 'Baseline',
      badgeVariant: 'low' as const,
      description: 'Routine scheduled backups, standard Active Directory logins, and DNS health queries.',
      stages: 'Normal / Benign',
    },
    {
      id: 'port_scanning',
      name: 'SYN Port Sweep & Discovery',
      category: 'Reconnaissance',
      badgeVariant: 'medium' as const,
      description: 'Rapid sequential probe of sensitive service ports (88, 389, 445) on core domain controllers.',
      stages: 'Stage 1: Reconnaissance',
    },
    {
      id: 'brute_force',
      name: 'Distributed Brute Force Spray',
      category: 'Authentication',
      badgeVariant: 'high' as const,
      description: 'Burst of failed Kerberos / VPN authentications followed by account lockout alerts.',
      stages: 'Stage 2: Initial Access',
    },
    {
      id: 'suspicious_login',
      name: 'Suspicious Off-Hours Admin Login',
      category: 'Identity',
      badgeVariant: 'high' as const,
      description: 'Privileged service account authentication from an unregistered TLS JA4 fingerprint and proxy ASN.',
      stages: 'Stage 2: Initial Access',
    },
    {
      id: 'privilege_escalation',
      name: 'SeImpersonate Token Escalation',
      category: 'Privilege',
      badgeVariant: 'critical' as const,
      description: 'Web worker process abusing named pipes to elevate privileges to NT AUTHORITY\\SYSTEM.',
      stages: 'Stage 5: Privilege Escalation',
    },
    {
      id: 'lateral_movement',
      name: 'Lateral Remote WMI Execution',
      category: 'Lateral',
      badgeVariant: 'high' as const,
      description: 'Remote command invocation targeting administrative shares (C$) on adjacent file servers.',
      stages: 'Stage 7: Lateral Movement',
    },
    {
      id: 'data_exfiltration',
      name: 'High-Bandwidth Encrypted Egress',
      category: 'Exfiltration',
      badgeVariant: 'high' as const,
      description: 'Anomalous 4.2 GB data transfer over port 8443 from database node to external VPS.',
      stages: 'Stage 8: Exfiltration',
    },
    {
      id: 'multi_stage_attack',
      name: 'Full Multi-Stage Kill Chain Attack',
      category: 'APT Sequence',
      badgeVariant: 'critical' as const,
      description: 'Complete coordinated progression: Port Sweep → Auth Guessing → Token Escalation → Lateral WMI → Egress.',
      stages: 'Multi-Stage 1 → 8',
    },
  ];

  const handleExecuteScenario = async (scenarioId: string) => {
    setIsExecuting(true);
    setLastResult(null);
    try {
      const res = await triggerScenario(scenarioId);
      setLastResult(res);
      await refreshTelemetry();
    } catch (err: any) {
      setLastResult({ error: err.message || 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleIngestCustom = async () => {
    setIsExecuting(true);
    setCustomStatus(null);
    try {
      const parsed = JSON.parse(customJson);
      const res = await SentinelFlowAPI.ingestRawEvent(parsed);
      setCustomStatus(
        `✅ Ingested successfully! Event ID: ${res.data?.id}. Threat detected: ${res.threatDetected ? 'YES (' + res.threat?.name + ')' : 'NO (Baseline)'}`
      );
      await refreshTelemetry();
    } catch (err: any) {
      setCustomStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FlaskConical className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-2">
                Security Event & Attack Scenario Simulator
              </h2>
              <p className="text-xs text-slate-300">
                Trigger realistic MITRE ATT&CK attack vectors directly into the AI normalization & detection pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 px-6 pt-4 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'scenarios'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pre-Configured Scenarios (8)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw JSON Ingestion Test
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'scenarios' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    selectedScenario === sc.id
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant={sc.badgeVariant} size="sm">
                        {sc.category}
                      </Badge>
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        {sc.stages}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{sc.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sc.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">ID: {sc.id}</span>
                    <Button
                      variant={selectedScenario === sc.id ? 'primary' : 'outline'}
                      size="sm"
                      icon={<Play className="h-3 w-3" />}
                      isLoading={isExecuting && selectedScenario === sc.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScenario(sc.id);
                        handleExecuteScenario(sc.id);
                      }}
                      className="text-xs"
                    >
                      Trigger Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-indigo-600" /> Raw Telemetry Payload (JSON)
                </span>
                <span className="text-[11px] text-slate-500">
                  Matches SentinelFlow Normalization Schema
                </span>
              </div>
              <textarea
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                rows={10}
                className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {customStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    customStatus.startsWith('✅')
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {customStatus}
                </div>
              )}
            </div>
          )}

          {/* Feedback & Last Result Banner */}
          {lastResult && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Scenario Executed Successfully!
              </div>
              <p className="text-slate-700">
                {lastResult.message ||
                  `Generated ${lastResult.data?.eventsGeneratedCount || 1} telemetry event(s) and processed them through the AI pipeline.`}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>AI Normalization & Risk Scoring Pipeline Online</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {activeTab === 'scenarios' ? (
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="h-3.5 w-3.5" />}
                isLoading={isExecuting}
                onClick={() => handleExecuteScenario(selectedScenario)}
              >
                Execute Selected Scenario
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="h-3.5 w-3.5" />}
                isLoading={isExecuting}
                onClick={handleIngestCustom}
              >
                Ingest Payload
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
