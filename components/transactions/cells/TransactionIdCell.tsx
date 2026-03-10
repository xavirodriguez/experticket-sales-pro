
import React from 'react';

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
const TransactionIdCell: React.FC<TransactionIdCellProps> = ({ id, timestamp }) => (
  <td className="px-6 py-4">
    <p className="text-sm font-bold text-blue-600 truncate max-w-[120px]">{id}</p>
    <p className="text-[10px] text-gray-400 font-medium">{new Date(timestamp).toLocaleString()}</p>
  </td>
);

export default TransactionIdCell;
