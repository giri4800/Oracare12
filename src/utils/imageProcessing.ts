import { z } from 'zod';

export interface HistopathologicalData {
  patientId?: string;
  age?: string;
  tobacco?: string;
  smoking?: string;
  pan_masala?: string;
  symptom_duration?: string;
  painLevel?: string;
  difficultySwallowing?: string;
  weightLoss?: string;
  familyHistory?: string;
  immuneCompromised?: string;
  persistentSoreThroat?: string;
  voiceChanges?: string;
  lumpsInNeck?: string;
  frequentMouthSores?: string;
  poorDentalHygiene?: string;
}

export const histopathologicalSchema = z.object({
  patientId: z.string().optional(),
  age: z.string().optional(),
  tobacco: z.string().optional(),
  smoking: z.string().optional(),
  pan_masala: z.string().optional(),
  symptom_duration: z.string().optional(),
  painLevel: z.string().optional(),
  difficultySwallowing: z.string().optional(),
  weightLoss: z.string().optional(),
  familyHistory: z.string().optional(),
  immuneCompromised: z.string().optional(),
  persistentSoreThroat: z.string().optional(),
  voiceChanges: z.string().optional(),
  lumpsInNeck: z.string().optional(),
  frequentMouthSores: z.string().optional(),
  poorDentalHygiene: z.string().optional(),
});

// Define supported image formats and max size
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export function validateImage(file: File): void {
  if (!file) {
    throw new Error('No file selected');
  }

  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    throw new Error(`Unsupported file type. Please use: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`);
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB');
  }
}

export function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
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
}

// Build the prompt with patient data
const prompt = (data: HistopathologicalData) => `Analyze this histopathological image for oral cancer detection. Consider the following patient information:
- Age: ${data.age} years
- Substance Use:
  * Tobacco: ${data.tobacco}
  * Smoking: ${data.smoking}
  * Pan Masala: ${data.pan_masala}
- Symptom Duration: ${data.symptom_duration} months
- Pain Level: ${data.painLevel}
- Other Symptoms:
  * Difficulty Swallowing: ${data.difficultySwallowing}
  * Weight Loss: ${data.weightLoss}
  * Family History: ${data.familyHistory}
  * Immune Compromised: ${data.immuneCompromised}
  * Persistent Sore Throat: ${data.persistentSoreThroat}
  * Voice Changes: ${data.voiceChanges}
  * Lumps in Neck: ${data.lumpsInNeck}
  * Frequent Mouth Sores: ${data.frequentMouthSores}
  * Poor Dental Hygiene: ${data.poorDentalHygiene}

Based on the histopathological image and patient history, provide a detailed analysis including:
1. Presence of abnormal cell patterns
2. Signs of malignancy
3. Stage assessment if cancer is detected
4. Correlation with patient risk factors
5. Recommended follow-up actions`;