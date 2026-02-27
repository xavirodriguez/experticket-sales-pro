
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Provider, CatalogResponse, CapacityResponse, Product, WizardState } from '../types';
import ExperticketService from '../services/experticketService';

const INITIAL_STATE: WizardState = {
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
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    const [provRes, catRes] = await Promise.all([
      service.getProviders(),
      service.getCatalog()
    ]);
    setProviders(provRes.Providers || []);
    setCatalog(catRes);
  }, [service]);

  useEffect(() => {
    executeAction(loadInitialData);
  }, [executeAction, loadInitialData]);

  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    setState(s => ({ ...s, step: 2 }));
  }, [service, state.selectedProductId, state.accessDate]);

  const handleReservation = useCallback(async () => {
    const res = await service.createReservation({
      AccessDateTime: state.accessDate,
      Products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    setState(s => ({
      ...s,
      step: 3,
      reservationId: res.ReservationId,
      reservationExpiry: res.MinutesToExpiry
    }));
  }, [service, state.accessDate, state.selectedProductId, state.quantity]);

  const handleTransaction = useCallback(async () => {
    await service.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });
    setState(s => ({ ...s, step: 4 }));
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
    setState(s => ({ ...s, step: Math.max(1, s.step - 1) }));
  }, []);

  const resetWizard = useCallback(() => setState(INITIAL_STATE), []);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(s => ({ ...s, ...updates }));
  }, []);

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
    resetWizard,
    updateState
  };
};
