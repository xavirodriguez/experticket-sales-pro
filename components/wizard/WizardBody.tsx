
import React from 'react';
import { SaleWizardState, Provider, Product, CapacityResponse } from '../../types';
import WizardErrorMessage from './WizardErrorMessage';
import WizardStepRenderer from './WizardStepRenderer';

/**
 * Props for the {@link WizardBody} component.
 * @internal
 */
interface WizardBodyProps {
  step: number;
  error?: string;
  providers: Provider[];
  filteredProducts: Product[];
  state: SaleWizardState;
  capacityInfo?: CapacityResponse;
  updateState: (updates: Partial<SaleWizardState>) => void;
  resetWizard: () => void;
  onViewTransactions: () => void;
}

/**
 * Renders the main content area of the sale wizard.
 *
 * @param props - Component props.
 * @internal
 */
const WizardBody: React.FC<WizardBodyProps> = ({
  step,
  error,
  providers,
  filteredProducts,
  state,
  capacityInfo,
  updateState,
  resetWizard,
  onViewTransactions
}) => (
  <div className="p-8 min-h-[400px]">
    {error && <WizardErrorMessage message={error} />}

    <WizardStepRenderer
      step={step}
      providers={providers}
      filteredProducts={filteredProducts}
      state={state}
      updateState={updateState}
      capacityInfo={capacityInfo}
      resetWizard={resetWizard}
      onViewTransactions={onViewTransactions}
    />
  </div>
);

export default WizardBody;
