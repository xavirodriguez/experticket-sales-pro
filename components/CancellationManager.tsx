
import React from 'react';
import { ExperticketConfig } from '../types';
import { useCancellations } from '../hooks/useCancellations';
import CancellationForm from './cancellations/CancellationForm';
import CancellationHistory from './cancellations/CancellationHistory';

/**
 * Props for the {@link CancellationManager} component.
 */
interface CancellationManagerProps {
  /** The Experticket API configuration. */
  config: ExperticketConfig;
}

/**
 * Manages the UI for submitting and viewing cancellation requests.
 *
 * @remarks
 * This component coordinates between the cancellation form for submitting
 * new requests and the history panel for viewing existing ones.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <CancellationManager config={myConfig} />
 * ```
 */
const CancellationManager: React.FC<CancellationManagerProps> = ({ config }) => {
  const {
    requests,
    loading,
    isSubmitting,
    submitCancellation
  } = useCancellations(config);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <CancellationForm
        onSubmit={submitCancellation}
        isSubmitting={isSubmitting}
      />
      <CancellationHistory
        requests={requests}
        loading={loading}
      />
    </div>
  );
};

export default CancellationManager;
