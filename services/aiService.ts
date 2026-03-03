
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

export class AiService {
  static async fetchResponse(userPrompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    const generativeAI = new GoogleGenAI(apiKey);
    const aiModel = generativeAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const generationResult = await aiModel.generateContent(userPrompt);
    const aiResponse = await generationResult.response;
    return aiResponse.text();
  }

  private static getApiKey(): string {
    const environment = import.meta as any;
    const apiKey = environment.env?.VITE_GEMINI_API_KEY ||
                   process.env?.GEMINI_API_KEY ||
                   process.env?.API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API Key is not configured in environment variables");
    }
    return apiKey;
  }
}
