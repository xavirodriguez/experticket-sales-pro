
import React, { useMemo, useCallback } from 'react';
import { ExperticketConfig, Product } from '../types';
import ExperticketService from '../services/experticketService';
import { useWizardData } from './useWizardData';
import { useWizardActions } from './useWizardActions';
import { useWizardNavigation } from './useWizardNavigation';
import { useWizardCore } from './useWizardCore';

/**
 * Manages the state and logic for the multi-step sale wizard.
 *
 * @remarks
 * This hook coordinates the flow from product selection through capacity checking,
 * reservation creation, and final transaction processing. It adheres to the 'No Null'
 * principle by using `undefined` for optional data.
 *
 * It decomposes logic into several specialized sub-hooks ({@link useWizardData},
 * {@link useWizardActions}, {@link useWizardNavigation}, {@link useWizardCore})
 * to maintain single responsibility and adhere to function line limits.
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
  const experticketService = useMemo(() => new ExperticketService(config), [config]);
  const core = useWizardCore();

  const { providers, catalog } = useWizardData({
    experticketService,
    onExecuteAction: core.executeAction
  });

  const { capacityInfo, handleProductSelection, handleReservation, handleTransaction } = useWizardActions({
    experticketService,
    state: core.state,
    updateState: core.updateState
  });

  const { goToNextStep, goToPreviousStep } = useWizardNavigation({
    state: core.state,
    updateState: core.updateState,
    actions: useMemo(() => ({
      1: handleProductSelection,
      2: handleReservation,
      3: handleTransaction
    }), [handleProductSelection, handleReservation, handleTransaction]),
    executeAction: core.executeAction
  });

  const filteredProducts = useMemo((): Product[] => {
    const products = catalog?.ProductBases?.flatMap(pb => pb.Products || []) || [];
    return products.filter(p => p.ProviderId === core.state.selectedProviderId);
  }, [catalog, core.state.selectedProviderId]);

  return {
    ...core,
    providers,
    capacityInfo,
    filteredProducts,
    goToNextStep,
    goToPreviousStep
  };
};
