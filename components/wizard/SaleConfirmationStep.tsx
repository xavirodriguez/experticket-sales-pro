
import React, { useState } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';

interface SaleConfirmationStepProps {
  onNewBooking: () => void;
  onViewTransactions: () => void;
  transactionId?: string;
}

const SaleConfirmationStep: React.FC<SaleConfirmationStepProps> = ({
  onNewBooking,
  onViewTransactions,
  transactionId
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="text-3xl font-bold">Sale Completed</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        The transaction has been successfully processed. Access codes and documents are now available in the dashboard.
      </p>

      {transactionId && (
        <div className="mx-auto max-w-sm p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
          <div className="text-left overflow-hidden">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Transaction ID</p>
            <code className="text-sm font-bold text-gray-900 break-all">{transactionId}</code>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-lg hover:bg-gray-200 transition text-gray-500"
            title="Copy transaction ID"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      )}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          type="button"
          onClick={onViewTransactions}
          className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold transition"
        >
          View Transaction
        </button>
        <button
          type="button"
          onClick={onNewBooking}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-100"
        >
          New Booking
        </button>
      </div>
    </div>
  );
};

export default SaleConfirmationStep;
