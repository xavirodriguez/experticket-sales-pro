
import React, { useCallback } from 'react';
import { SaleWizardState, CapacityResponse } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Parameters for the wizard actions.
 * @internal
 */
interface WizardActionParams {
  state: SaleWizardState;
  service: ExperticketService;
  setState: React.Dispatch<React.SetStateAction<SaleWizardState>>;
  setCapacityInfo: (info: CapacityResponse) => void;
}

/**
 * Encapsulates the core business actions for the sale wizard.
 *
 * @param params - Configuration and state management objects.
 * @returns Step-specific action handlers.
 * @internal
 */
export const useWizardActions = ({ state, service, setState, setCapacityInfo }: WizardActionParams) => {
  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await service.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    setState(prev => ({ ...prev, step: 2 }));
  }, [service, state.selectedProductId, state.accessDate, setCapacityInfo, setState]);

  const handleReservation = useCallback(async () => {
    const response = await service.createReservation({
      accessDateTime: state.accessDate,
      products: [{ ProductId: state.selectedProductId, Quantity: state.quantity }]
    });
    setState(prev => ({
      ...prev,
      step: 3,
      reservationId: response.ReservationId,
      reservationExpiry: response.MinutesToExpiry
    }));
  }, [service, state.accessDate, state.selectedProductId, state.quantity, setState]);

  const handleTransaction = useCallback(async () => {
    await service.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });
    setState(prev => ({ ...prev, step: 4 }));
  }, [service, state.reservationId, state.accessDate, state.selectedProductId, setState]);

  return { handleProductSelection, handleReservation, handleTransaction };
};
