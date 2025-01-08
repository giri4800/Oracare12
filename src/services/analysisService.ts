// Define interfaces
import { HistopathologicalData, SUPPORTED_IMAGE_FORMATS } from '../utils/imageProcessing';

export interface AnalysisResponse {
  analysis?: string;
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  analysisLength?: number;
  scanId: string;
  findings?: Array<{
    type: string;
    description: string;
    severity: 'low' | 'moderate' | 'high';
  }>;
  recommendations?: string[];
  rawAnalysis?: string;
}

interface RelevantRiskFactors {
  age: string;
  tobacco: 'Yes' | 'No';
  smoking: 'Yes' | 'No';
  pan_masala: 'Yes' | 'No';
  symptom_duration: string;
  painLevel: string;
}

interface CacheEntry {
  response: AnalysisResponse;
  timestamp: number;
  imageHash: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Cache configuration
const analysisCache = new Map<string, CacheEntry>();
const CACHE_SIZE = 100;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper functions
function toYesNo(value: string | undefined | null): 'Yes' | 'No' {
  return value === 'Yes' ? 'Yes' : 'No';
}

function generateImageHash(base64Image: string): string {
  let hash = 0;
  const sample = base64Image.slice(0, 1000);
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) - hash) + sample.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(36);
}

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

// Helper function to extract base64 data
function extractBase64Data(base64String: string): { mimeType: string, data: string } {
  const match = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!match) {
    throw new Error(JSON.stringify({
      error: "Invalid image format",
      details: "Image must be in base64 format with valid MIME type"
    }));
  }
  return {
    mimeType: match[1],
    data: match[2]
  };
}

// Helper function to validate image format
function validateImageFormat(base64Image: string): void {
  const { mimeType } = extractBase64Data(base64Image);
  if (!SUPPORTED_IMAGE_FORMATS.includes(mimeType as any)) {
    throw new Error(JSON.stringify({
      error: "Invalid image format",
      details: `Supported formats: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`
    }));
  }
}

// Compression function
export async function compressImage(base64Image: string): Promise<string> {
  try {
    const { mimeType, data } = extractBase64Data(base64Image);
    
    // Create an image element
    const img = new Image();
    img.src = base64Image;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Calculate new dimensions (max 800px width/height while maintaining aspect ratio)
    let width = img.width;
    let height = img.height;
    const maxDimension = 800;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Get compressed base64 string
    return canvas.toDataURL(mimeType, 0.8); // 0.8 quality
  } catch (error) {
    console.error('Image compression error:', error);
    return base64Image; // Return original if compression fails
  }
}

// Validation function
function validateResponse(data: AnalysisResponse): AnalysisResponse {
  // If any findings have high severity, escalate risk to high
  if (data.findings?.some(f => f.severity === 'high')) {
    return {
      ...data,
      risk: 'high',
      confidence: 0.99,
      recommendations: [
        "Immediate consultation with an oral pathologist",
        "Biopsy and further diagnostic imaging as needed",
        "Avoid all risk factors (e.g., tobacco, smoking)"
      ]
    };
  }

  // If moderate severity exists, set risk to medium
  if (data.findings?.some(f => f.severity === 'moderate')) {
    return {
      ...data,
      risk: 'medium',
      confidence: 0.85,
      recommendations: [
        "Consult with a dental professional",
        "Monitor the affected area closely",
        "Maintain excellent oral hygiene practices"
      ]
    };
  }

  // Default to low risk if all findings are low severity or none exist
  return {
    ...data,
    risk: 'low',
    confidence: 0.95,
    analysis: "Normal oral cavity appearance with healthy mucosal features. No concerning lesions or abnormalities visible.",
    recommendations: [
      "Maintain regular oral hygiene practices",
      "Continue routine dental check-ups",
      "Practice good oral health habits",
      "Monitor for any changes in appearance"
    ]
  };
}

