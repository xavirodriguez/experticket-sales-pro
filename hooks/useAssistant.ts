
import { useState, useCallback } from 'react';
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

const INITIAL_MESSAGE: AssistantMessage = {
  role: 'bot',
  text: 'Hello! I am your Sales Assistant. How can I help you with Experticket bookings today?'
};

/**
 * Hook for managing the state and interactions with the AI sales assistant.
 *
 * @returns An object containing the message history, loading state, and a function to send messages.
 *
 * @example
 * ```tsx
 * const { messages, isLoading, sendMessage } = useAssistant();
 * ```
 */
export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Appends a new message to the chat history.
   * @internal
   */
  const appendMessage = useCallback((role: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  /**
   * Sends a user prompt to the AI service and updates the chat history with the response.
   *
   * @param userPrompt - The message text from the user.
   */
  const sendMessage = useCallback(async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    appendMessage('user', userPrompt);
    setIsLoading(true);

    try {
      const aiResponse = await AiService.fetchResponse(userPrompt);
      appendMessage('bot', aiResponse || "I'm sorry, I couldn't generate a response.");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error connecting to AI service.";
      appendMessage('bot', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  return { messages, isLoading, sendMessage };
};
