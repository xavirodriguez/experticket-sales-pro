
import { useState, useMemo, useCallback } from 'react';
import { ExperticketConfig, SaleWizardState, CapacityResponse, Product } from '../types';
import ExperticketService from '../services/experticketService';
import { useWizardData } from './useWizardData';
import { useWizardActions } from './useWizardActions';
import { useWizardNavigation } from './useWizardNavigation';

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
 */
export const useNewSaleWizard = (config: ExperticketConfig) => {
  const [state, setState] = useState<SaleWizardState>(INITIAL_STATE);
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | undefined>(undefined);

  const service = useMemo(() => new ExperticketService(config), [config]);
  const { providers, catalog, loading: dataLoading, dataError } = useWizardData(service);

  const { handleProductSelection, handleReservation, handleTransaction } = useWizardActions({
    state,
    service,
    setState,
    setCapacityInfo
  });

  const stepActions = useMemo(() => ({
    1: handleProductSelection,
    2: handleReservation,
    3: handleTransaction
  }), [handleProductSelection, handleReservation, handleTransaction]);

  const navigation = useWizardNavigation({
    step: state.step,
    stepActions,
    initialState: INITIAL_STATE,
    setState
  });

  const filteredProducts = useMemo((): Product[] => {
    const products = catalog?.ProductBases?.flatMap(base => base.Products || []) || [];
    return products.filter(p => p.ProviderId === state.selectedProviderId);
  }, [catalog, state.selectedProviderId]);

  return {
    state,
    providers,
    capacityInfo,
    filteredProducts,
    ...navigation,
    loading: navigation.loading || dataLoading,
    error: navigation.error || dataError,
    updateState: useCallback((updates: Partial<SaleWizardState>) =>
      setState(prev => ({ ...prev, ...updates })), [])
  };
};
