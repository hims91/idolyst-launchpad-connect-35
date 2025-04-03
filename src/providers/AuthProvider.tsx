
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { updateLoginStreak } from '@/api/ascend';
import { getTypedSupabaseClient } from '@/lib/supabase-types';
import { ExtendedProfile } from '@/types/profile';

// Create a typed supabase client
const typedSupabase = getTypedSupabaseClient(supabase);

export interface UserWithProfile extends User {
  profile?: ExtendedProfile;
}

interface AuthContextType {
  user: UserWithProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch session and user on mount
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
        
        if (session?.user) {
          // Update login streak when user logs in
          await updateLoginStreak(session.user.id);
          
          // Fetch user profile
          const { data: profileData } = await typedSupabase
            .from('profiles')
            .select(`
              id,
              username,
              email,
              avatar_url,
              full_name,
              bio,
              xp,
              created_at
            `)
            .eq('id', session.user.id)
            .single();
          
          // Enhance user object with profile
          const enhancedUser: UserWithProfile = {
            ...session.user,
            profile: profileData || undefined
          };
          
          setUser(enhancedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          // Update login streak on auth change
          await updateLoginStreak(newSession.user.id);
          
          // Fetch user profile
          const { data: profileData } = await typedSupabase
            .from('profiles')
            .select(`
              id,
              username,
              email,
              avatar_url,
              full_name,
              bio,
              xp,
              created_at
            `)
            .eq('id', newSession.user.id)
            .single();
          
          // Enhance user object with profile
          const enhancedUser: UserWithProfile = {
            ...newSession.user,
            profile: profileData || undefined
          };
          
          setUser(enhancedUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
