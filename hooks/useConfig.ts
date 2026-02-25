
import { useState, useEffect, useCallback } from 'react';
import { ExperticketConfig } from '../types';

const INITIAL_CONFIG: ExperticketConfig = {
  partnerId: localStorage.getItem('partnerId') || '',
  apiKey: localStorage.getItem('apiKey') || '',
  baseUrl: localStorage.getItem('baseUrl') || '',
  languageCode: 'en',
  isTest: true
};

export const useConfig = () => {
  const [config, setConfig] = useState<ExperticketConfig>(INITIAL_CONFIG);

  useEffect(() => {
    localStorage.setItem('partnerId', config.partnerId);
    localStorage.setItem('apiKey', config.apiKey);
    localStorage.setItem('baseUrl', config.baseUrl);
  }, [config]);

  const updateConfig = useCallback((updates: Partial<ExperticketConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return { config, updateConfig };
};
