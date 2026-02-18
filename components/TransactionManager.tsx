
import React, { useState, useEffect, useMemo } from 'react';
import { ExperticketConfig } from '../types';
import ExperticketService from '../services/experticketService';
import { Search, Filter, Loader2, Download, Eye, ExternalLink } from 'lucide-react';

const TransactionManager: React.FC<{ config: ExperticketConfig }> = ({ config }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const service = useMemo(() => new ExperticketService(config), [config]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await service.getTransactions({ PageSize: 50 });
      setTransactions(res.Transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (config.apiKey) fetchTransactions();
  }, [service]);

  const filtered = transactions.filter(t => 
    t.TransactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.Products?.[0]?.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search ID or Product..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchTransactions}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">Loading transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Access Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.TransactionId} className="hover:bg-gray-50/50 transition cursor-default">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-blue-600 truncate max-w-[120px]">{t.TransactionId}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{new Date(t.TransactionDateTime).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {new Date(t.AccessDateTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">{t.Products?.[0]?.ProductName || 'Mixed Items'}</span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{t.Products?.[0]?.ProviderName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      €{t.TotalRetailPrice || t.TotalPrice || '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
                        CONFIRMED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-20 text-center text-gray-400">
                <Search size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">No transactions found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManager;
