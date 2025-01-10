import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize auth state
  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, loading: false });
    }
  };

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      set({ user: session.user });
    } else {
      set({ user: null });
    }
  });

  // Call initialize on store creation
  initializeAuth();

  return {
    user: null,
    loading: true,
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          set({ user: data.session.user });
        }
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    signUp: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?mode=login`,
          },
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data.user?.identities?.length === 0) {
          throw new Error('Please check your email for a confirmation link');
        }

        return data;
      } catch (error) {
        console.error('Sign up error:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null });
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    },
  };
});