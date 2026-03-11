
import React, { useState, useCallback } from 'react';
import { AiService } from '../services/aiService';

/**
 * Represents a single message in the assistant chat history.
 */
export interface AssistantMessage {
  /** The sender of the message. */
  role: 'user' | 'bot';
  /** The message text content. */
  text: string;
}

/**
 * Initial greeting from the AI assistant.
 * @internal
 */
const INITIAL_MESSAGE: AssistantMessage = {
  role: 'bot',
  text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?'
};

/**
 * Manages the state and interactions with the AI sales assistant.
 *
 * @remarks
 * This hook maintains a history of messages and provides a function to send
 * new user prompts to the AI service. It handles loading states and errors
 * during communication.
 *
 * @returns An object containing the message history, loading state, and a function to send messages.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { messages, isLoading, sendMessage } = useAssistant();
 *   return (
 *     <div>
 *       {messages.map((m, i) => <div key={i}>{m.text}</div>)}
 *       <button onClick={() => sendMessage("Help!")} disabled={isLoading}>
 *         Send
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Appends a new message to the chat history.
   * @internal
   * @param role - The sender's role.
   * @param text - The message content.
   */
  const appendMessage = useCallback((role: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  /**
   * Processes the AI response and updates the state.
   * @internal
   */
  const processAiResponse = useCallback(async (prompt: string) => {
    try {
      const response = await AiService.fetchResponse(prompt);
      appendMessage('bot', response || "I'm sorry, I couldn't generate a response.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error connecting to AI service.";
      appendMessage('bot', message);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  /**
   * Sends a user prompt to the AI service and updates the chat history.
   *
   * @param userPrompt - The message text from the user.
   */
  const sendMessage = useCallback(async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    appendMessage('user', userPrompt);
    setIsLoading(true);
    await processAiResponse(userPrompt);
  }, [appendMessage, processAiResponse]);

  return { messages, isLoading, sendMessage };
};
