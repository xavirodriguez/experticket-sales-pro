
import { useState, useCallback } from 'react';
import { AiService } from '../services/aiService';

export interface AssistantMessage {
  role: 'user' | 'bot';
  text: string;
}

const INITIAL_MESSAGE: AssistantMessage = {
  role: 'bot',
  text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?'
};

export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const appendMessage = useCallback((role: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  const sendMessage = useCallback(async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    appendMessage('user', userPrompt);
    setIsLoading(true);

    try {
      const aiResponse = await AiService.fetchResponse(userPrompt);
      appendMessage('bot', aiResponse || "I'm sorry, I couldn't generate a response.");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error connecting to AI service.";
      appendMessage('bot', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  return { messages, isLoading, sendMessage };
};
