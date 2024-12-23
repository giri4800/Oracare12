import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2, Search, RefreshCw } from 'lucide-react';
import { analyzeImage } from '../../services/analysisService';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import { processImage, type HistopathologicalData } from '../../utils/imageProcessing';
import type { AnalysisResponse } from '../../services/analysisService';

const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createAnalysis } = useAnalysisStore();
  const [formData, setFormData] = useState<HistopathologicalData>({
    age: '',
    tobacco: 'No',
    smoking: 'No',
    panMasala: 'No',
    symptomDuration: '',
    painLevel: 'None',
    difficultySwallowing: 'No',
    weightLoss: 'No',
    familyHistory: 'No',
    immuneCompromised: 'No',
    persistentSoreThroat: 'No',
    voiceChanges: 'No',
    lumpsInNeck: 'No',
    frequentMouthSores: 'No',
    poorDentalHygiene: 'No',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Data = await processImage(file);
      setPreview(`data:${file.type};base64,${base64Data}`);
      setError(null);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('File processing error:', err);
    }
  };

  const handleFormChange = (field: keyof HistopathologicalData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    if (!preview) {
      setError('Please upload an image first');
      return;
    }

    if (!formData.age || !formData.symptomDuration) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const base64Data = preview.split(',')[1];
      const result = await analyzeImage(base64Data, formData);
      setAnalysisResult(result);
      await createAnalysis(preview, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setAnalysisResult(null);
    setError(null);
    setFormData({
      age: '',
      tobacco: 'No',
      smoking: 'No',
      panMasala: 'No',
      symptomDuration: '',
      painLevel: 'None',
      difficultySwallowing: 'No',
      weightLoss: 'No',
      familyHistory: 'No',
      immuneCompromised: 'No',
      persistentSoreThroat: 'No',
      voiceChanges: 'No',
      lumpsInNeck: 'No',
      frequentMouthSores: 'No',
      poorDentalHygiene: 'No',
    });
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-2xl w-full rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </div>
        ) : (
          <div className="w-full max-w-2xl h-64 border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center transition-colors duration-300 hover:border-blue-400 dark:hover:border-blue-500">
            <div className="text-center space-y-2">
              <Upload size={40} className="mx-auto text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-300">Upload or capture an image</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Upload size={20} className="animate-bounce" />
            <span>Upload Image</span>
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !preview}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Analyze Image</span>
              </>
            )}
          </button>

          {(preview || analysisResult) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <RefreshCw size={20} />
              <span>Reset</span>
            </button>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age*</label>
            <input
              type="text"
              value={formData.age}
              onChange={(e) => handleFormChange('age', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom Duration*</label>
            <input
              type="text"
              value={formData.symptomDuration}
              onChange={(e) => handleFormChange('symptomDuration', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              placeholder="e.g., 2 weeks"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tobacco Use</label>
            <select
              value={formData.tobacco}
              onChange={(e) => handleFormChange('tobacco', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Former">Former</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Smoking</label>
            <select
              value={formData.smoking}
              onChange={(e) => handleFormChange('smoking', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Former">Former</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Level</label>
            <select
              value={formData.painLevel}
              onChange={(e) => handleFormChange('painLevel', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Swallowing</label>
            <select
              value={formData.difficultySwallowing}
              onChange={(e) => handleFormChange('difficultySwallowing', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight Loss</label>
            <select
              value={formData.weightLoss}
              onChange={(e) => handleFormChange('weightLoss', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Family History</label>
            <select
              value={formData.familyHistory}
              onChange={(e) => handleFormChange('familyHistory', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Immune Compromised</label>
            <select
              value={formData.immuneCompromised}
              onChange={(e) => handleFormChange('immuneCompromised', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Persistent Sore Throat</label>
            <select
              value={formData.persistentSoreThroat}
              onChange={(e) => handleFormChange('persistentSoreThroat', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voice Changes</label>
            <select
              value={formData.voiceChanges}
              onChange={(e) => handleFormChange('voiceChanges', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lumps in Neck</label>
            <select
              value={formData.lumpsInNeck}
              onChange={(e) => handleFormChange('lumpsInNeck', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequent Mouth Sores</label>
            <select
              value={formData.frequentMouthSores}
              onChange={(e) => handleFormChange('frequentMouthSores', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Poor Dental Hygiene</label>
            <select
              value={formData.poorDentalHygiene}
              onChange={(e) => handleFormChange('poorDentalHygiene', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors duration-200"
              disabled={loading}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-6 transform transition-all duration-500 hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">Risk Level:</span>
              <span className={`px-4 py-1.5 rounded-full text-white font-medium ${
                analysisResult.risk === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                analysisResult.risk === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-green-500 to-green-600'
              }`}>
                {analysisResult.risk.charAt(0).toUpperCase() + analysisResult.risk.slice(1)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Analysis:</span>
              <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                {analysisResult.analysis}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">Confidence:</span>
              <div className="flex-1 max-w-xs">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${(analysisResult.confidence * 100).toFixed(1)}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {(analysisResult.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;