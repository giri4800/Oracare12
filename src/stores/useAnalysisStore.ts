import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import type { AnalysisResponse } from '../services/analysisService';

type Analysis = Database['public']['Tables']['analyses']['Row'];

interface AnalysisState {
  analyses: Analysis[];
  loading: boolean;
  error: string | null;
  fetchAnalyses: () => Promise<void>;
  createAnalysis: (imageUrl: string, result: AnalysisResponse) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  analyses: [],
  loading: false,
  error: null,
  fetchAnalyses: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ analyses: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  createAnalysis: async (imageUrl: string, result: AnalysisResponse) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('analyses').insert({
        image_url: imageUrl,
        user_id: user.id,
        result: result,
        status: 'completed',
      });

      if (error) throw error;
      await get().fetchAnalyses();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));