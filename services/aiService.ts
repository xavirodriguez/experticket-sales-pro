
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

/**
 * Service for interacting with the Google Gemini AI model.
 *
 * @remarks
 * This service provides assistance to sales agents by answering questions
 * related to the Experticket platform and its sales processes.
 */
export class AiService {
  /**
   * Fetches a response from the AI model based on the user's prompt.
   *
   * @param userPrompt - The question or message from the sales agent.
   * @returns A promise that resolves to the text response from the AI.
   * @throws Error If the Gemini API key is not configured or the AI service request fails.
   */
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

  /**
   * Retrieves the Gemini API key from environment variables.
   * @internal
   * @returns The configured API key.
   * @throws Error if no API key is found in the environment.
   */
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
