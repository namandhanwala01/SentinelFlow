import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Settings, Bell, Shield, Sliders, Check, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [threshold, setThreshold] = useState('75');
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [autoForecast, setAutoForecast] = useState(true);
  const [denseView, setDenseView] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & Platform Configuration"
        description="Configure SentinelFlow alert thresholds, AI forecasting sensitivities, notification channels, and operational preferences."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={saved ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
          >
            {saved ? 'Settings Saved' : 'Save Changes'}
          </Button>
        }
      />

      {/* General Settings */}
      <Card title="General Operational Configuration" icon={<Settings className="h-5 w-5" />}>
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Organization & Tenant ID</span>
              <span className="text-xs text-slate-500">SentinelFlow Enterprise Deployment</span>
            </div>
            <input
              type="text"
              readOnly
              value="TENANT-SENTINEL-CORP-01"
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 w-64"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">AI Forecast Sensitivity Threshold</span>
              <span className="text-xs text-slate-500">Minimum probability required to flag next stage escalation</span>
            </div>
            <select
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="60">60% (High Recall - Early Warning)</option>
              <option value="75">75% (Balanced - Recommended)</option>
              <option value="90">90% (High Precision - Low Noise)</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">Continuous Markov Trajectory Modeling</span>
              <span className="text-xs text-slate-500">Automatically recompute forecasts as new telemetry arrives</span>
            </div>
            <input
              type="checkbox"
              checked={autoForecast}
              onChange={(e) => setAutoForecast(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Notifications Settings */}
      <Card title="Alert Channels & Notifications" icon={<Bell className="h-5 w-5" />}>
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Critical PagerDuty / Slack Dispatch</span>
              <span className="text-xs text-slate-500">Trigger instant webhook on risk score ≥ 80</span>
            </div>
            <input
              type="checkbox"
              checked={notifySlack}
              onChange={(e) => setNotifySlack(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">SOC Lead Email Digest</span>
              <span className="text-xs text-slate-500">Daily incident summary & forecasting retrospective report</span>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Interface & Display Preferences */}
      <Card title="Interface & Console Preferences" icon={<Sliders className="h-5 w-5" />}>
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Visual Theme</span>
              <span className="text-xs text-slate-500">Enterprise High-Contrast Light Security Theme (Enforced)</span>
            </div>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Enterprise Light Mode
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block">Information-Dense Table View</span>
              <span className="text-xs text-slate-500">Compact row spacing for multi-monitor SOC setups</span>
            </div>
            <input
              type="checkbox"
              checked={denseView}
              onChange={(e) => setDenseView(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
