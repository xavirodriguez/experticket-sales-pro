
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { 
  ShoppingBag, 
  History, 
  FileText, 
  XCircle, 
  Settings as SettingsIcon,
  LayoutDashboard,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import NewSaleWizard from './components/NewSaleWizard';
import TransactionManager from './components/TransactionManager';
import CancellationManager from './components/CancellationManager';
import DocumentsPanel from './components/DocumentsPanel';
import Settings from './components/Settings';
import Assistant from './components/Assistant';
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

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const NavItem = ({ to, icon: Icon, children }: any) => (
    <NavLink
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
        }`
      }
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </NavLink>
  );

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Experticket</h1>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Sales Pro</p>
                </div>
              </div>

              <nav className="space-y-2">
                <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
                <NavItem to="/new-sale" icon={ShoppingBag}>New Sale</NavItem>
                <NavItem to="/transactions" icon={History}>Transactions</NavItem>
                <NavItem to="/documents" icon={FileText}>Docs & Codes</NavItem>
                <NavItem to="/cancellations" icon={XCircle}>Cancellations</NavItem>
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-100">
              <NavItem to="/settings" icon={SettingsIcon}>Settings</NavItem>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500">Test Mode</span>
                  <span className={`font-bold ${config.isTest ? 'text-orange-500' : 'text-green-500'}`}>
                    {config.isTest ? 'ENABLED' : 'OFF'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${config.isTest ? 'bg-orange-400 w-full' : 'bg-green-400 w-full'}`} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            <button onClick={toggleSidebar} className="lg:hidden text-gray-500 p-2 -ml-2">
              <Menu size={24} />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Sales Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Assistant />
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                SA
              </div>
            </div>
          </header>

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

const DashboardView: React.FC<{ config: ExperticketConfig }> = ({ config }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <span className="text-xs font-bold text-blue-600">+12% vs last week</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Active Reservations</p>
        <h3 className="text-2xl font-bold mt-1">24</h3>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <History size={20} />
          </div>
          <span className="text-xs font-bold text-green-600">+5% vs last week</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Daily Transactions</p>
        <h3 className="text-2xl font-bold mt-1">142</h3>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <FileText size={20} />
          </div>
          <span className="text-xs font-bold text-gray-400">Stable</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Catalog Items</p>
        <h3 className="text-2xl font-bold mt-1">1,204</h3>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome back, Sales Agent</h2>
        <p className="text-gray-600 mb-6">
          Ready to process new bookings? Use the <span className="font-semibold text-blue-600">New Sale Wizard</span> to guide you through capacity checks, pricing, and reservation.
        </p>
        <Link 
          to="/new-sale"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Start New Sale
        </Link>
      </div>
    </div>
  </div>
);

export default App;
