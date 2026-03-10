
import React from 'react';

/**
 * Renders a status badge indicating a confirmed transaction.
 *
 * @internal
 */
const StatusCell: React.FC = () => (
  <td className="px-6 py-4">
    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
      CONFIRMED
    </span>
  </td>
);

export default StatusCell;
