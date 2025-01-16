import { create } from 'zustand';
import type { AnalysisResponse } from '../services/analysisService';
import type { Json } from '../types/supabase';
import { supabase } from '../lib/supabase';

// Define the database analysis type
interface DBAnalysis {
  id: string;
  user_id: string;
  image_url: string;
  result: Json;
  status: string;
  created_at: string;
}

// Define the frontend analysis type
interface Analysis {
  id: string;
  user_id: string;
  image_url: string;
  result: AnalysisResponse;
  status: string;
  created_at: string;
  patientId: string;
  scanId: string;
}

interface AnalysisStore {
  analyses: Analysis[];
  loading: boolean;
  error: Error | null;
  createAnalysis: (analysis: Partial<Analysis> & { patientId: string }) => Promise<void>;
  fetchAnalyses: () => Promise<void>;
  getAnalysisByPatientId: (patientId: string) => Analysis | undefined;
  getAnalysisByScanId: (scanId: string) => Analysis | undefined;
  clearError: () => void;
}

// Convert DB analysis to frontend analysis
function convertDBAnalysisToAnalysis(dbAnalysis: DBAnalysis): Analysis {
  console.log('Converting DB analysis:', dbAnalysis);
  const result = dbAnalysis.result as AnalysisResponse;
  
  return {
    id: dbAnalysis.id,
    user_id: dbAnalysis.user_id,
    image_url: dbAnalysis.image_url,
    result: result,
    status: dbAnalysis.status,
    created_at: dbAnalysis.created_at,
    patientId: result.patientId || '',
    scanId: result.scanId || ''
  };
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  analyses: [],
  loading: false,
  error: null,

  createAnalysis: async (analysis: Partial<Analysis> & { patientId: string }) => {
    try {
      set({ loading: true, error: null });
      
      // Generate unique IDs if not provided
      const scanId = analysis.scanId || crypto.randomUUID();
      const newAnalysis: Analysis = {
        id: analysis.id || crypto.randomUUID(),
        user_id: analysis.user_id || 'default_user',
        image_url: analysis.image_url || '',
        result: {
          ...(analysis.result || {}),
          patientId: analysis.patientId,
          scanId
        } as AnalysisResponse,
        status: analysis.status || 'completed',
        created_at: analysis.created_at || new Date().toISOString(),
        patientId: analysis.patientId,
        scanId
      };

      console.log('Creating analysis with data:', {
        id: newAnalysis.id,
        user_id: newAnalysis.user_id,
        patient_id: newAnalysis.patientId,
        scan_id: newAnalysis.scanId,
        risk: newAnalysis.result.risk,
        confidence: newAnalysis.result.confidence
      });

      // Insert into Supabase
      const { data, error: dbError } = await supabase
        .from('analyses')
        .insert({
          id: newAnalysis.id,
          user_id: newAnalysis.user_id,
          image_url: newAnalysis.image_url,
          result: {
            ...newAnalysis.result,
            patientId: newAnalysis.patientId,
            scanId: newAnalysis.scanId,
            analysis: newAnalysis.result.analysis,
            risk: newAnalysis.result.risk,
            confidence: newAnalysis.result.confidence,
            findings: newAnalysis.result.findings,
            recommendations: newAnalysis.result.recommendations
          },
          status: newAnalysis.status,
          created_at: newAnalysis.created_at
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Update the local state with the new analysis
      const analyses = get().analyses;
      set({ analyses: [...analyses, newAnalysis] });
      
    } catch (error: any) {
      console.error('Error creating analysis:', error);
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchAnalyses: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching analyses');
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        throw error;
      }

      const analyses = (data || []).map(convertDBAnalysisToAnalysis);
      console.log('Fetched and converted analyses:', analyses);
      set({ analyses });
    } catch (error: any) {
      console.error('Error in fetchAnalyses:', error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  getAnalysisByPatientId: (patientId: string) => {
    return get().analyses.find(a => a.patientId === patientId);
  },

  getAnalysisByScanId: (scanId: string) => {
    return get().analyses.find(a => a.scanId === scanId);
  },

  clearError: () => set({ error: null })
}));