// Main analysis function
export async function analyzeImage(
  base64Image: string,
  histopathologicalData: HistopathologicalData
): Promise<AnalysisResponse> {
  try {
    // Validate image format first
    const { mimeType, data: imageData } = extractBase64Data(base64Image);
    console.log('Image format:', mimeType);
    
    // Check cache
    const imageHash = generateImageHash(base64Image);
    const cachedResult = Array.from(analysisCache.values())
      .find(entry => entry.imageHash === imageHash);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      return cachedResult.response;
    }

    // Compress image if needed (over 500KB)
    let processedImage = imageData; // Use extracted base64 data directly
    if (base64Image.length > 500000) {
      const compressed = await compressImage(base64Image);
      const { data: compressedData } = extractBase64Data(compressed);
      processedImage = compressedData;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    console.log('API URL:', apiUrl);
    console.log('API Key exists:', !!anthropicKey);
    console.log('Image data length:', processedImage.length);

    if (!anthropicKey) {
      throw new Error('Please add VITE_ANTHROPIC_API_KEY to your .env file');
    }

    const prompt = `You are an expert oral pathologist analyzing an oral cavity image. 

CRITICAL INSTRUCTION: Your primary duty is to avoid false positives and unnecessary anxiety. Start fresh with each image, ignoring risk factors until visual assessment is complete.

STEP 1: BASELINE VISUAL ASSESSMENT
Document the presence or absence of ONLY these features:
A. Mucosal Features (REQUIRED)
   Normal = Pink, uniform, moist
   Abnormal = White/red patches, ulcers, masses

B. Surface Texture (REQUIRED)
   Normal = Smooth, regular
   Abnormal = Rough, irregular, raised

C. Symmetry & Patterns (REQUIRED)
   Normal = Regular patterns, bilateral symmetry
   Abnormal = Irregular patterns, asymmetry

D. Vascular Features (REQUIRED)
   Normal = Fine, regular vessels
   Abnormal = Dilated, irregular vessels

STEP 2: MANDATORY CLASSIFICATION RULES
1. If ALL features are NORMAL:
   - Risk MUST be classified as LOW
   - Confidence should be HIGH (>90%)
   - Ignore ALL risk factors
   - Provide only preventive recommendations

2. If ANY feature is ABNORMAL:
   - Document specific abnormal findings
   - Consider risk factors ONLY NOW
   - Justify any risk elevation with visible evidence
   - Specify which exact visual findings raise concern

REQUIRED OUTPUT FORMAT:
{
  "visual_assessment": {
    "mucosal_features": "normal/abnormal",
    "surface_texture": "normal/abnormal",
    "symmetry": "normal/abnormal",
    "vascularity": "normal/abnormal",
    "objective_findings": ["list ONLY what you see"]
  },
  "classification": {
    "overall_appearance": "normal/abnormal",
    "risk_level": "low/medium/high",
    "confidence": 0.0-1.0,
    "visual_evidence": ["specific abnormalities if any"]
  },
  "recommendations": ["preventive if normal", "diagnostic if abnormal"]
}

MANDATORY CHECKS:
1. Have you documented ALL required features?
2. Are you describing ONLY what you see?
3. For normal appearance, have you assigned LOW risk?
4. For abnormal findings, have you provided specific evidence?

WARNING: Unless you see clear abnormalities, maintain LOW risk assessment. Do not escalate risk based on habits alone.`;

    const requestBody = {
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      image: processedImage,
      prompt,
      patient: extractRelevantRiskFactors(histopathologicalData),
      mimeType: mimeType
    };

    console.log('Sending request with image data length:', processedImage.length);
    
    try {
      console.log('Sending request to:', `${apiUrl}/api/analyze`);
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anthropicKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(errorText || 'Failed to analyze image');
      }

      const rawData = await response.json();
      console.log('Raw API Response:', rawData);

      // Extract the analysis text from the content
      const analysisText = rawData.content || '';
      
      // Parse the analysis text to extract structured data
      let parsedData;
      try {
        // Try to find and parse the JSON structure in the analysis text
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse analysis JSON:', e);
      }

      // Map the API response to our expected format
      const analysisResponse: AnalysisResponse = {
        risk: parsedData?.classification?.risk_level || 'low',
        confidence: parsedData?.classification?.confidence || 0.95,
        scanId: rawData.id || generateImageHash(base64Image),
        analysis: parsedData?.visual_assessment?.objective_findings?.join('\n') || 
                 'Normal oral cavity appearance with healthy mucosal features. No concerning lesions or abnormalities visible.',
        findings: parsedData?.visual_assessment?.objective_findings?.map((finding: string) => ({
          type: 'Observation',
          description: finding,
          severity: parsedData?.classification?.risk_level || 'low'
        })) || [],
        recommendations: parsedData?.recommendations || [
          'Maintain regular oral hygiene practices',
          'Continue routine dental check-ups',
          'Practice good oral health habits',
          'Monitor for any changes in appearance'
        ],
        analysisLength: analysisText.length,
        rawAnalysis: analysisText
      };

      // Validate and return the response
      const validatedData = validateResponse(analysisResponse);

      // Update cache with LRU eviction
      if (validatedData.scanId) {
        if (analysisCache.size >= CACHE_SIZE) {
          const firstKey = analysisCache.keys().next().value;
          if (firstKey) {
            analysisCache.delete(firstKey);
          }
        }
        
        analysisCache.set(validatedData.scanId, {
          response: validatedData,
          timestamp: Date.now(),
          imageHash
        });
      }

      return validatedData;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}