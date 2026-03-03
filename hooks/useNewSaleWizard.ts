
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

export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | null>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  const executeAction = useCallback(async (action: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    const [providersResponse, catalogResponse] = await Promise.all([
      service.getProviders(),
      service.getCatalog()
    ]);
    setProviders(providersResponse.Providers || []);
    setCatalog(catalogResponse);
  }, [service]);

  useEffect(() => {
    executeAction(loadInitialData);
  }, [executeAction, loadInitialData]);

  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    setState(prevState => ({ ...prevState, step: 2 }));
  }, [service, state.selectedProductId, state.accessDate]);

  const handleReservation = useCallback(async () => {
    const reservationResponse = await service.createReservation({
      AccessDateTime: state.accessDate,
      Products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    setState(prevState => ({
      ...prevState,
      step: 3,
      reservationId: reservationResponse.ReservationId,
      reservationExpiry: reservationResponse.MinutesToExpiry
    }));
  }, [service, state.accessDate, state.selectedProductId, state.quantity]);

  const handleTransaction = useCallback(async () => {
    await service.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });
    setState(prevState => ({ ...prevState, step: 4 }));
  }, [service, state.reservationId, state.accessDate, state.selectedProductId]);

  const goToNextStep = useCallback(() => executeAction(async () => {
    const stepActions: Record<number, () => Promise<void>> = {
      1: handleProductSelection,
      2: handleReservation,
      3: handleTransaction
    };

    const action = stepActions[state.step];
    if (action) await action();
  }), [state.step, executeAction, handleProductSelection, handleReservation, handleTransaction]);

  const goToPreviousStep = useCallback(() => {
    setState(prevState => ({ ...prevState, step: Math.max(1, prevState.step - 1) }));
  }, []);

  const resetWizard = useCallback(() => setState(INITIAL_STATE), []);

  const updateState = useCallback((updates: Partial<SaleWizardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

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
