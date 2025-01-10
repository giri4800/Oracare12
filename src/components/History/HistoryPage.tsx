import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { usePatientStore } from '../../stores/usePatientStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Camera, 
  Users, 
  AlertCircle, 
  Calendar, 
  ArrowUpDown, 
  TrendingUp, 
  Activity,
  ChevronRight
} from 'lucide-react';
import SkeletonTable from '../ui/SkeletonTable';
import { Json } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import PatientList from '../Patient/PatientList';

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
  const [showPatientList, setShowPatientList] = useState(false);

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

  const handlePatientCardClick = () => {
    setShowPatientList(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Patient Dashboard
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Analysis Card */}
          <motion.div
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/analysis')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analyses</h3>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        {analyses.length}
                      </p>
                      <TrendingUp className="w-4 h-4 ml-2 text-green-500" />
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Patients Card */}
          <motion.div
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={handlePatientCardClick}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patients</h3>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                        {patients.length}
                      </p>
                      <Activity className="w-4 h-4 ml-2 text-blue-500" />
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Risk Level Card */}
          <motion.div
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Risk Cases</h3>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
                      {analyses.filter(a => a.result?.risk === 'high').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Latest Analysis Card */}
          <motion.div
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Analysis</h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {analyses.length > 0
                        ? new Date(analyses[0].created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'No analyses yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {showPatientList ? (
            <motion.div
              key="patient-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient List</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPatientList(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  Back to Dashboard
                </motion.button>
              </div>
              <PatientList />
            </motion.div>
          ) : (
            <motion.div 
              key="analysis-table"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <table className="w-full min-w-full table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50">
                    <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-1">
                        <span>PATIENT ID</span>
                        <button 
                          onClick={() => handleSort('patientId')}
                          className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
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
                          className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
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
                          className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
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
                          className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedAnalyses.map((analysis, index) => {
                    const assessment = getAssessmentLevel(analysis.result);
                    const badgeColor = getAssessmentBadgeColor(assessment);
                    
                    return (
                      <motion.tr 
                        key={analysis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{ 
                          scale: 1.01,
                          backgroundColor: 'rgba(var(--color-primary-50), 0.05)'
                        }}
                        onClick={() => handleRowClick(analysis)}
                        className="relative cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                          >
                            {analysis.patientData?.patient_id || 'N/A'}
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                          >
                            {analysis.patientData?.name || 'Unknown'}
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                          >
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeColor} transform transition-all duration-200 group-hover:scale-110`}>
                              {assessment}
                            </span>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.4 }}
                            className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                          >
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </motion.div>
                        </td>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                        />
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPage;