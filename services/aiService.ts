
/**
 * System instruction to guide the AI assistant's persona and behavior.
 * @internal
 */
const SYSTEM_INSTRUCTION = "You are an expert sales support assistant for the Experticket platform. You help agents understand ticketing terminology, provider rules, and the sales flow (Capacity -> Price -> Reservation -> Transaction). Keep answers professional, concise, and helpful.";

/**
 * Interacts with the AI model for sales assistance via REST API.
 *
 * @remarks
 * This service provides assistance to sales agents by answering questions
 * related to the Experticket platform and its sales processes.
 * It uses the Gemini REST API directly to avoid external SDK dependencies.
 */
export class AiService {
  /**
   * Fetches a response from the AI model based on the user's prompt.
   *
   * @param userPrompt - The question or message from the sales agent.
   * @returns A promise that resolves to the text response from the AI.
   * @throws Error If the AI API key is not configured or the AI service request fails.
   *
   * @example
   * ```typescript
   * const response = await AiService.fetchResponse("What is a reservation expiry?");
   * console.log(response); // "A reservation expiry is the amount of time in minutes..."
   * ```
   */
  static async fetchResponse(userPrompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userPrompt }]
        }],
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `AI service request failed with status ${response.status}`);
    }

    const data = await response.json();
    return this.extractTextFromResponse(data);
  }

  /**
   * Extracts the text content from the Gemini API response.
   * @internal
   * @param data - The parsed JSON response from the API.
   * @returns The extracted text content.
   * @throws Error if the response format is invalid.
   */
  private static extractTextFromResponse(data: unknown): string {
    const response = data as {
      candidates?: {
        content?: {
          parts?: { text?: string }[];
        };
      }[];
    };

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Invalid response format from AI service");
    }
    return text;
  }

  /**
   * Retrieves the AI API key from environment variables.
   * @internal
   * @returns The configured API key.
   * @throws Error if no API key is found in the environment.
   */
  private static getApiKey(): string {
    const metaEnv = (import.meta as any).env;
    const apiKey = metaEnv?.VITE_AI_API_KEY ||
                   process.env?.AI_API_KEY ||
                   process.env?.API_KEY;

    if (!apiKey) {
      throw new Error("AI API Key is not configured in environment variables");
    }
    return apiKey;
  }
}
