
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Props for the {@link WizardErrorMessage} component.
 */
interface WizardErrorMessageProps {
  /** The error message text to display. */
  message: string;
}

/**
 * Displays a formatted error message within the wizard flow.
 *
 * @param props - Component props.
 *
 * @example
 * ```tsx
 * <WizardErrorMessage message="An error occurred while creating the reservation." />
 * ```
 */
const WizardErrorMessage: React.FC<WizardErrorMessageProps> = ({ message }) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center space-x-3">
    <AlertCircle size={20} />
    <p className="font-medium">{message}</p>
  </div>
);

export default WizardErrorMessage;
