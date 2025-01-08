import express from 'express';
import type { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { fileTypeFromBuffer } from 'file-type';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is missing from environment variables');
  process.exit(1);
}

const app = express();
const port = parseInt(process.env.PORT || '4000', 10);

// Debug logs
console.log('Server initialization:');
console.log('- Port:', port);
console.log('- API Key:', process.env.ANTHROPIC_API_KEY ? '✓ Present' : '✗ Missing');

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',  // Default Vite port
  'http://localhost:5177',  // Current frontend port
  'http://192.168.29.86:5177', // Network access
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are a medical image analysis assistant specializing in oral cancer detection. 
Your task is to analyze oral cavity images for signs of cancer with high accuracy.

IMPORTANT GUIDELINES FOR RISK ASSESSMENT:

HIGH RISK indicators (if ANY of these are present, classify as HIGH RISK):
- Ulcers or lesions that don't heal
- Red or white patches with irregular borders
- Unexplained bleeding
- Hard lumps or thickening of tissue
- Visible tissue destruction
- Significant color changes (especially mixed red and white areas)

MEDIUM RISK indicators:
- Persistent white or red patches with regular borders
- Mild swelling without ulceration
- Changes in texture without other symptoms
- Minor color variations

LOW RISK indicators:
- Normal, healthy-looking tissue
- Regular, symmetrical appearance
- Uniform coloring
- No ulcers or patches
- No unexplained swelling

Analysis Format:

1. Initial Observation:
   - State if you observe any of the HIGH RISK indicators listed above
   - Describe what you see in detail
   - Note any concerning patterns or abnormalities

2. Risk Assessment:
   CLEARLY STATE ONE OF:
   - "RISK LEVEL: HIGH" - if ANY high-risk indicators are present
   - "RISK LEVEL: MEDIUM" - if medium risk indicators are present without high-risk features
   - "RISK LEVEL: LOW" - ONLY if tissue appears healthy with no concerning features

3. Detailed Analysis:
   - Describe specific visual findings
   - Note any abnormal patterns
   - Correlate with patient history

4. Recommendations:
   - Specify urgency of medical attention
   - Suggest next steps
   - Note any additional tests needed

