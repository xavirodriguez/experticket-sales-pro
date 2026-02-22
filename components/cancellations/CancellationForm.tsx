
import React, { useState } from 'react';
import { CancellationReason } from '../../types';
import { Send, Loader2, AlertCircle } from 'lucide-react';

interface CancellationFormProps {
  onSubmit: (saleId: string, reason: number, comments: string) => Promise<void>;
  isSubmitting: boolean;
}

const CancellationForm: React.FC<CancellationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [saleId, setSaleId] = useState('');
  const [reason, setReason] = useState(1);
  const [comments, setComments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleId) return;

    try {
      await onSubmit(saleId, reason, comments);
      setSaleId('');
      setComments('');
    } catch (err) {
      alert('Error submitting cancellation: ' + err);
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <h2 className="text-2xl font-bold">New Request</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Sale Identifier</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition"
            placeholder="e.g. SL-98234..."
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Reason for Cancellation</label>
          <select
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition"
            value={reason}
            onChange={(e) => setReason(parseInt(e.target.value))}
          >
            <option value={CancellationReason.DATE_CHANGE}>Date Change</option>
            <option value={CancellationReason.PRODUCT_CHANGE}>Product Change</option>
            <option value={CancellationReason.ATTENDEES_CHANGE}>Attendee Change</option>
            <option value={CancellationReason.ILLNESS}>Illness</option>
            <option value={CancellationReason.MISMANAGEMENT}>Mismanagement</option>
            <option value={CancellationReason.INTEGRATION_ISSUES}>Integration Issue</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Comments (Optional)</label>
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition h-24"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg shadow-red-100 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <Send size={18} />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </form>

      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start space-x-3">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <p className="text-xs leading-relaxed font-medium">
          Requests are reviewed by the provider. Submitting a request does not guarantee an immediate refund.
        </p>
      </div>
    </div>
  );
};

export default CancellationForm;
