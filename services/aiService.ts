
import { GoogleGenAI } from '@google/genai';

/**
 * System instruction to guide the AI assistant's persona and behavior.
 * @internal
 */
const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

/**
 * Interacts with the Google Gemini AI model for sales assistance.
 *
 * @remarks
 * This service provides assistance to sales agents by answering questions
 * related to the Experticket platform and its sales processes.
 * It uses the Google Generative AI (Gemini) SDK.
 */
export class AiService {
  /**
   * Fetches a response from the AI model based on the user's prompt.
   *
   * @param userPrompt - The question or message from the sales agent.
   * @returns A promise that resolves to the text response from the AI.
   * @throws Error If the Gemini API key is not configured or the AI service request fails.
   *
   * @example
   * ```typescript
   * const response = await AiService.fetchResponse("What is a reservation expiry?");
   * console.log(response); // "A reservation expiry is the amount of time in minutes..."
   * ```
   */
  static async fetchResponse(userPrompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    const generativeAI = new GoogleGenAI(apiKey);
    const aiModel = this.getAiModel(generativeAI);

    const generationResult = await aiModel.generateContent(userPrompt);
    const aiResponse = await generationResult.response;
    return aiResponse.text();
  }

  /**
   * Configures and retrieves the Gemini AI model instance.
   * @internal
   * @param generativeAI - The Google GenAI client instance.
   * @returns The configured generative model.
   */
  private static getAiModel(generativeAI: GoogleGenAI) {
    return generativeAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });
  }

  /**
   * Retrieves the Gemini API key from environment variables.
   * @internal
   * @returns The configured API key.
   * @throws Error if no API key is found in the environment.
   */
  private static getApiKey(): string {
    const apiKey = (import.meta as ImportMeta).env?.VITE_GEMINI_API_KEY ||
                   process.env?.GEMINI_API_KEY ||
                   process.env?.API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API Key is not configured in environment variables");
    }
    return apiKey;
  }
}
