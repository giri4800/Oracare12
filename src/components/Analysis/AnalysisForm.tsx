import React, { useState } from 'react';
import { histopathologicalSchema, type HistopathologicalData } from '../../utils/imageProcessing';

interface AnalysisFormProps {
  onSubmit: (data: HistopathologicalData) => void;
  loading?: boolean;
}

export function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [formData, setFormData] = useState<Partial<HistopathologicalData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = histopathologicalSchema.safeParse(formData);
    if (result.success) {
      onSubmit(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            type="text"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        
        {/* Add more form fields based on the schema */}
        
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