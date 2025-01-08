import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose, autoClose = true }) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900';
  const textColor = type === 'success' ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg ${bgColor} ${textColor}`} role="alert">
      <Icon className="w-5 h-5 mr-2" />
      <span className="sr-only">{type === 'success' ? 'Success' : 'Error'}</span>
      <div className="ml-3 text-sm font-medium">{message}</div>
      {onClose && (
        <button
          type="button"
          className={`ml-4 -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : 'red'}-50 p-1.5 inline-flex h-8 w-8 items-center justify-center`}
          aria-label="Close"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
