
import { useState, useEffect, useCallback } from 'react';
import { ExperticketConfig } from '../types';

const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl'
};

/**
 * Retrieves the initial configuration from localStorage or defaults.
 * @internal
 */
const getInitialConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: true
});

/**
 * Hook for managing the Experticket API configuration and its persistence in localStorage.
 *
 * @returns An object containing the current configuration and a function to update it.
 *
 * @example
 * ```tsx
 * const { config, updateConfig } = useConfig();
 * ```
 */
export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(getInitialConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER_ID, config.partnerId);
    localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
  }, [config]);

  /**
   * Updates the current configuration.
   *
   * @param newConfig - The new configuration settings.
   */
  const updateConfig = useCallback((newConfig: ExperticketConfig) => {
    setConfig(newConfig);
  }, []);

  return { config, updateConfig };
};
