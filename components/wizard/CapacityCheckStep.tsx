
import React from 'react';
import { CapacityResponse } from '../../types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface CapacityCheckStepProps {
  capacityInfo: CapacityResponse | undefined;
}

const CapacityCheckStep: React.FC<CapacityCheckStepProps> = ({ capacityInfo }) => {
  if (!capacityInfo) return <></>;

  const productCapacity = capacityInfo.Products?.[0];
  const capacity = productCapacity?.AvailableCapacity ?? 999;

  if (capacity === 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
          <h3 className="font-bold text-red-800 mb-2">Availability Status</h3>
          <div className="flex items-center space-x-2 text-red-700">
            <XCircle size={18} className="text-red-500" />
            <span className="font-bold text-lg">No Availability — Cannot Continue</span>
          </div>
        </div>
      </div>
    );
  }

  const isLow = capacity > 0 && capacity < 5;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className={`p-6 rounded-2xl border ${isLow ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
        <h3 className={`font-bold mb-2 ${isLow ? 'text-amber-800' : 'text-blue-800'}`}>Availability Status</h3>
        <div className={`flex items-center space-x-2 ${isLow ? 'text-amber-700' : 'text-blue-700'}`}>
          {isLow ? (
            <AlertTriangle size={18} className="text-amber-500" />
          ) : (
            <CheckCircle2 size={18} className="text-green-500" />
          )}
          <span className="font-medium">
            {isLow ? `Low Availability: only ${capacity} spots left` : `Available Capacity: ${productCapacity?.AvailableCapacity ?? 'Infinite'}`}
          </span>
        </div>
        <div className={`mt-4 text-2xl font-bold ${isLow ? 'text-amber-900' : 'text-blue-900'}`}>
          Price: €{productCapacity?.Price ?? '--'}
        </div>
      </div>
    </div>
  );
};

export default CapacityCheckStep;
