import React from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { SystemsTable } from '../components/systems/SystemsTable';
import { Server, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const SystemsPage: React.FC = () => {
  const { systems } = useThreatContext();

  const total = systems.length;
  const healthy = systems.filter((s) => s.status === 'Healthy').length;
  const atRisk = systems.filter((s) => s.status === 'At Risk').length;
  const critical = systems.filter((s) => s.status === 'Critical').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitored Infrastructure & Hosts"
        description="Comprehensive asset health inventory, host risk scores, telemetry agent status, and active threat assignments."
        badge={
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
            {total} Total Monitored Nodes
          </span>
        }
      />

      {/* Top 4 Infrastructure Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Systems"
          value={total}
          icon={Server}
          variant="brand"
          subtext="Domain & DMZ nodes"
        />
        <MetricCard
          label="Healthy Systems"
          value={healthy}
          icon={ShieldCheck}
          variant="low"
          trend={{ value: `${Math.round((healthy / total) * 100)}%`, label: 'of fleet', isPositive: true }}
        />
        <MetricCard
          label="At Risk"
          value={atRisk}
          icon={AlertTriangle}
          variant="high"
          trend={{ value: 'Elevated Telemetry', isPositive: false }}
        />
        <MetricCard
          label="Critical Systems"
          value={critical}
          icon={ShieldAlert}
          variant="critical"
          trend={{ value: 'Immediate Action', isPositive: false }}
        />
      </div>

      {/* Systems Table */}
      <SystemsTable systems={systems} />
    </div>
  );
};
