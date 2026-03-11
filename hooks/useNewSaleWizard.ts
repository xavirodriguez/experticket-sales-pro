
import React, { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, SaleWizardState, Product } from '../types';
import ExperticketService from '../services/experticketService';
import { useWizardData } from './useWizardData';
import { useWizardActions } from './useWizardActions';
import { useWizardNavigation } from './useWizardNavigation';

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
 * Manages the state and logic for the multi-step sale wizard.
 *
 * @remarks
 * This hook coordinates the flow from product selection through capacity checking,
 * reservation creation, and final transaction processing. It adheres to the 'No Null'
 * principle by using `undefined` for optional data.
 *
 * It decomposes logic into several specialized sub-hooks ({@link useWizardData},
 * {@link useWizardActions}, {@link useWizardNavigation}) to maintain single responsibility.
 *
 * @param config - The Experticket API configuration.
 * @returns An object containing the current state, loading/error indicators,
 *          data lists, and navigation/update functions.
 *
 * @example
 * ```tsx
 * function NewSale() {
 *   const { state, goToNextStep, updateState, loading } = useNewSaleWizard(config);
 *   return (
 *     <div>
 *       <p>Step: {state.step}</p>
 *       <button onClick={goToNextStep} disabled={loading}>Next</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Updates specific fields of the wizard state.
   * @param updates - Partial state updates.
   */
  const updateState = useCallback((updates: Partial<SaleWizardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Executes a wizard action with loading and error handling.
   * @internal
   * @param action - The async action to perform.
   */
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

  const { providers, catalog } = useWizardData({ experticketService, onExecuteAction: executeAction });
  const { capacityInfo, handleProductSelection, handleReservation, handleTransaction } = useWizardActions({ experticketService, state, updateState });

  const stepActions = useMemo(() => ({
    1: handleProductSelection,
    2: handleReservation,
    3: handleTransaction
  }), [handleProductSelection, handleReservation, handleTransaction]);

  const { goToNextStep, goToPreviousStep } = useWizardNavigation({ state, updateState, actions: stepActions, executeAction });

  const filteredProducts = useMemo((): Product[] => {
    const products = catalog?.ProductBases?.flatMap(pb => pb.Products || []) || [];
    return products.filter(p => p.ProviderId === state.selectedProviderId);
  }, [catalog, state.selectedProviderId]);

  return {
    state,
    loading,
    error,
    providers,
    capacityInfo,
    filteredProducts,
    goToNextStep,
    goToPreviousStep,
    resetWizard: useCallback(() => setState(INITIAL_STATE), []),
    updateState
  };
};
