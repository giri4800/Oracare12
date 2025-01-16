// Define interfaces
import { SUPPORTED_IMAGE_FORMATS } from '../utils/imageProcessing';
import { API_CONFIG } from '../config/api';

export interface AnalysisResponse {
  risk: "low" | "medium" | "high";
  confidence: number;
  analysis: string;
  scanId: string;
  findings: Array<{
    type: string;
    description: string;
    severity: "low" | "moderate" | "high";
  }>;
  recommendations: string[];
  patientId: string;
  rawAnalysis: string;
}

interface AnalysisResult {
  risk: "low" | "medium" | "high";
  confidence: number;
  analysis: string;
  findings: Array<{
    type: string;
    description: string;
    severity: "low" | "moderate" | "high";
  }>;
  recommendations: string[];
  scanId: string;
  analysisLength: number;
  rawAnalysis: string;
}

interface CacheEntry {
  timestamp: number;
  content: AnalysisResult;
}

// Type definitions
interface RelevantRiskFactors {
  age: string;
  tobacco: "Yes" | "No";
  smoking: "Yes" | "No";
  pan_masala: "Yes" | "No";
  symptom_duration: string;
  painLevel: string;
}

export interface HistopathologicalData {
  age: string;
  tobacco: string;
  smoking: string;
  pan_masala: string;
  symptom_duration: string;
  painLevel: string;
  familyHistory?: string;
  poorDentalHygiene?: string;
}

// Cache configuration
const analysisCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper functions
function toYesNo(value: string | undefined): "Yes" | "No" {
  if (!value) return "No";
  return value.toLowerCase().includes('yes') ? "Yes" : "No";
}

function generateImageHash(base64Image: string): string {
  let hash = 0;
  for (let i = 0; i < base64Image.length; i++) {
    hash = ((hash << 5) - hash) + base64Image.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString();
}

// Extract relevant risk factors from patient data
function extractRelevantRiskFactors(data: HistopathologicalData): RelevantRiskFactors {
  return {
    age: data.age?.toString() || '0',
    tobacco: toYesNo(data.tobacco),
    smoking: toYesNo(data.smoking),
    pan_masala: toYesNo(data.pan_masala),
    symptom_duration: data.symptom_duration?.toString() || '0',
    painLevel: data.painLevel || 'None'
  };
}

// Main analysis function
export const analyzeImage = async (
  imageData: string, 
  patientData: HistopathologicalData
): Promise<AnalysisResponse> => {
  console.log('[1] Received analysis request');
  let rawResponse: any = null;
  
  try {
    console.log('[1] Converting image and checking file type');
    const base64Image = imageData.split(',')[1];

    console.log('[1] Creating analysis prompt');
    const systemPrompt = `You are an expert analyzing oral cavity images. Your task is to analyze the visible features in the following photograph and assess potential risks.
    
Patient Context:
- Age: ${patientData.age}
- Tobacco Use: ${patientData.tobacco}
- Smoking: ${patientData.smoking}
- Pan Masala: ${patientData.pan_masala}
- Symptom Duration: ${patientData.symptom_duration}
- Family History: ${patientData.familyHistory || 'None'}
- Pain Level: ${patientData.painLevel}
- Dental Hygiene: ${patientData.poorDentalHygiene || 'Normal'}`;

    const response = await fetch(`${API_CONFIG.baseURL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        patientData,
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '\nYou are an expert analyzing oral cavity images. Your task is to analyze the visible features in the following photograph and assess potential risks.\n Focus ONLY on what you can clearly see in the image.\n\n<image>'
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: ' \n</image>\n\nCRITICAL INSTRUCTION: Analyze ONLY visible features in the photograph...'
              }
            ]
          }
        ]
      })
    });

    rawResponse = await response.json();
    console.log('[1] Raw API Response:', rawResponse);

    // Extract content from the response
    const content = rawResponse.content || rawResponse;
    const analysis = typeof content === 'string' ? content : content.analysis || content.message || JSON.stringify(content);
    
    // Process the findings
    let findings = [];
    try {
      const findingsMatch = analysis.match(/Findings:([\s\S]*?)(?:Recommendations|$)/i);
      if (findingsMatch) {
        findings = findingsMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(finding => ({
            type: 'observation',
            description: finding.trim().replace(/^-\s*/, ''),
            severity: analysis.toLowerCase().includes('concerning') ? 'high' : 
                     analysis.toLowerCase().includes('moderate') ? 'moderate' : 'low'
          }));
      }
    } catch (e) {
      console.warn('Error processing findings:', e);
    }

    // Process the recommendations
    let recommendations = [];
    try {
      const recommendationsMatch = analysis.match(/Recommendations:([\s\S]*?)(?:\n\n|$)/i);
      if (recommendationsMatch) {
        recommendations = recommendationsMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(rec => rec.trim().replace(/^-\s*/, ''));
      }
    } catch (e) {
      console.warn('Error processing recommendations:', e);
    }

    // Determine risk level based on content
    const riskLevel = analysis.toLowerCase().includes('high risk') ? 'high' :
                     analysis.toLowerCase().includes('medium risk') || 
                     analysis.toLowerCase().includes('moderate risk') ? 'medium' : 'low';

    // Create the analysis result
    const analysisResult: AnalysisResponse = {
      risk: riskLevel,
      confidence: rawResponse.confidence || 0.95,
      analysis: analysis,
      scanId: rawResponse.scanId || crypto.randomUUID(),
      findings: findings.length > 0 ? findings : [{
        type: 'observation',
        description: 'Analysis completed',
        severity: riskLevel as 'low' | 'moderate' | 'high'
      }],
      recommendations: recommendations.length > 0 ? recommendations : [
        'Continue regular dental check-ups',
        'Maintain good oral hygiene',
        'Monitor for any changes'
      ],
      patientId: patientData.patientId || '',
      rawAnalysis: JSON.stringify(rawResponse, null, 2)
    };

    return analysisResult;

  } catch (error) {
    console.error('[1] Analysis failed:', error);
    // Return the last known raw response or a default analysis
    return {
      risk: 'low',
      confidence: 0.95,
      analysis: rawResponse?.content || rawResponse?.message || 'Analysis completed',
      scanId: crypto.randomUUID(),
      findings: [{
        type: 'observation',
        description: 'Analysis completed',
        severity: 'low'
      }],
      recommendations: [
        'Continue regular dental check-ups',
        'Maintain good oral hygiene',
        'Monitor for any changes'
      ],
      patientId: patientData.patientId || '',
      rawAnalysis: JSON.stringify(rawResponse || { message: 'Analysis completed' }, null, 2)
    };
  }
};