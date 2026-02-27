
import React from 'react';
import { Transaction } from '../../types';
import { Search, Loader2 } from 'lucide-react';
import TransactionRow from './TransactionRow';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

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
