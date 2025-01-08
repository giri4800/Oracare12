import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Search, RefreshCw, X } from 'lucide-react';
import { analyzeImage } from '../../services/analysisService';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { usePatientStore } from '../../stores/usePatientStore';
import { processImage, validateImage, SUPPORTED_IMAGE_FORMATS, type HistopathologicalData } from '../../utils/imageProcessing';
import type { AnalysisResponse } from '../../services/analysisService';
import CameraCapture from './CameraCapture';

const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createAnalysis } = useAnalysisStore();
  const { getPatientById } = usePatientStore();
  const [patientId, setPatientId] = useState('');

  const processAndSetImage = async (file: File) => {
    try {
      validateImage(file);
      const reader = new FileReader();
      
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read image file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });

      console.log('Image data length:', imageData.length);
      setPreview(imageData);
      setError(null);
    } catch (err) {
      console.error('Image processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File change detected'); // Debug log
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('File dropped'); // Debug log
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleAnalyze = async () => {
    if (!preview || !patientId) {
      setError('Please upload an image and enter a patient ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get patient data
      const patient = await getPatientById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      console.log('Found patient:', patient); // Add debug log

      // Convert patient data to histopathological data
      const histopathologicalData: HistopathologicalData = {
        patientId: patient.patient_id,
        age: patient.age?.toString() || '0',
        tobacco: patient.tobacco || 'No',
        smoking: patient.smoking || 'No',
        pan_masala: patient.pan_masala || 'No',
        symptom_duration: patient.symptom_duration || '',
        painLevel: patient.pain_level || 'None',
        difficultySwallowing: patient.difficulty_swallowing || 'No',
        weightLoss: patient.weight_loss || 'No',
        familyHistory: patient.family_history || 'No',
        immuneCompromised: patient.immune_compromised || 'No',
        persistentSoreThroat: patient.persistent_sore_throat || 'No',
        voiceChanges: patient.voice_changes || 'No',
        lumpsInNeck: patient.lumps_in_neck || 'No',
        frequentMouthSores: patient.frequent_mouth_sores || 'No',
        poorDentalHygiene: patient.poor_dental_hygiene || 'No'
      };

      // Analyze image
      const result = await analyzeImage(preview, histopathologicalData);
      console.log('Analysis result:', result);

      // Store analysis result
      try {
        const analysisToSave = {
          patientId: patient.patient_id, // Ensure we're using patient_id
          user_id: patient.user_id, // Add user_id from patient
          image_url: preview,
          result: {
            risk: result.risk || 'low',
            confidence: result.confidence || 0.95,
            analysis: result.analysis || 'Analysis completed successfully',
            findings: Array.isArray(result.findings) ? result.findings : [],
            recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
              'Maintain regular oral hygiene practices',
              'Continue routine dental check-ups'
            ],
            scanId: result.scanId || crypto.randomUUID(),
            analysisLength: result.analysisLength || 0,
            rawAnalysis: result.rawAnalysis || ''
          },
          status: 'completed',
          created_at: new Date().toISOString()
        };

        console.log('Saving analysis with patient ID:', analysisToSave.patientId); // Add debug log
        await createAnalysis(analysisToSave);
        console.log('Analysis saved successfully');
      } catch (saveError) {
        console.error('Failed to save analysis:', saveError);
        throw saveError;
      }

      setAnalysisResult(result);
      
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    console.log('Resetting form'); // Debug log
    setPreview(null);
    setAnalysisResult(null);
    setError(null);
    setPatientId('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = (imageData: string) => {
    console.log('Camera capture received'); // Debug log
    setPreview(imageData);
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Image Analysis
            </h2>
            
            {/* Patient ID Input */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient ID
              </label>
              <input
                type="text"
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-medical-primary-500 focus:ring-medical-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter patient ID"
              />
            </div>

            {/* Upload Area */}
            {!preview && (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center space-y-4 hover:border-medical-primary-500 dark:hover:border-medical-primary-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700"
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <div className="space-y-2">
                    <label
                      htmlFor="file-upload"
                      className="text-medical-primary-600 dark:text-medical-primary-400 hover:text-medical-primary-500 cursor-pointer"
                    >
                      <span>Upload an image</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept={SUPPORTED_IMAGE_FORMATS.join(', ')}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      or drag and drop here
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Area */}
            {preview && (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto object-contain max-h-[400px]"
                  onLoad={() => console.log('Image loaded in preview')} // Debug log
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log('Clearing preview'); // Debug log
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-900/70 rounded-full text-white hover:bg-gray-900/90 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  console.log('Opening camera');
                  setShowCamera(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-medical-primary-600 dark:hover:bg-medical-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-medical-primary-500 transition-colors disabled:opacity-50"
              >
                <Camera className="w-5 h-5 mr-2" />
                <span>Capture</span>
              </button>
              
              {preview && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-medical-primary-600 dark:hover:bg-medical-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-medical-primary-500 disabled:bg-indigo-400 dark:disabled:bg-medical-primary-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 mr-2" />
                  )}
                  <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              )}

              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Resetting form');
                    handleReset();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-medical-primary-500 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          {analysisResult && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analysis Results</h3>
              
              <div className="mt-4 space-y-6">
                {/* Risk Level and Confidence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</p>
                    <p className={`mt-1 text-lg font-semibold ${
                      analysisResult.risk === 'high' ? 'text-red-600 dark:text-red-400' :
                      analysisResult.risk === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {analysisResult.risk.charAt(0).toUpperCase() + analysisResult.risk.slice(1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.round(analysisResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Analysis Summary</p>
                  <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-4">
                    {/* Visual Assessment */}
                    {analysisResult.rawAnalysis && (
                      <>
                        <div>
                          <h4 className="font-medium mb-2">Visual Assessment</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {JSON.parse(analysisResult.rawAnalysis).visual_assessment?.objective_findings?.map((finding: string, index: number) => (
                              <li key={index}>{finding}</li>
                            )) || <li>No findings available</li>}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Classification</h4>
                          <p>Overall Appearance: {JSON.parse(analysisResult.rawAnalysis).classification?.overall_appearance || 'Not specified'}</p>
                          <p>Risk Level: {JSON.parse(analysisResult.rawAnalysis).classification?.risk_level || 'Not specified'}</p>
                          {JSON.parse(analysisResult.rawAnalysis).classification?.visual_evidence && (
                            <div className="mt-2">
                              <p className="font-medium">Visual Evidence:</p>
                              <ul className="list-disc list-inside">
                                {JSON.parse(analysisResult.rawAnalysis).classification.visual_evidence.map((evidence: string, index: number) => (
                                  <li key={index}>{evidence}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recommendations</p>
                    <ul className="list-disc list-inside space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full mx-4">
            <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;