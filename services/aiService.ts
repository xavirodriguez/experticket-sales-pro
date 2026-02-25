
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

export const getGeminiApiKey = (): string | undefined => {
  return (import.meta as any).env.VITE_GEMINI_API_KEY ||
         (process.env as any).GEMINI_API_KEY ||
         (process.env as any).API_KEY;
};

export const fetchAIAssistantResponse = async (prompt: string, apiKey: string): Promise<string> => {
  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
