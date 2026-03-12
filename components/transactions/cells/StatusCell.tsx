
import React from 'react';

interface StatusCellProps {
  success: boolean | undefined;
}

/**
 * Renders a status badge based on transaction success.
 *
 * @internal
 */
const StatusCell: React.FC<StatusCellProps> = ({ success }) => {
  if (success === true) {
    return (
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
          CONFIRMED
        </span>
      </td>
    );
  }

  if (success === false) {
    return (
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
          FAILED
        </span>
      </td>
    );
  }

  return (
    <td className="px-6 py-4">
      <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full border border-gray-200">
        UNKNOWN
      </span>
    </td>
  );
};

export default StatusCell;
