
import React, { useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { useAssistant, AssistantMessage } from '../hooks/useAssistant';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { messages, isLoading, sendMessage } = useAssistant();

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const currentPrompt = prompt;
    setPrompt('');
    await sendMessage(currentPrompt);
  };

  return (
    <div className="relative">
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <AssistantHeader onClose={() => setIsOpen(false)} />
          <AssistantMessages messages={messages} isLoading={isLoading} />
          <AssistantInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

const ToggleButton: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition shadow-blue-100"
  >
    <Sparkles size={16} />
    <span className="text-sm font-bold">AI Helper</span>
  </button>
);

const AssistantHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white">
    <div className="flex items-center space-x-2">
      <Bot size={20} />
      <span className="font-bold">Experticket Assistant</span>
    </div>
    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg">
      <X size={20} />
    </button>
  </div>
);

const AssistantMessages: React.FC<{ messages: AssistantMessage[]; isLoading: boolean }> = ({ messages, isLoading }) => (
  <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
    {messages.map((m, idx) => (
      <MessageBubble key={idx} message={m} />
    ))}
    {isLoading && <LoadingBubble />}
  </div>
);

const MessageBubble: React.FC<{ message: AssistantMessage }> = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`
      max-w-[80%] p-3 rounded-2xl text-sm
      ${message.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'}
    `}>
      {message.text}
    </div>
  </div>
);

const LoadingBubble: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  </div>
);

const AssistantInput: React.FC<{
  prompt: string;
  setPrompt: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
}> = ({ prompt, setPrompt, onSend, isLoading }) => (
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

export default Assistant;
