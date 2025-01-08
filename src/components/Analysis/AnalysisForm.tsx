import React, { useState } from 'react';
import { histopathologicalSchema, type HistopathologicalData } from '../../utils/imageProcessing';

interface AnalysisFormProps {
  onSubmit: (data: HistopathologicalData) => void;
  loading?: boolean;
}

export function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [formData, setFormData] = useState<Partial<HistopathologicalData>>({});

  const handleChange = (field: keyof HistopathologicalData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = histopathologicalSchema.safeParse(formData);
    if (result.success) {
      onSubmit(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            name="patientId"
            value={formData.patientId || ''}
            onChange={(e) => handleChange('patientId', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-medical-primary-500 focus:ring-medical-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Age
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-medical-primary-500 focus:ring-medical-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
    </form>
  );
}