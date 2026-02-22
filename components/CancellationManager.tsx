
import React from 'react';
import { ExperticketConfig } from '../types';
import { useCancellations } from '../hooks/useCancellations';
import CancellationForm from './cancellations/CancellationForm';
import CancellationHistory from './cancellations/CancellationHistory';

interface CancellationManagerProps {
  config: ExperticketConfig;
}

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
