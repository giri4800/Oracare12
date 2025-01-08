import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { usePatientStore } from '../../stores/usePatientStore';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

type Analysis = {
  id: string;
  created_at: string;
  user_id: string;
  image_url: string;
  result: {
    patientId: string;
    confidence: number;
    analysis: string;
    findings: Array<{
      type: string;
      description: string;
      severity: 'low' | 'moderate' | 'high';
    }>;
    recommendations: string[];
    assessment: string;
  } | null;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getAssessmentLevel = (confidence: number): string => {
  if (confidence >= 0.7) return 'Priority Review';
  if (confidence >= 0.4) return 'Follow-up';
  return 'Routine';
};

const AnalysisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analyses, fetchAnalyses } = useAnalysisStore();
  const { patients, fetchPatients } = usePatientStore();
  
  useEffect(() => {
    fetchAnalyses();
    fetchPatients();
  }, [fetchAnalyses, fetchPatients]);

  const analysis = analyses.find(a => a.id === id) as Analysis | undefined;
  const patient = analysis?.result?.patientId 
    ? patients.find(p => p.patient_id === analysis.result?.patientId)
    : undefined;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-medical-primary-900 p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Analysis not found</h2>
          <button
            onClick={() => navigate('/history')}
            className="text-medical-primary-600 hover:text-medical-primary-500"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-medical-primary-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Analysis Report
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date of Analysis: {formatDate(analysis.created_at)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const pdf = new jsPDF();
                    
                    // Title
                    pdf.setFontSize(20);
                    pdf.text('Analysis Report', 20, 20);
                    
                    // Patient Info
                    pdf.setFontSize(14);
                    pdf.text('Patient Information', 20, 40);
                    pdf.setFontSize(12);
                    pdf.text(`Patient ID: ${patient?.patient_id || 'Unknown'}`, 20, 50);
                    pdf.text(`Name: ${patient?.name || 'Unknown'}`, 20, 60);
                    pdf.text(`Age: ${patient?.age || 'N/A'}`, 20, 70);
                    pdf.text(`Date: ${formatDate(analysis.created_at)}`, 20, 80);
                    
                    // Assessment Results
                    pdf.setFontSize(14);
                    pdf.text('Assessment Results', 20, 100);
                    pdf.setFontSize(12);
                    pdf.text(`Assessment Level: ${analysis.result ? getAssessmentLevel(analysis.result.confidence) : 'N/A'}`, 20, 110);
                    pdf.text(`Confidence Score: ${analysis.result?.confidence ? `${(analysis.result.confidence * 100).toFixed(1)}%` : 'N/A'}`, 20, 120);
                    
                    // Analysis
                    if (analysis.result?.analysis) {
                      const splitAnalysis = pdf.splitTextToSize(analysis.result.analysis, 170);
                      pdf.text(splitAnalysis, 20, 140);
                    }
                    
                    // Findings
                    if (analysis.result?.findings && analysis.result.findings.length > 0) {
                      let yPos = pdf.internal.pageSize.height - 60;
                      pdf.setFontSize(14);
                      pdf.text('Visual Findings', 20, yPos);
                      pdf.setFontSize(12);
                      analysis.result.findings.forEach((finding, index) => {
                        yPos += 20;
                        if (yPos > pdf.internal.pageSize.height - 20) {
                          pdf.addPage();
                          yPos = 20;
                        }
                        pdf.text(`${finding.type} - ${finding.description} (${finding.severity} severity)`, 20, yPos);
                      });
                    }
                    
                    pdf.save(`analysis_report_${patient?.patient_id || 'unknown'}.pdf`);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="w-full sm:w-auto px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:border-blue-700 font-medium"
                >
                  Back to History
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Patient Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Patient Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">#{patient?.patient_id || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient?.name || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient?.age || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Assessment Results */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Assessment Results
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessment Level</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {analysis.result ? getAssessmentLevel(analysis.result.confidence) : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence Score</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {analysis.result?.confidence ? `${(analysis.result.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Analysis</h3>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {analysis.result?.analysis || 'No analysis available'}
                </p>
              </div>
            </section>

            {/* Visual Findings */}
            {analysis.result?.findings && analysis.result.findings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Visual Findings
                </h2>
                <div className="space-y-4">
                  {analysis.result.findings.map((finding, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{finding.type}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{finding.description}</p>
                      <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        finding.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        finding.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)} Severity
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Health Factors */}
            {patient && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Health Factors
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tobacco Use</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.tobacco || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Smoking</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.smoking || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pan Masala</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.pan_masala || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Family History</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.family_history || 'Not reported'}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Symptoms */}
            {patient && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Symptoms
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Symptom Duration</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.symptom_duration || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pain Level</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.pain_level || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty Swallowing</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.difficulty_swallowing || 'Not reported'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight Loss</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{patient.weight_loss || 'Not reported'}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Recommendations */}
            {analysis.result?.recommendations && analysis.result.recommendations.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommendations
                </h2>
                <ul className="space-y-2">
                  {analysis.result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-medical-primary-500">•</span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisDetail;
