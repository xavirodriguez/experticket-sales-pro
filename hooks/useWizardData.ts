
import { useState, useEffect, useCallback } from 'react';
import { Provider, CatalogResponse, ExperticketConfig } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Handles the initial data loading for the sale wizard.
 *
 * @param service - The Experticket service instance.
 * @returns An object containing providers, catalog, and an error message.
 * @internal
 */
export const useWizardData = (service: ExperticketService) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [providersResponse, catalogResponse] = await Promise.all([
        service.getProviders(),
        service.getCatalog()
      ]);
      setProviders(providersResponse.Providers || []);
      setCatalog(catalogResponse);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load initial data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { providers, catalog, loading, dataError: error };
};
