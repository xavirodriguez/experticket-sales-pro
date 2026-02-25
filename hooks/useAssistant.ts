
import { useState, useCallback } from 'react';
import { getGeminiApiKey, fetchAIAssistantResponse } from '../services/aiService';

export interface AssistantMessage {
  role: 'user' | 'bot';
  text: string;
}

export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'bot', text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const appendMessage = useCallback((role: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  const handleAIResponse = useCallback(async (prompt: string, apiKey: string) => {
    try {
      const text = await fetchAIAssistantResponse(prompt, apiKey);
      appendMessage('bot', text || "I'm sorry, I couldn't generate a response.");
    } catch (err) {
      appendMessage('bot', "Error connecting to AI service. Please check your configuration.");
    }
  }, [appendMessage]);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      appendMessage('bot', "API Key not configured. Please check your settings.");
      return;
    }

    appendMessage('user', prompt);
    setIsLoading(true);

    await handleAIResponse(prompt, apiKey);

    setIsLoading(false);
  }, [appendMessage, handleAIResponse]);

  return { messages, isLoading, sendMessage };
};
