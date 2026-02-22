
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  History,
  FileText,
  XCircle,
  Settings as SettingsIcon,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isTest: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{ to: string; icon: React.ElementType; children: React.ReactNode; onClick: () => void }> = ({
  to,
  icon: Icon,
  children,
  onClick
}) => (
  <NavLink
    to={to}
    onClick={onClick}
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isTest, onClose }) => {
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <SidebarLogo />
          <nav className="space-y-2">
            <NavItem to="/" icon={LayoutDashboard} onClick={onClose}>Dashboard</NavItem>
            <NavItem to="/new-sale" icon={ShoppingBag} onClick={onClose}>New Sale</NavItem>
            <NavItem to="/transactions" icon={History} onClick={onClose}>Transactions</NavItem>
            <NavItem to="/documents" icon={FileText} onClick={onClose}>Docs & Codes</NavItem>
            <NavItem to="/cancellations" icon={XCircle} onClick={onClose}>Cancellations</NavItem>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <NavItem to="/settings" icon={SettingsIcon} onClick={onClose}>Settings</NavItem>
          <TestModeIndicator isTest={isTest} />
        </div>
      </div>
    </aside>
  );
};

const SidebarLogo: React.FC = () => (
  <div className="flex items-center space-x-3 mb-8">
    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
      <ShoppingBag size={24} />
    </div>
    <div>
      <h1 className="text-xl font-bold tracking-tight">Experticket</h1>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Sales Pro</p>
    </div>
  </div>
);

const TestModeIndicator: React.FC<{ isTest: boolean }> = ({ isTest }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center justify-between text-xs mb-2">
      <span className="text-gray-500">Test Mode</span>
      <span className={`font-bold ${isTest ? 'text-orange-500' : 'text-green-500'}`}>
        {isTest ? 'ENABLED' : 'OFF'}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${isTest ? 'bg-orange-400 w-full' : 'bg-green-400 w-full'}`} />
    </div>
  </div>
);

export default Sidebar;
