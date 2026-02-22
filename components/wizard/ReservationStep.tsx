
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ReservationStepProps {
  reservationId: string;
  reservationExpiry: number;
}

const ReservationStep: React.FC<ReservationStepProps> = ({ reservationId, reservationExpiry }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-800">Reservation Successful!</h3>
        <p className="text-green-700 mt-1">ID: <code className="font-bold">{reservationId}</code></p>
        <div className="mt-4 inline-block px-4 py-1 bg-green-600 text-white rounded-full text-xs font-bold animate-pulse">
          Expires in {reservationExpiry} minutes
        </div>
      </div>
    </div>
  );
};

export default ReservationStep;
