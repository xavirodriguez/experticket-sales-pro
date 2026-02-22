
import React from 'react';
import { CancellationRequest } from '../../types';
import { Loader2, XCircle } from 'lucide-react';

interface CancellationHistoryProps {
  requests: CancellationRequest[];
  loading: boolean;
}

const CancellationRequestItem: React.FC<{ request: CancellationRequest }> = ({ request }) => {
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1: return { text: 'IN PROCESS', classes: 'bg-orange-50 text-orange-600 border-orange-100' };
      case 2: return { text: 'ACCEPTED', classes: 'bg-green-50 text-green-600 border-green-100' };
      default: return { text: 'REJECTED', classes: 'bg-red-50 text-red-600 border-red-100' };
    }
  };

  const statusInfo = getStatusInfo(request.Status);

  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase">ID: {request.CancellationRequestId}</span>
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${statusInfo.classes}`}>
          {statusInfo.text}
        </span>
      </div>
      <h4 className="font-bold text-gray-900">Sale Reference: {request.SaleId}</h4>
      <p className="text-sm text-gray-500 mt-1">{request.StatusComments || 'No comments from provider yet.'}</p>
      <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
        Created: {new Date(request.CreatedDateTime).toLocaleString()}
      </div>
    </div>
  );
};

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
