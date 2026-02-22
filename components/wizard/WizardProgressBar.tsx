
import React from 'react';
import { CheckCircle2, Ticket, Calendar, UserCheck, CreditCard } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { id: 1, name: 'Product', icon: Ticket },
  { id: 2, name: 'Capacity & Price', icon: Calendar },
  { id: 3, name: 'Reservation', icon: UserCheck },
  { id: 4, name: 'Confirmation', icon: CreditCard },
];

interface WizardProgressBarProps {
  currentStep: number;
}

const WizardProgressBar: React.FC<WizardProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="border-b border-gray-100 bg-gray-50/50 p-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border-2 border-gray-200'}
                `}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.name}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-4 -mt-6" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgressBar;
