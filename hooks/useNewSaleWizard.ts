
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Provider, CatalogResponse, CapacityResponse, Product, SaleWizardState } from '../types';
import ExperticketService from '../services/experticketService';

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
 * @param config - The Experticket API configuration.
 * @returns An object containing the current state, loading/error indicators,
 *          data lists, and navigation/update functions.
 *
 * @example
 * ```tsx
 * const { state, goToNextStep, updateState } = useNewSaleWizard(config);
 * ```
 */
export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | undefined>(undefined);
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | undefined>(undefined);

  const experticketService = useMemo(() => new ExperticketService(config), [config]);

  /**
   * Executes an asynchronous action with automatic loading and error state management.
   * @internal
   */
  const executeAction = useCallback(async (action: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await action();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads initial data required for the wizard.
   * @internal
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
    executeAction(loadInitialData);
  }, [executeAction, loadInitialData]);

  /**
   * Handles product selection and transitions to the capacity check step.
   * @internal
   */
  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await experticketService.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    setState(prevState => ({ ...prevState, step: 2 }));
  }, [experticketService, state.selectedProductId, state.accessDate]);

  /**
   * Creates a reservation and transitions to the reservation details step.
   * @internal
   */
  const handleReservation = useCallback(async () => {
    const reservationResponse = await experticketService.createReservation({
      accessDateTime: state.accessDate,
      products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    setState(prevState => ({
      ...prevState,
      step: 3,
      reservationId: reservationResponse.ReservationId,
      reservationExpiry: reservationResponse.MinutesToExpiry
    }));
  }, [experticketService, state.accessDate, state.selectedProductId, state.quantity]);

  /**
   * Finalizes the transaction and transitions to the confirmation step.
   * @internal
   */
  const handleTransaction = useCallback(async () => {
    await experticketService.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });
    setState(prevState => ({ ...prevState, step: 4 }));
  }, [experticketService, state.reservationId, state.accessDate, state.selectedProductId]);

  /**
   * Action mapping for each step in the wizard.
   * @internal
   */
  const stepActions: Record<number, () => Promise<void>> = useMemo(() => ({
    1: handleProductSelection,
    2: handleReservation,
    3: handleTransaction
  }), [handleProductSelection, handleReservation, handleTransaction]);

  /**
   * Advances the wizard to the next step based on current progress.
   */
  const goToNextStep = useCallback(() => executeAction(async () => {
    const action = stepActions[state.step];
    if (action) await action();
  }), [state.step, executeAction, stepActions]);

  /**
   * Moves the wizard back to the previous step.
   */
  const goToPreviousStep = useCallback(() => {
    setState(prevState => ({ ...prevState, step: Math.max(1, prevState.step - 1) }));
  }, []);

  /**
   * Resets the wizard state to its initial values.
   */
  const resetWizard = useCallback(() => setState(INITIAL_STATE), []);

  /**
   * Updates specific fields in the wizard state.
   * @param updates - Partial object containing fields to update.
   */
  const updateState = useCallback((updates: Partial<SaleWizardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Filtered list of products based on the selected provider.
   */
  const filteredProducts = useMemo((): Product[] => {
    const products = catalog?.ProductBases?.flatMap(productBase => productBase.Products || []) || [];
    return products.filter(product => product.ProviderId === state.selectedProviderId);
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
    resetWizard,
    updateState
  };
};
