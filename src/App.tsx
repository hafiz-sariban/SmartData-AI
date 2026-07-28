import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';
import { DashboardPage } from './pages/DashboardPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { AnalysisHubPage } from './pages/AnalysisHubPage';
import { MarketingPage } from './pages/MarketingPage';
import { RevenueRecoveryPage } from './pages/RevenueRecoveryPage';
import { DemandForecasterPage } from './pages/DemandForecasterPage';
import { MicroDashboardPage } from './pages/MicroDashboardPage';
import { AICMOPage } from './pages/AICMOPage';
import { SettingsPage } from './pages/SettingsPage';
import { MicroStoreProvider } from './lib/microStore';
import { CmoStoreProvider } from './lib/cmoStore';

function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar onChatToggle={() => setChatOpen(!chatOpen)} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<DataUploadPage />} />
            <Route path="/analysis" element={<AnalysisHubPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/recovery" element={<RevenueRecoveryPage />} />
            <Route path="/demand-forecaster" element={<DemandForecasterPage />} />
            <Route path="/micro-dashboard" element={<MicroStoreProvider><MicroDashboardPage /></MicroStoreProvider>} />
            <Route path="/ai-cmo" element={<CmoStoreProvider><AICMOPage /></CmoStoreProvider>} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
