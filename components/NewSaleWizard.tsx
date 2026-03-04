
import React from 'react';
import { ExperticketConfig } from '../types';
import { useNewSaleWizard } from '../hooks/useNewSaleWizard';
import { AlertCircle } from 'lucide-react';
import WizardProgressBar from './wizard/WizardProgressBar';
import ProductSelectionStep from './wizard/ProductSelectionStep';
import CapacityCheckStep from './wizard/CapacityCheckStep';
import ReservationStep from './wizard/ReservationStep';
import SaleConfirmationStep from './wizard/SaleConfirmationStep';
import WizardNavigation from './wizard/WizardNavigation';

/**
 * Props for the {@link NewSaleWizard} component.
 */
interface NewSaleWizardProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * A multi-step wizard component for processing new sales.
 *
 * @remarks
 * This component guides the user through four distinct steps:
 * 1. Product Selection
 * 2. Capacity Check
 * 3. Reservation
 * 4. Confirmation
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <NewSaleWizard config={config} />
 * ```
 */
const NewSaleWizard: React.FC<NewSaleWizardProps> = ({ config }) => {
  const wizard = useNewSaleWizard(config);
  const { state, error, resetWizard } = wizard;

  /**
   * Navigates the user to the transactions view.
   */
  const handleViewTransactions = React.useCallback(() => {
    window.location.hash = '/transactions';
  }, []);

  /**
   * Renders the first step of the wizard: Product Selection.
   * @internal
   */
  const renderProductSelection = () => (
    <ProductSelectionStep
      providers={wizard.providers}
      products={wizard.filteredProducts}
      selectedProviderId={state.selectedProviderId}
      selectedProductId={state.selectedProductId}
      accessDate={state.accessDate}
      quantity={state.quantity}
      onUpdate={wizard.updateState}
    />
  );

  /**
   * Renders the second step of the wizard: Capacity Check.
   * @internal
   */
  const renderCapacityCheck = () => <CapacityCheckStep capacityInfo={wizard.capacityInfo} />;

  /**
   * Renders the third step of the wizard: Reservation details.
   * @internal
   */
  const renderReservation = () => (
    <ReservationStep
      reservationId={state.reservationId}
      reservationExpiry={state.reservationExpiry}
    />
  );

  /**
   * Renders the final step of the wizard: Sale Confirmation.
   * @internal
   */
  const renderConfirmation = () => (
    <SaleConfirmationStep
      onNewBooking={resetWizard}
      onViewTransactions={handleViewTransactions}
    />
  );

  /**
   * Determines which step to render based on the current wizard state.
   * @internal
   */
  const renderStep = React.useCallback(() => {
    switch (state.step) {
      case 1: return renderProductSelection();
      case 2: return renderCapacityCheck();
      case 3: return renderReservation();
      case 4: return renderConfirmation();
      default: return <React.Fragment />;
    }
  }, [
    state.step,
    state.selectedProviderId,
    state.selectedProductId,
    state.accessDate,
    state.quantity,
    state.reservationId,
    state.reservationExpiry,
    wizard.providers,
    wizard.filteredProducts,
    wizard.updateState,
    wizard.capacityInfo,
    resetWizard,
    handleViewTransactions
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <WizardProgressBar currentStep={state.step} />

      <div className="p-8 min-h-[400px]">
        {error && <ErrorMessage message={error} />}
        {renderStep()}
      </div>

      {state.step < 4 && (
        <WizardNavigation
          step={state.step}
          loading={wizard.loading}
          onNext={wizard.goToNextStep}
          onBack={wizard.goToPreviousStep}
        />
      )}
    </div>
  );
};

/**
 * Internal component for displaying error messages within the wizard.
 * @internal
 */
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3">
    <AlertCircle size={20} />
    <p className="font-medium">{message}</p>
  </div>
);

export default NewSaleWizard;
