
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExperticketConfig, Provider, CatalogResponse, CapacityResponse } from '../types';
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

export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<WizardState>({
    step: 1,
    selectedProviderId: '',
    selectedProductId: '',
    accessDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    reservationId: '',
    transactionId: '',
    reservationExpiry: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | null>(null);

  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [provRes, catRes] = await Promise.all([
        service.getProviders(),
        service.getCatalog()
      ]);
      setProviders(provRes.Providers || []);
      setCatalog(catRes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const checkCapacity = useCallback(async () => {
    try {
      setLoading(true);
      const res = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
      setCapacityInfo(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service, state.selectedProductId, state.accessDate]);

  const createReservation = useCallback(async () => {
    try {
      setLoading(true);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service, state.accessDate, state.selectedProductId, state.quantity]);

  const completeTransaction = useCallback(async () => {
    try {
      setLoading(true);
      await service.createTransaction(
        state.reservationId,
        state.accessDate,
        [{ ProductId: state.selectedProductId }]
      );
      setState(s => ({ ...s, step: 4 }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service, state.reservationId, state.accessDate, state.selectedProductId]);

  const goToNextStep = useCallback(async () => {
    setError(null);
    if (state.step === 1) {
      if (!state.selectedProductId) return setError('Please select a product');
      setState(s => ({ ...s, step: 2 }));
      await checkCapacity();
    } else if (state.step === 2) {
      await createReservation();
    } else if (state.step === 3) {
      await completeTransaction();
    }
  }, [state.step, state.selectedProductId, checkCapacity, createReservation, completeTransaction]);

  const goToPreviousStep = useCallback(() => {
    setState(s => ({ ...s, step: s.step - 1 }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(s => ({
      ...s,
      step: 1,
      reservationId: '',
      transactionId: '',
      selectedProductId: '',
      selectedProviderId: ''
    }));
  }, []);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(s => ({ ...s, ...updates }));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!catalog?.ProductBases) return [];
    return catalog.ProductBases
      .flatMap(pb => pb.Products || [])
      .filter(p => p.ProviderId === state.selectedProviderId);
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
