
import { useState, useEffect, useCallback } from 'react';
import { ExperticketConfig } from '../types';

/**
 * Storage keys used for persisting configuration in localStorage.
 * @internal
 */
const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl'
};

/**
 * Retrieves the initial configuration from localStorage or defaults.
 *
 * @returns The stored configuration or a default one.
 * @internal
 * @returns The initial ExperticketConfig object.
 */
const loadStoredConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: true
});

/**
 * Hook for managing the Experticket API configuration and its persistence in localStorage.
 *
 * @remarks
 * This hook provides a centralized way to manage API credentials and settings.
 * Changes to the configuration are automatically synchronized with the browser's
 * local storage.
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
    localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
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
