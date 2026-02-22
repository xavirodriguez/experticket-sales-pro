
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SaleConfirmationStepProps {
  onNewBooking: () => void;
  onViewTransactions: () => void;
}

const SaleConfirmationStep: React.FC<SaleConfirmationStepProps> = ({
  onNewBooking,
  onViewTransactions
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="text-3xl font-bold">Sale Completed</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        The transaction has been successfully processed. Access codes and documents are now available in the dashboard.
      </p>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onViewTransactions}
          className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold transition"
        >
          View Transaction
        </button>
        <button
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
