
import React, { useCallback } from 'react';
import { ExperticketConfig } from '../types';
import { useNewSaleWizard } from '../hooks/useNewSaleWizard';
import WizardProgressBar from './wizard/WizardProgressBar';
import WizardNavigation from './wizard/WizardNavigation';
import WizardStepRenderer from './wizard/WizardStepRenderer';
import WizardErrorMessage from './wizard/WizardErrorMessage';

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
  const {
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
  } = useNewSaleWizard(config);

  const handleViewTransactions = useCallback(() => {
    window.location.hash = '/transactions';
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <WizardProgressBar currentStep={state.step} />

      <div className="p-8 min-h-[400px]">
        {error && <WizardErrorMessage message={error} />}

        <WizardStepRenderer
          step={state.step}
          providers={providers}
          filteredProducts={filteredProducts}
          state={state}
          updateState={updateState}
          capacityInfo={capacityInfo}
          resetWizard={resetWizard}
          onViewTransactions={handleViewTransactions}
        />
      </div>

      {state.step < 4 && (
        <WizardNavigation
          step={state.step}
          loading={loading}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}
    </div>
  );
};

export default NewSaleWizard;
