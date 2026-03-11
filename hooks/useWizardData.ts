
import React, { useState, useCallback, useEffect } from 'react';
import { Provider, CatalogResponse } from '../types';
import ExperticketService from '../services/experticketService';

interface WizardDataParams {
  experticketService: ExperticketService;
  onExecuteAction: (action: () => Promise<void>) => Promise<void>;
}

/**
 * Hook for managing the loading of initial wizard data (providers and catalog).
 *
 * @param params - Configuration parameters.
 * @internal
 */
export const useWizardData = ({ experticketService, onExecuteAction }: WizardDataParams) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | undefined>(undefined);

  const loadInitialData = useCallback(async () => {
    const [providersResponse, catalogResponse] = await Promise.all([
      experticketService.getProviders(),
      experticketService.getCatalog()
    ]);
    setProviders(providersResponse.Providers || []);
    setCatalog(catalogResponse);
  }, [experticketService]);

  useEffect(() => {
    onExecuteAction(loadInitialData);
  }, [onExecuteAction, loadInitialData]);

  return { providers, catalog };
};
