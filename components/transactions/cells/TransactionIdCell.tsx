
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface TransactionIdCellProps {
  id: string;
  timestamp: string;
}

/**
 * Renders the transaction ID and its creation timestamp.
 *
 * @param props - Component props.
 * @internal
 */
const TransactionIdCell: React.FC<TransactionIdCellProps> = ({ id, timestamp }) => {
  const [copied, setCopied] = useState(false);
  const d = new Date(timestamp);
  const isValid = !isNaN(d.getTime());

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <td className="px-6 py-4">
      <div className="flex items-center gap-1 group">
        <p className="text-sm font-bold text-blue-600 truncate max-w-[120px]" title={id}>{id}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-opacity"
          title="Copy ID"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 font-medium">
        {isValid ? d.toLocaleString() : '—'}
      </p>
    </td>
  );
};

export default TransactionIdCell;
