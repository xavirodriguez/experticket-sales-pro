
import React from 'react';
import { AssistantMessage } from '../../hooks/useAssistant';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';

interface AssistantMessagesProps {
  messages: AssistantMessage[];
  isLoading: boolean;
}

const AssistantMessages: React.FC<AssistantMessagesProps> = ({ messages, isLoading }) => (
  <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
    {messages.map((m, idx) => (
      <MessageBubble key={idx} message={m} />
    ))}
    {isLoading && <LoadingBubble />}
  </div>
);

export default AssistantMessages;
