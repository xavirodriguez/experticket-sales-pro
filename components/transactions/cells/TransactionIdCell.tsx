
import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface TransactionIdCellProps {
  /** The unique transaction identifier. */
  id: string;
  /** The timestamp when the transaction was created. */
  timestamp: string;
}

/**
 * Formats a timestamp into a localized string.
 * @internal
 */
const formatTimestamp = (timestamp: string): string => {
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString();
};

/**
 * Renders a copyable transaction identifier.
 * @internal
 */
const CopyableId: React.FC<{ id: string }> = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  return (
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
  );
};

/**
 * Renders the transaction ID and its creation timestamp in a table cell.
 *
 * @param props - Component props.
 * @internal
 */
const TransactionIdCell: React.FC<TransactionIdCellProps> = ({ id, timestamp }) => (
  <td className="px-6 py-4">
    <CopyableId id={id} />
    <p className="text-[10px] text-gray-400 font-medium">
      {formatTimestamp(timestamp)}
    </p>
  </td>
);

export default TransactionIdCell;
