
import React from 'react';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  step: number;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  step,
  loading,
  onNext,
  onBack
}) => {
  return (
    <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
      <button
        disabled={step === 1 || loading}
        onClick={onBack}
        className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-30 transition font-bold"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <button
        disabled={loading}
        onClick={onNext}
        className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : (
          <>
            <span>{step === 3 ? 'Complete Sale' : 'Continue'}</span>
            <ChevronRight size={20} />
          </>
        )}
      </button>
    </div>
  );
};

export default WizardNavigation;
