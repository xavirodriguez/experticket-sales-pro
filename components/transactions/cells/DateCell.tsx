
import React from 'react';

interface DateCellProps {
  date: string;
}

/**
 * Renders a formatted date string.
 *
 * @param props - Component props.
 * @internal
 */
const DateCell: React.FC<DateCellProps> = ({ date }) => (
  <td className="px-6 py-4 text-sm font-medium text-gray-600">
    {new Date(date).toLocaleDateString()}
  </td>
);

export default DateCell;
