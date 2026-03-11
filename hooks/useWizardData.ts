
import React, { useState, useCallback, useEffect } from 'react';
import { Provider, CatalogResponse } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Parameters for the `useWizardData` hook.
 * @internal
 */
interface WizardDataParams {
  /** Service instance for API calls. */
  experticketService: ExperticketService;
  /** Wrapper function to execute async actions with error/loading handling. */
  onExecuteAction: (action: () => Promise<void>) => Promise<void>;
}

/**
 * Hook for managing the loading of initial wizard data (providers and catalog).
 *
 * @remarks
 * This hook is responsible for fetching the necessary catalog and provider
 * information when the wizard is first initialized.
 *
 * @param params - Configuration parameters.
 * @internal
 */
export const useWizardData = ({ experticketService, onExecuteAction }: WizardDataParams) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | undefined>(undefined);

  /**
   * Loads both providers and the product catalog in parallel.
   * @throws Error if any API call fails.
   */
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
