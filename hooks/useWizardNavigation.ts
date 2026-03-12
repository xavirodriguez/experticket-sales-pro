
import { useCallback } from 'react';
import { SaleWizardState } from '../types';

/**
 * Parameters for the `useWizardNavigation` hook.
 * @internal
 */
interface WizardNavigationParams {
  /** Current wizard state. */
  state: SaleWizardState;
  /** Callback to update state. */
  updateState: (updates: Partial<SaleWizardState>) => void;
  /** Map of step indices to the corresponding action function. */
  actions: Record<number, () => Promise<void>>;
  /** Wrapper function to execute async actions with error/loading handling. */
  executeAction: (action: () => Promise<void>) => Promise<void>;
}

/**
 * Hook for managing wizard step navigation logic.
 *
 * @remarks
 * This hook provides functions to move forward and backward in the multi-step
 * wizard flow. The `goToNextStep` function triggers the corresponding async
 * action for the current step.
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
  /**
   * Triggers the action for the current step and proceeds if successful.
   */
  const goToNextStep = useCallback(() => executeAction(async () => {
    const action = actions[state.step];
    if (action) await action();
  }), [state.step, executeAction, actions]);

  /** Moves the user back to the previous step in the flow. */
  const goToPreviousStep = useCallback(() => {
    updateState({ step: Math.max(1, state.step - 1) });
  }, [state.step, updateState]);

  return { goToNextStep, goToPreviousStep };
};
