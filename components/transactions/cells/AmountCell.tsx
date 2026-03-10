
import React from 'react';

interface AmountCellProps {
  amount: number;
}

/**
 * Renders a currency-formatted amount.
 *
 * @param props - Component props.
 * @internal
 */
const AmountCell: React.FC<AmountCellProps> = ({ amount }) => (
  <td className="px-6 py-4 text-sm font-bold text-gray-900">
    €{amount.toFixed(2)}
  </td>
);

export default AmountCell;
