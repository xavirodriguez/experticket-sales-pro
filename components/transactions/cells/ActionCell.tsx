
import React from 'react';
import { Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Props for the {@link ActionCell} component.
 * @internal
 */
interface ActionCellProps {
  /** The unique identifier of the transaction. */
  transactionId: string;
}

/**
 * Renders action buttons for viewing and downloading transaction details.
 *
 * @internal
 */
const ActionCell: React.FC<ActionCellProps> = ({ transactionId }) => (
  <td className="px-6 py-4 text-right">
    <div className="flex items-center justify-end space-x-2">
      <button
        type="button"
        title="Coming soon"
        aria-label="View transaction details"
        className="p-2 text-gray-400 cursor-not-allowed opacity-50 rounded-lg transition"
      >
        <Eye size={18} />
      </button>
      <Link
        to="/documents"
        state={{ prefillId: transactionId }}
        aria-label="Download transaction receipt"
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <Download size={18} />
      </Link>
    </div>
  </td>
);

export default ActionCell;
