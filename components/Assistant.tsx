
import React, { useState } from 'react';
import { useAssistant } from '../hooks/useAssistant';
import ToggleButton from './assistant/ToggleButton';
import AssistantHeader from './assistant/AssistantHeader';
import AssistantMessages from './assistant/AssistantMessages';
import AssistantInput from './assistant/AssistantInput';

/**
 * An AI-powered sales assistant component.
 *
 * @remarks
 * This component provides a chat interface for sales agents to get assistance
 * with ticketing terminology and platform processes.
 *
 * @example
 * ```tsx
 * <Assistant />
 * ```
 */
const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const { messages, isLoading, sendMessage } = useAssistant();

  /**
   * Handles sending the user prompt to the AI service.
   * @internal
   */
  const handleSend = async () => {
    if (!userPrompt.trim()) return;
    const currentPrompt = userPrompt;
    setUserPrompt('');
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
            prompt={userPrompt}
            setPrompt={setUserPrompt}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Assistant;
