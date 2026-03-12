
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
const DateCell: React.FC<DateCellProps> = ({ date }) => {
  const d = new Date(date);
  const isValid = !isNaN(d.getTime());

  return (
    <td className="px-6 py-4 text-sm font-medium text-gray-600">
      {isValid ? d.toLocaleDateString() : '—'}
    </td>
  );
};

export default DateCell;
