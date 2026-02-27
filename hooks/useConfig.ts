
import { useState, useEffect, useCallback } from 'react';
import { ExperticketConfig } from '../types';

const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl'
};

const getInitialConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: true
});

export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(getInitialConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER_ID, config.partnerId);
    localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
  }, [config]);

  const updateConfig = useCallback((newConfig: ExperticketConfig) => {
    setConfig(newConfig);
  }, []);

  return { config, updateConfig };
};
