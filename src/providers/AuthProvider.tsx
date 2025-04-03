
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { updateLoginStreak } from '@/api/ascend';
import { getTypedSupabaseClient } from '@/lib/supabase-types';
import { ExtendedProfile } from '@/types/profile';
import { UserRole } from '@/types/auth';

// Create a typed supabase client
const typedSupabase = getTypedSupabaseClient(supabase);

export interface UserWithProfile extends User {
  profile?: ExtendedProfile;
}

interface AuthContextType {
  user: UserWithProfile | null;
  profile: ExtendedProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  roles: UserRole[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await typedSupabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          avatar_url,
          full_name,
          bio,
          xp,
          level,
          created_at,
          portfolio_url,
          professional_details
        `)
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await typedSupabase
        .from('user_roles')
        .select('id, role, is_verified')
        .eq('user_id', userId);
      
      if (rolesError) throw rolesError;
      
      const enhancedProfile: ExtendedProfile = {
        ...profileData,
        roles: userRoles || [],
        followers_count: 0,
        following_count: 0,
        social_links: [],
        badges: [],
        recent_activity: []
      };
      
      setProfile(enhancedProfile);
      setRoles(userRoles || []);
      
      return enhancedProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Refresh user profile data
  const refreshProfile = async () => {
    if (!user) return;
    await fetchUserProfile(user.id);
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user as UserWithProfile);
          setIsAuthenticated(true);
          
          // Update login streak using setTimeout to avoid potential Supabase deadlocks
          setTimeout(async () => {
            await updateLoginStreak(currentSession.user.id);
            
            // Fetch user profile
            const enhancedProfile = await fetchUserProfile(currentSession.user.id);
            if (enhancedProfile) {
              const updatedUser = {
                ...currentSession.user,
                profile: enhancedProfile
              } as UserWithProfile;
              
              setUser(updatedUser);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for an existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user as UserWithProfile);
          setIsAuthenticated(true);
          
          // Update login streak
          await updateLoginStreak(currentSession.user.id);
          
          // Fetch user profile
          const enhancedProfile = await fetchUserProfile(currentSession.user.id);
          if (enhancedProfile) {
            const updatedUser = {
              ...currentSession.user,
              profile: enhancedProfile
            } as UserWithProfile;
            
            setUser(updatedUser);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRoles([]);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setProfile(null);
        setRoles([]);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setSession(null);
        setIsAuthenticated(false);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
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
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    roles,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
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
