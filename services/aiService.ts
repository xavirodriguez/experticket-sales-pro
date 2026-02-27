
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

export class AiService {
  private static getApiKey(): string {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
                   (process as any).env?.GEMINI_API_KEY ||
                   (process as any).env?.API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API Key is not configured");
    }
    return apiKey;
  }

  static async fetchResponse(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
