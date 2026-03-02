
import React from 'react';
import { Send } from 'lucide-react';

interface AssistantInputProps {
  prompt: string;
  setPrompt: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const AssistantInput: React.FC<AssistantInputProps> = ({ prompt, setPrompt, onSend, isLoading }) => (
  <div className="p-4 bg-white border-t border-gray-100">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask me anything about the flow..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !prompt.trim()}
        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
      >
        <Send size={18} />
      </button>
    </div>
  </div>
);

export default AssistantInput;
