
import { useState, useCallback } from 'react';
import { SaleWizardState } from '../types';

/**
 * Initial state for the sale wizard flow.
 * @internal
 */
const INITIAL_STATE: SaleWizardState = {
  step: 1,
  selectedProviderId: '',
  selectedProductId: '',
  accessDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  reservationId: '',
  transactionId: '',
  reservationExpiry: 0,
};

/**
 * Manages the core state, loading, and error status for the sale wizard.
 *
 * @internal
 */
export const useWizardCore = () => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const updateState = useCallback((updates: Partial<SaleWizardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  const executeAction = useCallback(async (action: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await action();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    state,
    loading,
    error,
    updateState,
    executeAction,
    resetWizard: useCallback(() => setState(INITIAL_STATE), [])
  };
};
