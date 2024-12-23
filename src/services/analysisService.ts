import type { HistopathologicalData } from '../utils/imageProcessing';

export interface AnalysisResponse {
  analysis: string;
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  rawAnalysis: string;
  scanId: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function analyzeImage(
  base64Image: string,
  histopathologicalData: HistopathologicalData
): Promise<AnalysisResponse> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    console.log('Sending request to:', `${apiUrl}/api/analyze`);
    
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        histopathologicalData,
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    const data: AnalysisResponse = await response.json();
    console.log('Analysis successful');
    return data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze image');
  }
}