
import React from 'react';
import { Transaction } from '../../types';
import { Search, Loader2, Download, Eye } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const firstProduct = transaction.Products?.[0];
  const amount = transaction.TotalRetailPrice || transaction.TotalPrice || 0;

  return (
    <tr className="hover:bg-gray-50/50 transition cursor-default">
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-blue-600 truncate max-w-[120px]">{transaction.TransactionId}</p>
        <p className="text-[10px] text-gray-400 font-medium">{new Date(transaction.TransactionDateTime).toLocaleString()}</p>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-600">
        {new Date(transaction.AccessDateTime).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-gray-800">{firstProduct?.ProductName || 'Mixed Items'}</span>
        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{firstProduct?.ProviderName}</p>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-gray-900">
        €{amount.toFixed(2)}
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
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-20 text-center text-gray-400">
        <Search size={40} className="mx-auto mb-4 opacity-20" />
        <p className="font-medium">No transactions found matching your criteria.</p>
      </div>
    );
  }

  return (
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
          {transactions.map((t) => (
            <TransactionRow key={t.TransactionId} transaction={t} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
