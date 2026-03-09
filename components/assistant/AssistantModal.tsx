
import React from 'react';
import AssistantHeader from './AssistantHeader';
import AssistantMessages from './AssistantMessages';
import AssistantInput from './AssistantInput';
import { AssistantMessage } from '../../hooks/useAssistant';

/**
 * Props for the {@link AssistantModal} component.
 * @internal
 */
interface AssistantModalProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  userPrompt: string;
  setUserPrompt: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
}

/**
 * Renders the modal container for the AI assistant.
 *
 * @param props - Component props.
 * @internal
 */
const AssistantModal: React.FC<AssistantModalProps> = ({
  messages,
  isLoading,
  userPrompt,
  setUserPrompt,
  onSend,
  onClose
}) => (
  <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
    <AssistantHeader onClose={onClose} />
    <AssistantMessages messages={messages} isLoading={isLoading} />
    <AssistantInput
      prompt={userPrompt}
      setPrompt={setUserPrompt}
      onSend={onSend}
      isLoading={isLoading}
    />
  </div>
);

export default AssistantModal;
