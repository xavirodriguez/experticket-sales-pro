
import React from 'react';
import { Menu } from 'lucide-react';
import Assistant from '../Assistant';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 p-2 -ml-2">
        <Menu size={24} />
      </button>
      <div className="flex-1 lg:ml-0 ml-4">
        <h2 className="text-lg font-semibold text-gray-800">Sales Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Assistant />
        <UserAvatar initials="SA" />
      </div>
    </header>
  );
};

const UserAvatar: React.FC<{ initials: string }> = ({ initials }) => (
  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
    {initials}
  </div>
);

export default Header;
