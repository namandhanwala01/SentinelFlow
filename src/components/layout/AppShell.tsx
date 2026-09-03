import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (Offset by sidebar width on large screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <TopHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">SentinelFlow AI</span> — Next-Generation Cyber Threat Forecasting & Defense Simulation.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center justify-center gap-4 text-[11px]">
            <span>Prototype v1.0.0 (Frontend Demo)</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All systems nominal
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
