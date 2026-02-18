
import React, { useState, useEffect, useMemo } from 'react';
import { ExperticketConfig, CancellationReason } from '../types';
import ExperticketService from '../services/experticketService';
import { XCircle, AlertCircle, Loader2, Send } from 'lucide-react';

const CancellationManager: React.FC<{ config: ExperticketConfig }> = ({ config }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleId, setSaleId] = useState('');
  const [reason, setReason] = useState(1);
  const [comments, setComments] = useState('');

  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await service.getCancellationRequests({ PageSize: 20 });
      setRequests(res.CancellationRequests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleId) return;
    
    try {
      setIsSubmitting(true);
      await service.submitCancellation(saleId, reason, comments);
      setSaleId('');
      setComments('');
      fetchRequests();
    } catch (err) {
      alert('Error submitting cancellation: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (config.apiKey) fetchRequests();
  }, [service]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Request History</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center items-center">
              <Loader2 className="animate-spin text-gray-300" size={40} />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {requests.map((req) => (
                <div key={req.CancellationRequestId} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">ID: {req.CancellationRequestId}</span>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                      req.Status === 1 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      req.Status === 2 ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {req.Status === 1 ? 'IN PROCESS' : req.Status === 2 ? 'ACCEPTED' : 'REJECTED'}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">Sale Reference: {req.SaleId}</h4>
                  <p className="text-sm text-gray-500 mt-1">{req.StatusComments || 'No comments from provider yet.'}</p>
                  <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Created: {new Date(req.CreatedDateTime).toLocaleString()}
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="p-20 text-center text-gray-400">
                  <XCircle size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No cancellation requests found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancellationManager;
