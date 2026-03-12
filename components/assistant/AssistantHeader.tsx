
import React from 'react';
import { Bot, X } from 'lucide-react';

interface AssistantHeaderProps {
  onClose: () => void;
}

const AssistantHeader: React.FC<AssistantHeaderProps> = ({ onClose }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
    <div className="flex items-center space-x-2">
      <Bot size={20} />
      <span className="font-bold">Experticket Assistant</span>
    </div>
    <button
      type="button"
      aria-label="Close assistant"
      onClick={onClose}
      className="hover:bg-white/20 p-1 rounded-lg"
    >
      <X size={20} />
    </button>
  </div>
);

export default AssistantHeader;
