
import React, { useState } from 'react';
import { useAssistant } from '../hooks/useAssistant';
import ToggleButton from './assistant/ToggleButton';
import AssistantHeader from './assistant/AssistantHeader';
import AssistantMessages from './assistant/AssistantMessages';
import AssistantInput from './assistant/AssistantInput';

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

export default Assistant;
