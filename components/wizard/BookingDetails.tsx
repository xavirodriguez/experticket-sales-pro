
import React from 'react';

interface BookingDetailsProps {
  accessDate: string;
  quantity: number;
  onUpdate: (updates: { accessDate?: string; quantity?: number }) => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  accessDate,
  quantity,
  onUpdate
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">Access Date</label>
      <input
        type="date"
        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        value={accessDate}
        onChange={(e) => onUpdate({ accessDate: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">Quantity</label>
      <input
        type="number"
        min="1"
        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        value={quantity || ''}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          onUpdate({ quantity: isNaN(val) ? 0 : Math.max(0, val) });
        }}
      />
    </div>
  </div>
);

export default BookingDetails;
