import React, { useEffect } from 'react';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { Database } from '../../types/supabase';
import type { AnalysisResponse } from '../../services/analysisService';

type Analysis = Database['public']['Tables']['analyses']['Row'];

interface AnalysisResult {
  analysis: string;
  confidence: number;
  risk_level: 'low' | 'medium' | 'high';
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RiskBadge = ({ risk }: { risk: string }) => {
  const colors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  const icons = {
    high: <AlertTriangle size={16} className="mr-1" />,
    medium: <Clock size={16} className="mr-1" />,
    low: <CheckCircle size={16} className="mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colors[risk as keyof typeof colors]}`}>
      {icons[risk as keyof typeof icons]}
      {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </span>
  );
};

const HistoryPage = () => {
  const { analyses, loading, error, fetchAnalyses } = useAnalysisStore(state => ({
    analyses: state.analyses,
    loading: state.loading,
    error: state.error,
    fetchAnalyses: state.fetchAnalyses
  }));

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">Loading analyses...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Error loading analyses</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600">
            <Calendar size={48} />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No analyses yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by analyzing your first image.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analysis History</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all your previous analyses including date, risk level, and detailed results.
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyses.map((analysis) => {
          // Safely type cast the result
          const result = analysis.result as unknown as AnalysisResponse | null;
          
          return (
            <div
              key={analysis.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(analysis.created_at)}
                    </span>
                  </div>
                  <RiskBadge risk={result?.risk || 'low'} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analysis Results</h3>
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={analysis.image_url}
                        alt="Analysis"
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {result?.analysis || 'No analysis available'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Confidence
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((result?.confidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(result?.confidence || 0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;