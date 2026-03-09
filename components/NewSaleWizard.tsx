
import React, { useCallback } from 'react';
import { ExperticketConfig } from '../types';
import { useNewSaleWizard } from '../hooks/useNewSaleWizard';
import WizardProgressBar from './wizard/WizardProgressBar';
import WizardNavigation from './wizard/WizardNavigation';
import WizardBody from './wizard/WizardBody';

/**
 * Props for the {@link NewSaleWizard} component.
 */
interface NewSaleWizardProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * A multi-step wizard component for processing new sales.
 */
const NewSaleWizard: React.FC<NewSaleWizardProps> = ({ config }) => {
  const wizard = useNewSaleWizard(config);
  const handleViewTransactions = useCallback(() => {
    window.location.hash = '/transactions';
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <WizardProgressBar currentStep={wizard.state.step} />

      <WizardBody
        step={wizard.state.step}
        error={wizard.error}
        providers={wizard.providers}
        filteredProducts={wizard.filteredProducts}
        state={wizard.state}
        capacityInfo={wizard.capacityInfo}
        updateState={wizard.updateState}
        resetWizard={wizard.resetWizard}
        onViewTransactions={handleViewTransactions}
      />

      {wizard.state.step < 4 && (
        <WizardNavigation
          step={wizard.state.step}
          loading={wizard.loading}
          onNext={wizard.goToNextStep}
          onBack={wizard.goToPreviousStep}
        />
      )}
    </div>
  );
};

export default NewSaleWizard;
