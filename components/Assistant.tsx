
import React, { useState, useCallback } from 'react';
import { useAssistant } from '../hooks/useAssistant';
import ToggleButton from './assistant/ToggleButton';
import AssistantModal from './assistant/AssistantModal';

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

  const handleSend = useCallback(async () => {
    if (!userPrompt.trim()) return;
    const currentPrompt = userPrompt;
    setUserPrompt('');
    await sendMessage(currentPrompt);
  }, [userPrompt, sendMessage]);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const closeAssistant = useCallback(() => setIsOpen(false), []);

  return (
    <div className="relative">
      <ToggleButton isOpen={isOpen} onClick={toggleOpen} />

      {isOpen && (
        <AssistantModal
          messages={messages}
          isLoading={isLoading}
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onSend={handleSend}
          onClose={closeAssistant}
        />
      )}
    </div>
  );
};

export default Assistant;
