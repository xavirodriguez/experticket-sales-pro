
import React from 'react';
import { ExperticketConfig } from '../types';
import { useNewSaleWizard } from '../hooks/useNewSaleWizard';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import WizardProgressBar from './wizard/WizardProgressBar';
import ProductSelectionStep from './wizard/ProductSelectionStep';
import CapacityCheckStep from './wizard/CapacityCheckStep';
import ReservationStep from './wizard/ReservationStep';
import SaleConfirmationStep from './wizard/SaleConfirmationStep';

interface NewSaleWizardProps {
  config: ExperticketConfig;
}

const NewSaleWizard: React.FC<NewSaleWizardProps> = ({ config }) => {
  const wizard = useNewSaleWizard(config);

  const handleViewTransactions = () => {
    window.location.hash = '/transactions';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <WizardProgressBar currentStep={wizard.state.step} />

      <div className="p-8 min-h-[400px]">
        <ErrorMessage error={wizard.error} />
        <WizardStepRenderer wizard={wizard} onViewTransactions={handleViewTransactions} />
      </div>

      <WizardNavigation
        step={wizard.state.step}
        loading={wizard.loading}
        onBack={wizard.goToPreviousStep}
        onNext={wizard.goToNextStep}
      />
    </div>
  );
};

const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3">
      <AlertCircle size={20} />
      <p className="font-medium">{error}</p>
    </div>
  );
};

type WizardResult = ReturnType<typeof useNewSaleWizard>;

const WizardStepRenderer: React.FC<{ wizard: WizardResult; onViewTransactions: () => void }> = ({
  wizard,
  onViewTransactions
}) => {
  const { state, providers, filteredProducts, updateState, capacityInfo, resetWizard } = wizard;

  switch (state.step) {
    case 1:
      return <ProductSelectionStep
        providers={providers} products={filteredProducts} onUpdate={updateState}
        selectedProviderId={state.selectedProviderId} selectedProductId={state.selectedProductId}
        accessDate={state.accessDate} quantity={state.quantity}
      />;
    case 2:
      return <CapacityCheckStep capacityInfo={capacityInfo} />;
    case 3:
      return <ReservationStep reservationId={state.reservationId} reservationExpiry={state.reservationExpiry} />;
    case 4:
      return <SaleConfirmationStep onNewBooking={resetWizard} onViewTransactions={onViewTransactions} />;
    default:
      return null;
  }
};

const WizardNavigation: React.FC<{
  step: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}> = ({ step, loading, onBack, onNext }) => {
  if (step >= 4) return null;

  return (
    <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
      <button
        disabled={step === 1 || loading}
        onClick={onBack}
        className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30 transition font-bold"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>
      <button
        disabled={loading}
        onClick={onNext}
        className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : (
          <>
            <span>{step === 3 ? 'Complete Sale' : 'Continue'}</span>
            <ChevronRight size={20} />
          </>
        )}
      </button>
    </div>
  );
};

export default NewSaleWizard;
