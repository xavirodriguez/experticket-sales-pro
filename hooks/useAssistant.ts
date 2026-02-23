
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

export interface AssistantMessage {
  role: 'user' | 'bot';
  text: string;
}

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

const getApiKey = () => {
  return (import.meta as any).env.VITE_GEMINI_API_KEY
    || (process.env as any).GEMINI_API_KEY
    || (process.env as any).API_KEY;
};

export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'bot', text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const appendMessage = useCallback((role: AssistantMessage['role'], text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  const generateAIResponse = async (prompt: string, apiKey: string) => {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: SYSTEM_INSTRUCTION });
    const result = await model.generateContent(prompt);
    return (await result.response).text();
  };

  const sendMessage = useCallback(async (prompt: string) => {
    const apiKey = getApiKey();
    if (!prompt.trim() || !apiKey) {
      if (!apiKey) appendMessage('bot', "API Key not configured. Please check your settings.");
      return;
    }

    appendMessage('user', prompt);
    setIsLoading(true);
    try {
      const text = await generateAIResponse(prompt, apiKey);
      appendMessage('bot', text || "I'm sorry, I couldn't generate a response.");
    } catch (err) {
      appendMessage('bot', "Error connecting to AI service. Please check your configuration.");
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  return { messages, isLoading, sendMessage };
};
