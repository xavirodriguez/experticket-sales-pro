
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

interface NewSaleWizardProps {
  config: ExperticketConfig;
}

const NewSaleWizard: React.FC<NewSaleWizardProps> = ({ config }) => {
  const wizard = useNewSaleWizard(config);
  const { state, error, resetWizard } = wizard;

  const handleViewTransactions = () => {
    window.location.hash = '/transactions';
  };

  const STEPS: Record<number, React.ReactNode> = {
    1: (
      <ProductSelectionStep
        providers={wizard.providers}
        products={wizard.filteredProducts}
        selectedProviderId={state.selectedProviderId}
        selectedProductId={state.selectedProductId}
        accessDate={state.accessDate}
        quantity={state.quantity}
        onUpdate={wizard.updateState}
      />
    ),
    2: <CapacityCheckStep capacityInfo={wizard.capacityInfo} />,
    3: (
      <ReservationStep
        reservationId={state.reservationId}
        reservationExpiry={state.reservationExpiry}
      />
    ),
    4: (
      <SaleConfirmationStep
        onNewBooking={resetWizard}
        onViewTransactions={handleViewTransactions}
      />
    )
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <WizardProgressBar currentStep={state.step} />

      <div className="p-8 min-h-[400px]">
        {error && <ErrorMessage message={error} />}
        {STEPS[state.step]}
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

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3">
    <AlertCircle size={20} />
    <p className="font-medium">{message}</p>
  </div>
);

export default NewSaleWizard;
