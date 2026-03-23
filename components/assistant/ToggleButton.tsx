
import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick }) => (
  <button
    type="button"
    aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition shadow-blue-100"
  >
    {isOpen ? <X size={16} /> : <Sparkles size={16} />}
    <span className="text-sm font-bold">AI Helper</span>
  </button>
);

export default ToggleButton;
