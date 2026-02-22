
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

export interface AssistantMessage {
  role: 'user' | 'bot';
  text: string;
}

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'bot', text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (prompt: string) => {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || (process.env as any).API_KEY;

    if (!prompt.trim() || !apiKey) {
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'bot', text: "API Key not configured. Please check your settings." }]);
      }
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: text || "I'm sorry, I couldn't generate a response." }]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI service. Please check your configuration." }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage
  };
};
