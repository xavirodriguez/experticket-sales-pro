
import React, { useMemo } from 'react';
import { CancellationRequest } from '../../types';

/**
 * Status display configuration for cancellation requests.
 */
const STATUS_CONFIG: Record<number, { text: string; classes: string }> = {
  1: { text: 'IN PROCESS', classes: 'bg-orange-50 text-orange-600 border-orange-100' },
  2: { text: 'ACCEPTED', classes: 'bg-green-50 text-green-600 border-green-100' },
  0: { text: 'REJECTED', classes: 'bg-red-50 text-red-600 border-red-100' }
};

/**
 * Props for the {@link CancellationRequestItem} component.
 * @internal
 */
interface CancellationRequestItemProps {
  /** The cancellation request data to display. */
  request: CancellationRequest;
}

/**
 * Renders an individual cancellation request item with status badge and details.
 *
 * @param props - Component props.
 * @internal
 */
const CancellationRequestItem: React.FC<CancellationRequestItemProps> = ({ request }) => {
  const statusInfo = useMemo(() =>
    STATUS_CONFIG[request.Status] || STATUS_CONFIG[0],
    [request.Status]
  );

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

export default CancellationRequestItem;
