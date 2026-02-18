import React, { useState } from 'react';
import { ExperticketConfig } from '../types';
import ExperticketService from '../services/experticketService';
// Added XCircle to imports to fix name error on line 70
import { Search, FileText, Download, ExternalLink, Loader2, XCircle } from 'lucide-react';

const DocumentsPanel: React.FC<{ config: ExperticketConfig }> = ({ config }) => {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const service = new ExperticketService(config);
      const query = new URLSearchParams({
        ApiKey: config.apiKey,
        id: id,
        IncludeTransactionDocumentsLanguages: 'true'
      });
      const response = await fetch(`https://${config.baseUrl}/transactiondocuments?${query.toString()}`);
      const res = await response.json();
      
      if (res.Success) {
        setDocuments(res.Documents || []);
      } else {
        setError(res.ErrorMessage || 'Failed to fetch documents');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Transaction Documents</h2>
        <p className="text-gray-500">Enter a Sale or Transaction ID to retrieve vouchers and tickets</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex items-center">
        <div className="flex-1 flex items-center px-4 space-x-3">
          <FileText className="text-gray-400" size={24} />
          <input
            type="text"
            className="w-full py-4 text-lg font-medium outline-none placeholder:text-gray-300"
            placeholder="e.g. 57614265090541..."
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDocs()}
          />
        </div>
        <button
          onClick={fetchDocs}
          disabled={loading || !id}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Fetch Documents'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle size={18} />
          </div>
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
          {documents.map((doc, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm uppercase">
                  {doc.LanguageCode}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Voucher / Ticket</h4>
                  <p className="text-xs text-gray-500 font-medium">Available in {doc.LanguageCode.toUpperCase()}</p>
                </div>
              </div>
              <a 
                href={doc.SalesDocumentUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && id && documents.length === 0 && !error && (
        <div className="py-20 text-center opacity-40">
          <Search size={64} className="mx-auto mb-4" />
          <p className="font-bold text-lg">No documents found for this ID</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsPanel;