
import React, { useState, useCallback } from 'react';
import { SaleWizardState, CapacityResponse } from '../types';
import ExperticketService from '../services/experticketService';

interface WizardActionsParams {
  experticketService: ExperticketService;
  state: SaleWizardState;
  updateState: (updates: Partial<SaleWizardState>) => void;
}

/**
 * Hook for managing product selection, reservation, and transaction actions.
 *
 * @param params - Configuration parameters.
 * @internal
 */
export const useWizardActions = ({ experticketService, state, updateState }: WizardActionsParams) => {
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | undefined>(undefined);

  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await experticketService.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    updateState({ step: 2 });
  }, [experticketService, state.selectedProductId, state.accessDate, updateState]);

  const handleReservation = useCallback(async () => {
    const response = await experticketService.createReservation({
      accessDateTime: state.accessDate,
      products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    updateState({
      step: 3,
      reservationId: response.ReservationId,
      reservationExpiry: response.MinutesToExpiry
    });
  }, [experticketService, state.accessDate, state.selectedProductId, state.quantity, updateState]);

  const handleTransaction = useCallback(async () => {
    await experticketService.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });
    updateState({ step: 4 });
  }, [experticketService, state.reservationId, state.accessDate, state.selectedProductId, updateState]);

  return { capacityInfo, handleProductSelection, handleReservation, handleTransaction };
};
