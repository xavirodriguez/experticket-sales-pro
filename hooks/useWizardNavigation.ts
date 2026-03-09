
import React, { useState, useCallback, useMemo } from 'react';
import { SaleWizardState } from '../types';

/**
 * Parameters for the wizard navigation hook.
 * @internal
 */
interface NavigationParams {
  step: number;
  stepActions: Record<number, () => Promise<void>>;
  initialState: SaleWizardState;
  setState: React.Dispatch<React.SetStateAction<SaleWizardState>>;
}

/**
 * Manages navigation and step transitions for the wizard.
 *
 * @param params - Navigation configuration.
 * @returns Navigation state and transition functions.
 * @internal
 */
export const useWizardNavigation = ({ step, stepActions, initialState, setState }: NavigationParams) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const goToNextStep = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const action = stepActions[step];
      if (action) await action();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [step, stepActions]);

  const goToPreviousStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, [setState]);

  const resetWizard = useCallback(() => setState(initialState), [initialState, setState]);

  return { loading, error, goToNextStep, goToPreviousStep, resetWizard };
};
