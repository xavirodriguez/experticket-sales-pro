
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NewSaleWizard from './components/NewSaleWizard';
import TransactionManager from './components/TransactionManager';
import CancellationManager from './components/CancellationManager';
import DocumentsPanel from './components/DocumentsPanel';
import Settings from './components/Settings';
import DashboardView from './components/DashboardView';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { ExperticketConfig } from './types';

const INITIAL_CONFIG: ExperticketConfig = {
  partnerId: localStorage.getItem('partnerId') || '',
  apiKey: localStorage.getItem('apiKey') || '',
  baseUrl: localStorage.getItem('baseUrl') || '',
  languageCode: 'en',
  isTest: true
};

const App: React.FC = () => {
  const [config, setConfig] = useState<ExperticketConfig>(INITIAL_CONFIG);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('partnerId', config.partnerId);
    localStorage.setItem('apiKey', config.apiKey);
    localStorage.setItem('baseUrl', config.baseUrl);
  }, [config]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {isSidebarOpen && <MobileBackdrop onClick={closeSidebar} />}

        <Sidebar
          isOpen={isSidebarOpen}
          isTest={config.isTest}
          onClose={closeSidebar}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={toggleSidebar} />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<DashboardView config={config} />} />
                <Route path="/new-sale" element={<NewSaleWizard config={config} />} />
                <Route path="/transactions" element={<TransactionManager config={config} />} />
                <Route path="/documents" element={<DocumentsPanel config={config} />} />
                <Route path="/cancellations" element={<CancellationManager config={config} />} />
                <Route path="/settings" element={<Settings config={config} onUpdate={setConfig} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const MobileBackdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
    onClick={onClick}
  />
);

export default App;
