
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Provider, CatalogResponse, CapacityResponse, Product } from '../types';
import ExperticketService from '../services/experticketService';

export interface WizardState {
  step: number;
  selectedProviderId: string;
  selectedProductId: string;
  accessDate: string;
  quantity: number;
  reservationId: string;
  transactionId: string;
  reservationExpiry: number;
}

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCatalogData = useCallback(async () => {
    const [provRes, catRes] = await Promise.all([
      service.getProviders(),
      service.getCatalog()
    ]);
    setProviders(provRes.Providers || []);
    setCatalog(catRes);
  }, [service]);

  useEffect(() => {
    executeAction(loadCatalogData);
  }, [executeAction, loadCatalogData]);

  const performCapacityCheck = useCallback(async () => {
    const res = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(res);
  }, [service, state.selectedProductId, state.accessDate]);

  const performReservation = useCallback(async () => {
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

  const performTransaction = useCallback(async () => {
    await service.createTransaction(
      state.reservationId,
      state.accessDate,
      [{ ProductId: state.selectedProductId }]
    );
    setState(s => ({ ...s, step: 4 }));
  }, [service, state.reservationId, state.accessDate, state.selectedProductId]);

  const handleStepSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');
    setState(s => ({ ...s, step: 2 }));
    await performCapacityCheck();
  }, [state.selectedProductId, performCapacityCheck]);

  const goToNextStep = useCallback(() => executeAction(async () => {
    if (state.step === 1) await handleStepSelection();
    if (state.step === 2) await performReservation();
    if (state.step === 3) await performTransaction();
  }), [state.step, executeAction, handleStepSelection, performReservation, performTransaction]);

  const goToPreviousStep = useCallback(() => {
    setState(s => ({ ...s, step: s.step - 1 }));
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
