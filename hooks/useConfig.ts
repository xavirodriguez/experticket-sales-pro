
import { useState, useEffect } from 'react';
import { ExperticketConfig } from '../types';

const STORAGE_KEYS = {
  PARTNER_ID: 'partnerId',
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl'
} as const;

const getInitialConfig = (): ExperticketConfig => ({
  partnerId: localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || '',
  apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  baseUrl: localStorage.getItem(STORAGE_KEYS.BASE_URL) || '',
  languageCode: 'en',
  isTest: true
});

export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(getInitialConfig());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER_ID, config.partnerId);
    localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
  }, [config]);

  return { config, setConfig };
};
