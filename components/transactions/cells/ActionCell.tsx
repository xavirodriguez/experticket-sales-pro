
import React from 'react';
import { Eye, Download } from 'lucide-react';

/**
 * Renders action buttons for viewing and downloading transaction details.
 *
 * @internal
 */
const ActionCell: React.FC = () => (
  <td className="px-6 py-4 text-right">
    <div className="flex items-center justify-end space-x-2">
      <button
        type="button"
        aria-label="View transaction details"
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <Eye size={18} />
      </button>
      <button
        type="button"
        aria-label="Download transaction receipt"
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <Download size={18} />
      </button>
    </div>
  </td>
);

export default ActionCell;
