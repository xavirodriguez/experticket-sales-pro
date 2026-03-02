
import React from 'react';
import { AssistantMessage } from '../../hooks/useAssistant';

interface MessageBubbleProps {
  message: AssistantMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`
      max-w-[80%] p-3 rounded-2xl text-sm
      ${message.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'}
    `}>
      {message.text}
    </div>
  </div>
);

export default MessageBubble;
