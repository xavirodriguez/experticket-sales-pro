
import React from 'react';
import { Download, Eye } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
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

export default TransactionRow;
