import { create } from 'zustand';
import { supabase, type Profile } from '../lib/supabase';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: 'franchisee' | 'franchisor') => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, isLoading: false });
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ 
        user: profile as Profile | null,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading user:', error);
      set({ 
        user: null, 
        isLoading: false,
        error: 'Failed to load user profile'
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      await useAuthStore.getState().loadUser();
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign in' 
      });
    }
  },

  signUp: async (email, password, fullName, userType) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            user_type: userType,
          });
        
        if (profileError) throw profileError;
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign up' 
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ user: null, isLoading: false });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to sign out' 
      });
    }
  },
}));