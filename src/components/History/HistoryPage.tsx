import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { usePatientStore } from '../../stores/usePatientStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Camera, Users, AlertCircle, Activity, Calendar, ArrowUpDown } from 'lucide-react';
import SkeletonTable from '../ui/SkeletonTable';
import { Json } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

type PriorityLevel = 'immediate' | 'elevated' | 'routine' | '';

interface Finding {
  type: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
}

interface AnalysisResult {
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  analysis: string;
  findings: Finding[] | null;
  recommendations: string[] | null;
  patientId: string;
  patient_id: string;
  name: string;
  scanId: string;
  analysisLength: number;
  age?: number;
  tobacco?: string;
  smoking?: string;
  pan_masala?: string;
  symptom_duration?: string;
  pain_level?: string;
  difficulty_swallowing?: string;
}

interface DBAnalysis {
  id: string;
  user_id: string;
  image_url: string;
  result: Json;
  status: string;
  created_at: string;
}

type SortField = 'patientId' | 'name' | 'priority' | 'date';
type SortOrder = 'asc' | 'desc';

type JsonObject = { [key: string]: Json | undefined };

// Helper function to check if a value matches the Finding interface
const isFinding = (value: unknown): value is Finding => {
  if (!value || typeof value !== 'object') return false;
  const finding = value as any;
  return (
    typeof finding.type === 'string' &&
    typeof finding.description === 'string' &&
    typeof finding.severity === 'string' &&
    ['low', 'moderate', 'high'].includes(finding.severity)
  );
};

// Helper function to check if an array contains valid findings
const isFindings = (value: unknown): value is Finding[] => {
  return Array.isArray(value) && value.every(isFinding);
};

// Helper function to check if an array contains strings
const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

const isAnalysisResultLike = (json: JsonObject): json is JsonObject & {
  risk: string;
  confidence: number;
  analysis: string;
  findings: Finding[] | null;
  recommendations: string[] | null;
  patientId: string;
  scanId: string;
  analysisLength: number;
} => {
  if (!json) return false;
  
  const risk = json.risk;
  const confidence = json.confidence;
  const findings = json.findings;
  const recommendations = json.recommendations;
  
  return (
    typeof risk === 'string' &&
    ['low', 'medium', 'high'].includes(risk as string) &&
    typeof confidence === 'number' &&
    typeof json.patientId === 'string' &&
    typeof json.scanId === 'string' &&
    typeof json.analysisLength === 'number' &&
    (findings === null || isFindings(findings)) &&
    (recommendations === null || isStringArray(recommendations))
  );
};

const getAssessmentLevel = (result: Partial<AnalysisResult>): string => {
  if (!result) return 'Assessment Pending';
  
  // Try to extract assessment level from the analysis text
  const analysisText = result.analysis as string;
  if (analysisText) {
    const assessmentMatch = analysisText.match(/Assessment Level[:\s]*([^\n]+)/i);
    if (assessmentMatch && assessmentMatch[1]) {
      return assessmentMatch[1].trim();
    }
  }
  
  // Fallback to risk-based assessment if no explicit level found
  const risk = (result.risk as string)?.toLowerCase();
  const confidence = result.confidence || 0;
  
  if (risk === 'high' || confidence > 0.8) {
    return 'Priority Review';
  } else if (risk === 'medium' || confidence > 0.6) {
    return 'Follow-up';
  } else {
    return 'Routine';
  }
};

const getAssessmentBadgeColor = (assessment: string) => {
  switch (assessment) {
    case 'Priority Review':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'Follow-up':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Routine':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { analyses, fetchAnalyses } = useAnalysisStore();
  const { patients, fetchPatients } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [analysisWithPatientData, setAnalysisWithPatientData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        await Promise.all([
          fetchAnalyses(user.id),
          fetchPatients()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  useEffect(() => {
    const combineData = () => {
      console.log('Combining data...');
      console.log('All patients:', patients);
      console.log('All analyses:', analyses);
      
      const combined = analyses.map(analysis => {
        console.log('Processing analysis:', analysis);
        console.log('Looking for patient with ID:', analysis.patientId);
        
        const patient = patients.find(p => {
          console.log('Comparing patient_id:', p.patient_id, 'with analysis.patientId:', analysis.patientId);
          return p.patient_id === analysis.patientId;
        });
        
        console.log('Found patient:', patient);
        
        return {
          ...analysis,
          patientData: patient || {
            name: 'Unknown',
            age: 'N/A',
            patient_id: analysis.patientId || 'N/A'
          }
        };
      });
      setAnalysisWithPatientData(combined);
    };
    combineData();
  }, [analyses, patients]);

  const sortedAnalyses = useMemo(() => {
    return analysisWithPatientData
      .filter(analysis => {
        if (!searchTerm) return true;
        const patientData = analysis.patientData;
        const result = analysis.result;
        return (
          patientData?.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result?.analysis?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        switch (sortField) {
          case 'patientId':
            return sortOrder === 'asc'
              ? (a.patientData?.patient_id || '').localeCompare(b.patientData?.patient_id || '')
              : (b.patientData?.patient_id || '').localeCompare(a.patientData?.patient_id || '');
          case 'name':
            return sortOrder === 'asc'
              ? (a.patientData?.name || '').localeCompare(b.patientData?.name || '')
              : (b.patientData?.name || '').localeCompare(a.patientData?.name || '');
          case 'date':
            return sortOrder === 'asc'
              ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return 0;
        }
      });
  }, [analysisWithPatientData, sortField, sortOrder, searchTerm]);

  const handleRowClick = (analysis: any) => {
    navigate(`/analysis/${analysis.id}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return <SkeletonTable />;
  }

  const stats = [
    {
      title: "Total Patients",
      value: patients.length.toString(),
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Total Analyses",
      value: analyses.length.toString(),
      icon: "📊",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      title: "High Priority",
      value: analyses.filter((a: any) => {
        const result = a.resultData;
        return getAssessmentLevel(result) === 'Priority Review';
      }).length.toString(),
      icon: "⚠️",
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Last Analysis",
      value: analyses.length > 0 ? new Date(analyses[0].created_at).toLocaleDateString() : 'No records',
      icon: "📅",
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 relative">
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Dashboard</h1>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 font-medium">{stat.title}</h3>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <table className="w-full min-w-full table-fixed">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-1">
                    <span>PATIENT ID</span>
                    <button 
                      onClick={() => handleSort('patientId')}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="w-2/6 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-1">
                    <span>NAME</span>
                    <button 
                      onClick={() => handleSort('name')}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="w-2/6 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-1">
                    <span>ASSESSMENT LEVEL</span>
                    <button 
                      onClick={() => handleSort('priority')}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-1">
                    <span>DATE</span>
                    <button 
                      onClick={() => handleSort('date')}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAnalyses.map((analysis) => {
                console.log('Rendering analysis:', analysis);
                console.log('Patient data:', analysis.patientData);
                
                const assessment = getAssessmentLevel(analysis.result);
                const badgeColor = getAssessmentBadgeColor(assessment);
                
                return (
                  <tr 
                    key={analysis.id}
                    onClick={() => handleRowClick(analysis)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {analysis.patientData?.patient_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {analysis.patientData?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                        {assessment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;