BE DIRECT AND CLEAR ABOUT RISK LEVEL. If you see ANY high-risk indicators, you MUST classify it as HIGH RISK. Do not downplay concerning features.`;

type AllowedMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

const HIGH_RISK_INDICATORS = [
  'ulcer', 'lesion', 'irregular border',
  'bleeding', 'hard lump', 'tissue destruction',
  'concerning', 'suspicious', 'immediate attention',
  'urgent', 'severe'
];

const MEDIUM_RISK_INDICATORS = [
  'persistent', 'mild swelling',
  'texture change', 'minor variation',
  'follow-up needed', 'monitor'
];

interface HistopathologicalData {
  age: string;
  tobacco: 'Yes' | 'No' | 'Former';
  smoking: 'Yes' | 'No' | 'Former';
  panMasala: 'Yes' | 'No' | 'Former';
  symptomDuration: string;
  painLevel?: 'None' | 'Mild' | 'Moderate' | 'Severe';
  difficultySwallowing?: 'Yes' | 'No';
  weightLoss?: 'Yes' | 'No';
  familyHistory?: 'Yes' | 'No' | 'Unknown';
  immuneCompromised?: 'Yes' | 'No' | 'Unknown';
  persistentSoreThroat?: 'Yes' | 'No';
  voiceChanges?: 'Yes' | 'No';
  lumpsInNeck?: 'Yes' | 'No';
  frequentMouthSores?: 'Yes' | 'No';
  poorDentalHygiene?: 'Yes' | 'No';
}

interface AnalyzeRequestBody {
  image: string;
  histopathologicalData?: HistopathologicalData;
}

interface AnalyzeResponseBody {
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

const analyzeHandler: RequestHandler<{}, AnalyzeResponseBody | ErrorResponse, AnalyzeRequestBody> = async (req, res) => {
  try {
    console.log('Received analysis request');
    const { image: base64Image, histopathologicalData } = req.body;

    if (!base64Image) {
      console.error('No image provided in request');
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    // Convert base64 to buffer and check file type
    console.log('Converting image and checking file type');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const fileType = await fileTypeFromBuffer(imageBuffer);

    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime as AllowedMimeType)) {
      console.error('Invalid image format:', fileType?.mime);
      res.status(400).json({ 
        error: 'Invalid image format',
        details: `Supported formats: ${ALLOWED_MIME_TYPES.join(', ')}`
      });
      return;
    }

    // Create prompt with image and clinical data
    console.log('Creating analysis prompt');
    let prompt = `${systemPrompt}\n\nAnalyze this medical image for signs of oral cancer. `;
    if (histopathologicalData) {
      prompt += `\nPatient Information:\n${JSON.stringify(histopathologicalData, null, 2)}`;
    }

    // Log the API key being used (first few characters)
    const apiKeyPreview = process.env.ANTHROPIC_API_KEY?.substring(0, 10) + '...';
    console.log('Using Anthropic API Key:', apiKeyPreview);

    try {
      console.log('Sending request to Anthropic API');
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: fileType.mime as AllowedMimeType,
                  data: base64Image
                }
              }
            ]
          }
        ]
      });

      console.log('Received response from Anthropic API:', {
        messageId: message.id,
        model: message.model,
        role: message.role,
        hasContent: !!message.content && message.content.length > 0
      });

      if (!message.content || message.content.length === 0) {
        throw new Error('No response content from Anthropic API');
      }

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic API');
      }

      const responseText = content.text;
      console.log('Analysis Text Length:', responseText.length);

      // Updated risk level parsing logic
      let risk: 'low' | 'medium' | 'high' = 'low';
      
      // Look for explicit risk level statements first
      if (responseText.toLowerCase().includes('risk level: high')) {
        risk = 'high';
      } else if (responseText.toLowerCase().includes('risk level: medium')) {
        risk = 'medium';
      } else if (responseText.toLowerCase().includes('risk level: low')) {
        risk = 'low';
      } else {
        // Fallback to keyword analysis
        const highRiskCount = HIGH_RISK_INDICATORS.filter(indicator => 
          responseText.toLowerCase().includes(indicator)).length;
        const mediumRiskCount = MEDIUM_RISK_INDICATORS.filter(indicator => 
          responseText.toLowerCase().includes(indicator)).length;

        if (highRiskCount > 0) {
          risk = 'high';
        } else if (mediumRiskCount > 0) {
          risk = 'medium';
        }
      }

      // Calculate confidence based on the certainty of language and number of indicators
      let confidence = 0.7;
      if (responseText.toLowerCase().includes('clearly') || 
          responseText.toLowerCase().includes('definitely') || 
          responseText.toLowerCase().includes('certainly') ||
          responseText.toLowerCase().includes('obvious')) {
        confidence += 0.2;
      } else if (responseText.toLowerCase().includes('possibly') || 
                responseText.toLowerCase().includes('might') || 
                responseText.toLowerCase().includes('may') ||
                responseText.toLowerCase().includes('unclear')) {
        confidence -= 0.2;
      }

      const response = {
        analysis: responseText,
        risk,
        confidence,
        rawAnalysis: responseText,
        scanId: message.id
      };

      console.log('Analysis Results:', {
        risk,
        confidence,
        textLength: responseText.length,
        containsHighRiskTerms: HIGH_RISK_INDICATORS.some(term => responseText.toLowerCase().includes(term)),
        containsMediumRiskTerms: MEDIUM_RISK_INDICATORS.some(term => responseText.toLowerCase().includes(term))
      });

      console.log('Sending analysis response:', {
        risk,
        analysisLength: responseText.length,
        scanId: message.id,
        confidence
      });

      res.json(response);
    } catch (apiError: any) {
      console.error('Anthropic API Error:', {
        message: apiError.message,
        type: apiError.type,
        status: apiError.status
      });
      throw apiError;
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Anthropic API Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to analyze image',
      details: error.toString()
    });
  }
};

app.post('/api/analyze', analyzeHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
