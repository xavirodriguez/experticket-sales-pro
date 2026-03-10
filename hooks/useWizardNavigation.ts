
import { useCallback } from 'react';
import { SaleWizardState } from '../types';

interface WizardNavigationParams {
  state: SaleWizardState;
  updateState: (updates: Partial<SaleWizardState>) => void;
  actions: Record<number, () => Promise<void>>;
  executeAction: (action: () => Promise<void>) => Promise<void>;
}

/**
 * Hook for managing wizard step navigation logic.
 *
 * @param params - Configuration parameters.
 * @internal
 */
export const useWizardNavigation = ({
  state,
  updateState,
  actions,
  executeAction
}: WizardNavigationParams) => {
  const goToNextStep = useCallback(() => executeAction(async () => {
    const action = actions[state.step];
    if (action) await action();
  }), [state.step, executeAction, actions]);

  const goToPreviousStep = useCallback(() => {
    updateState({ step: Math.max(1, state.step - 1) });
  }, [state.step, updateState]);

  return { goToNextStep, goToPreviousStep };
};
