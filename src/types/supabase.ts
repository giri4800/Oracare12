export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface PatientData {
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

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          user_id: string
          image_url: string
          result: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          result?: Json
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          result?: Json
          status?: string
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          patient_id: string
          name: string
          age: number
          gender: string
          tobacco: string
          smoking: string
          pan_masala: string
          symptom_duration: string
          pain_level: string
          difficulty_swallowing: string
          weight_loss: string
          family_history: string
          immune_compromised: string
          persistent_sore_throat: string
          voice_changes: string
          lumps_in_neck: string
          frequent_mouth_sores: string
          poor_dental_hygiene: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          patient_id: string
          name: string
          age: number
          gender: string
          tobacco?: string
          smoking?: string
          pan_masala?: string
          symptom_duration?: string
          pain_level?: string
          difficulty_swallowing?: string
          weight_loss?: string
          family_history?: string
          immune_compromised?: string
          persistent_sore_throat?: string
          voice_changes?: string
          lumps_in_neck?: string
          frequent_mouth_sores?: string
          poor_dental_hygiene?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          patient_id?: string
          name?: string
          age?: number
          gender?: string
          tobacco?: string
          smoking?: string
          pan_masala?: string
          symptom_duration?: string
          pain_level?: string
          difficulty_swallowing?: string
          weight_loss?: string
          family_history?: string
          immune_compromised?: string
          persistent_sore_throat?: string
          voice_changes?: string
          lumps_in_neck?: string
          frequent_mouth_sores?: string
          poor_dental_hygiene?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}