
import React from 'react';

/**
 * Status display configuration for transaction success.
 * @internal
 */
const STATUS_CONFIG: Record<string, { text: string; classes: string }> = {
  true: { text: 'CONFIRMED', classes: 'bg-green-50 text-green-600 border-green-100' },
  false: { text: 'FAILED', classes: 'bg-red-50 text-red-600 border-red-100' },
  undefined: { text: 'UNKNOWN', classes: 'bg-gray-50 text-gray-500 border-gray-200' }
};

interface StatusCellProps {
  /** Indicates if the transaction was successful. */
  success: boolean | undefined;
}

/**
 * Renders a status badge based on transaction success.
 *
 * @param props - Component props.
 * @internal
 */
const StatusCell: React.FC<StatusCellProps> = ({ success }) => {
  const statusKey = String(success);
  const { text, classes } = STATUS_CONFIG[statusKey] || STATUS_CONFIG.undefined;

  return (
    <td className="px-6 py-4">
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${classes}`}>
        {text}
      </span>
    </td>
  );
};

export default StatusCell;
