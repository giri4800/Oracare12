import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Patient {
  id: string;
  user_id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  tobacco: string;
  smoking: string;
  pan_masala: string;
  symptom_duration: string;
  pain_level: string;
  difficulty_swallowing: string;
  weight_loss: string;
  family_history: string;
  immune_compromised: string;
  persistent_sore_throat: string;
  voice_changes: string;
  lumps_in_neck: string;
  frequent_mouth_sores: string;
  poor_dental_hygiene: string;
  created_at: string;
  updated_at: string;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  success: string | null;
  fetchPatients: () => Promise<void>;
  createPatient: (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Patient | undefined>;
  getPatientById: (patientId: string) => Promise<Patient | undefined>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<Patient | undefined>;
  deletePatient: (id: string) => Promise<void>;
  clearMessages: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,
  success: null,

  clearMessages: () => {
    set({ error: null, success: null });
  },

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Not authenticated. Please log in.' });
        return;
      }

      console.log('Fetching patients for user:', user.id);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      console.log('Fetched patients:', data);
      set({ patients: data || [] });
    } catch (error: any) {
      console.error('Error in fetchPatients:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createPatient: async (patientData) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        throw new Error('Not authenticated. Please log in again.');
      }

      console.log('Creating patient with data:', {
        ...patientData,
        user_id: user.id
      });

      const { data, error } = await supabase
        .from('patients')
        .insert([{
          ...patientData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to create patient - no data returned');
      }

      console.log('Patient created successfully:', data);
      set(state => ({
        patients: [data, ...state.patients],
        success: 'Patient created successfully'
      }));

      return data;
    } catch (error: any) {
      console.error('Error in createPatient:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getPatientById: async (patientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ error: 'Not authenticated. Please log in.' });
        return undefined;
      }

      if (!patientId?.trim()) {
        set({ error: 'Patient ID is required' });
        return undefined;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          set({ error: `Patient with ID ${patientId} not found` });
          return undefined;
        }
        console.error('Error fetching patient:', error);
        throw new Error('Failed to fetch patient details');
      }

      return data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch patient' });
      return undefined;
    }
  },

  updatePatient: async (id: string, patientData: Partial<Patient>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPatients = get().patients.map(patient =>
        patient.id === id ? { ...patient, ...data } : patient
      );
      set({ patients: updatedPatients, loading: false, success: 'Patient updated successfully' });
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return undefined;
    }
  },

  deletePatient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedPatients = get().patients.filter(patient => patient.id !== id);
      set({ patients: updatedPatients, loading: false, success: 'Patient deleted successfully' });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
