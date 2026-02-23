
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Provider, CatalogResponse, CapacityResponse, WizardState } from '../types';
import ExperticketService from '../services/experticketService';

const INITIAL_WIZARD_STATE: WizardState = {
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
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | null>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  const executeAction = useCallback(async (action: () => Promise<void>) => {
    try {
      setLoading(true);
      setError(null);
      await action();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInitialData = useCallback(() => executeAction(async () => {
    const [provRes, catRes] = await Promise.all([service.getProviders(), service.getCatalog()]);
    setProviders(provRes.Providers || []);
    setCatalog(catRes);
  }), [service, executeAction]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const checkCapacity = useCallback(() => executeAction(async () => {
    const res = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(res);
  }), [service, state.selectedProductId, state.accessDate, executeAction]);

  const createReservation = useCallback(() => executeAction(async () => {
    const res = await service.createReservation({
      AccessDateTime: state.accessDate,
      Products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    setState(s => ({ ...s, step: 3, reservationId: res.ReservationId, reservationExpiry: res.MinutesToExpiry }));
  }), [service, state.accessDate, state.selectedProductId, state.quantity, executeAction]);

  const completeTransaction = useCallback(() => executeAction(async () => {
    await service.createTransaction(state.reservationId, state.accessDate, [{ ProductId: state.selectedProductId }]);
    setState(s => ({ ...s, step: 4 }));
  }), [service, state.reservationId, state.accessDate, state.selectedProductId, executeAction]);

  const handleStepOneTransition = useCallback(async () => {
    if (!state.selectedProductId) return setError('Please select a product');
    setState(s => ({ ...s, step: 2 }));
    await checkCapacity();
  }, [state.selectedProductId, checkCapacity]);

  const goToNextStep = useCallback(async () => {
    if (state.step === 1) await handleStepOneTransition();
    else if (state.step === 2) await createReservation();
    else if (state.step === 3) await completeTransaction();
  }, [state.step, handleStepOneTransition, createReservation, completeTransaction]);

  const goToPreviousStep = useCallback(() => {
    setState(s => ({ ...s, step: Math.max(1, s.step - 1) }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(INITIAL_WIZARD_STATE);
  }, []);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(s => ({ ...s, ...updates }));
  }, []);

  const filteredProducts = useMemo(() => {
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
