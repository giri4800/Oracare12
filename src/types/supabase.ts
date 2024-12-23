export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          user_id: string
          image_url: string
          result: Json | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          result?: Json | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          result?: Json | null
          status?: string
          created_at?: string
        }
      }
    }
  }
}