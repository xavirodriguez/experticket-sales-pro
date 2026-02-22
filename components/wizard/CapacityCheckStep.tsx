
import React from 'react';
import { CapacityResponse } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface CapacityCheckStepProps {
  capacityInfo: CapacityResponse | null;
}

const CapacityCheckStep: React.FC<CapacityCheckStepProps> = ({ capacityInfo }) => {
  if (!capacityInfo) return null;

  const productCapacity = capacityInfo.Products?.[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">Availability Status</h3>
        <div className="flex items-center space-x-2 text-blue-700">
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="font-medium">
            Available Capacity: {productCapacity?.AvailableCapacity ?? 'Infinite'}
          </span>
        </div>
        <div className="mt-4 text-2xl font-bold text-blue-900">
          Price: €{productCapacity?.Price ?? '--'}
        </div>
      </div>
    </div>
  );
};

export default CapacityCheckStep;
