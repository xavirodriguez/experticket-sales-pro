
import React from 'react';
import { CancellationRequest } from '../../types';
import { Loader2, XCircle } from 'lucide-react';
import CancellationRequestItem from './CancellationRequestItem';

interface CancellationHistoryProps {
  requests: CancellationRequest[];
  loading: boolean;
}

const CancellationHistory: React.FC<CancellationHistoryProps> = ({ requests, loading }) => {
  if (loading) {
    return (
      <div className="p-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-gray-300" size={40} />
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <h2 className="text-2xl font-bold">Request History</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {requests.map((req) => (
            <CancellationRequestItem key={req.CancellationRequestId} request={req} />
          ))}
          {requests.length === 0 && (
            <div className="p-20 text-center text-gray-400">
              <XCircle size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">No cancellation requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancellationHistory;
