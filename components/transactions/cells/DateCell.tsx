
import React from 'react';

interface DateCellProps {
  /** The ISO date string to format. */
  date: string;
}

/**
 * Normalizes a user-provided date into a localized string.
 * @internal
 */
const formatDate = (date: string): string => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

/**
 * Renders a formatted date string for a table cell.
 *
 * @param props - Component props.
 * @internal
 */
const DateCell: React.FC<DateCellProps> = ({ date }) => (
  <td className="px-6 py-4 text-sm font-medium text-gray-600">
    {formatDate(date)}
  </td>
);

export default DateCell;
