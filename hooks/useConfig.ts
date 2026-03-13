import { useState, useEffect, useCallback } from 'react';
import { ExperticketConfig } from '../types';

/**
 * Storage keys used for persisting configuration in localStorage.
 * @internal
 */
const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  BASE_URL: 'baseUrl',
  IS_TEST: 'isTest'
};

/**
 * Retrieves the initial configuration from localStorage or defaults.
 *
 * @remarks
 * The API key is intentionally not retrieved from localStorage to prevent XSS exposure.
 *
 * @returns The stored configuration or a default one.
 * @internal
 */
const loadStoredConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: '', // API key is never persisted for security reasons
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: localStorage.getItem(STORAGE_KEYS.IS_TEST) !== 'false' // default to true
});

/**
 * Hook for managing the Experticket API configuration and its persistence in localStorage.
 *
 * @remarks
 * This hook provides a centralized way to manage API credentials and settings.
 * Changes to non-sensitive configuration are automatically synchronized with
 * the browser's local storage.
 *
 * The `apiKey` is intentionally kept only in-memory (React state) to mitigate
 * XSS risks.
 *
 * @returns An object containing the current configuration and a function to update it.
 *
 * @example
 * ```tsx
 * function ConfigManager() {
 *   const { config, updateConfig } = useConfig();
 *   return (
 *     <input
 *       value={config.apiKey}
 *       onChange={e => updateConfig({ ...config, apiKey: e.target.value })}
 *     />
 *   );
 * }
 * ```
 */
export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(loadStoredConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER_ID, config.partnerId);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
    localStorage.setItem(STORAGE_KEYS.IS_TEST, String(config.isTest));
  }, [config]);

  /**
   * Updates the current configuration with new values.
   *
   * @param newConfig - The new configuration settings object.
   */
  const updateConfig = useCallback((newConfig: ExperticketConfig) => {
    setConfig(newConfig);
  }, []);

  return { config, updateConfig };
};
