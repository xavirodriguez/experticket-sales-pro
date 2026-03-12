
import React from 'react';
import { Provider, Product, SaleWizardState } from '../../types';
import ProductSelectionStep from './ProductSelectionStep';
import CapacityCheckStep from './CapacityCheckStep';
import ReservationStep from './ReservationStep';
import SaleConfirmationStep from './SaleConfirmationStep';
import { CapacityResponse } from '../../types';

/**
 * Props for the {@link WizardStepRenderer} component.
 * @internal
 */
interface WizardStepRendererProps {
  /** The current wizard step index. */
  step: number;
  /** Available providers. */
  providers: Provider[];
  /** Filtered products based on selected provider. */
  filteredProducts: Product[];
  /** Current wizard state. */
  state: SaleWizardState;
  /** Function to update wizard state. */
  updateState: (updates: Partial<SaleWizardState>) => void;
  /** Current capacity information. */
  capacityInfo: CapacityResponse | undefined;
  /** Callback to reset the wizard. */
  resetWizard: () => void;
  /** Callback to view transactions. */
  onViewTransactions: () => void;
}

/**
 * Renders the appropriate wizard step based on the current state.
 *
 * @param props - Component props.
 * @internal
 */
const WizardStepRenderer: React.FC<WizardStepRendererProps> = ({
  step,
  providers,
  filteredProducts,
  state,
  updateState,
  capacityInfo,
  resetWizard,
  onViewTransactions
}) => {
  const stepComponents: Record<number, React.ReactElement> = {
    1: (
      <ProductSelectionStep
        providers={providers}
        products={filteredProducts}
        selectedProviderId={state.selectedProviderId}
        selectedProductId={state.selectedProductId}
        accessDate={state.accessDate}
        quantity={state.quantity}
        onUpdate={updateState}
      />
    ),
    2: <CapacityCheckStep capacityInfo={capacityInfo} />,
    3: (
      <ReservationStep
        reservationId={state.reservationId}
        reservationExpiry={state.reservationExpiry}
      />
    ),
    4: (
      <SaleConfirmationStep
        onNewBooking={resetWizard}
        onViewTransactions={onViewTransactions}
        transactionId={state.transactionId}
      />
    )
  };

  return stepComponents[step] || <></>;
};

export default WizardStepRenderer;
