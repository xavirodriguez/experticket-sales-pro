
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ReservationStepProps {
  reservationId: string;
  reservationExpiry: number;
}

const ReservationStep: React.FC<ReservationStepProps> = ({ reservationId, reservationExpiry }) => {
  const [secondsLeft, setSecondsLeft] = useState(reservationExpiry * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [secondsLeft]);

  const minutes = Math.floor(Math.max(0, secondsLeft) / 60);
  const seconds = Math.max(0, secondsLeft) % 60;
  const isUrgent = secondsLeft < 60 && secondsLeft > 0;
  const isExpired = secondsLeft <= 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-800">Reservation Successful!</h3>
        <p className="text-green-700 mt-1">ID: <code className="font-bold">{reservationId}</code></p>

        <div className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold transition-colors ${
          isExpired
            ? 'bg-red-600 text-white'
            : isUrgent
              ? 'bg-amber-500 text-white'
              : 'bg-green-600 text-white animate-pulse'
        }`}>
          {isExpired ? (
            "RESERVATION EXPIRED — Go back and retry"
          ) : isUrgent ? (
            `Expiring soon! ${seconds}s`
          ) : (
            `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}`
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationStep;
