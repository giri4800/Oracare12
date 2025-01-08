import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type: 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}

export function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  minLength,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="w-full">
      <label 
        htmlFor={id} 
        className="block text-sm mb-1 text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-gray-50 dark:bg-gray-800
          text-gray-900 dark:text-white
          border border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        required={required}
        minLength={minLength}
        disabled={disabled}
      />
    </div>
  );
}