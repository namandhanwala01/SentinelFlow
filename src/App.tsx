import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThreatProvider } from './context/ThreatContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ThreatsPage } from './pages/ThreatsPage';
import { ThreatDetailPage } from './pages/ThreatDetailPage';
import { AttackIntelPage } from './pages/AttackIntelPage';
import { ForecastPage } from './pages/ForecastPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { EventsPage } from './pages/EventsPage';
import { SystemsPage } from './pages/SystemsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThreatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="threats" element={<ThreatsPage />} />
            <Route path="threats/:id" element={<ThreatDetailPage />} />
            <Route path="attack-intelligence" element={<AttackIntelPage />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="explainability" element={<ExplainabilityPage />} />
            <Route path="what-if" element={<WhatIfPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="systems" element={<SystemsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThreatProvider>
  );
};

export default App;
