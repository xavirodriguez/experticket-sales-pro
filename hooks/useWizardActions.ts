import { useState, useCallback } from 'react';
import { SaleWizardState, CapacityResponse } from '../types';
import ExperticketService from '../services/experticketService';

/**
 * Parameters for the `useWizardActions` hook.
 * @internal
 */
interface WizardActionsParams {
  /** Service instance for API calls. */
  experticketService: ExperticketService;
  /** Current wizard state. */
  state: SaleWizardState;
  /** Callback to update wizard state. */
  updateState: (updates: Partial<SaleWizardState>) => void;
}

/**
 * Hook for managing product selection, reservation, and transaction actions.
 *
 * @remarks
 * This hook encapsulates the business logic for moving between steps in the
 * sale wizard, performing capacity checks, creating reservations, and
 * finalizing transactions.
 *
 * @param params - Configuration parameters.
 * @internal
 */
export const useWizardActions = ({ experticketService, state, updateState }: WizardActionsParams) => {
  const [capacityInfo, setCapacityInfo] = useState<CapacityResponse | undefined>(undefined);

  /**
   * Handles product selection and checks availability.
   * @throws Error if no product is selected.
   */
  const handleProductSelection = useCallback(async () => {
    if (!state.selectedProductId) throw new Error('Please select a product');

    const capacity = await experticketService.checkCapacity([state.selectedProductId], [state.accessDate]);
    setCapacityInfo(capacity);
    updateState({ step: 2 });
  }, [experticketService, state.selectedProductId, state.accessDate, updateState]);

  /** Creates a temporary reservation for the selected product. */
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

  /** Finalizes the transaction from the existing reservation. */
  const handleTransaction = useCallback(async () => {
    const response = await experticketService.createTransaction({
      reservationId: state.reservationId,
      accessDate: state.accessDate,
      products: [{ ProductId: state.selectedProductId }]
    });

    // ApiResponse might have TransactionId if it's a specific implementation
    const transactionId = response.TransactionId || state.reservationId;

    updateState({
      step: 4,
      transactionId
    });
  }, [experticketService, state.reservationId, state.accessDate, state.selectedProductId, updateState]);

  return { capacityInfo, handleProductSelection, handleReservation, handleTransaction };
};
