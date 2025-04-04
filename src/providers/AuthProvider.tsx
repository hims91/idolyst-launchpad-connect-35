import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { updateLoginStreak } from '@/api/ascend';
import { getTypedSupabaseClient } from '@/lib/supabase-types';
import { ExtendedProfile } from '@/types/profile';
import { 
  UserRole, 
  TwoFactorSetupResponse, 
  TwoFactorState,
  OAuthConnection, 
  ProfessionalExperience,
  UserQualification
} from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import * as authApi from '@/api/auth';

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
  twoFactorState: TwoFactorState;
  oauthConnections: OAuthConnection[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  setupTwoFactor: () => Promise<TwoFactorSetupResponse>;
  verifyTwoFactorSetup: (factorId: string, code: string) => Promise<{ success: boolean, error: any }>;
  verifyTwoFactorLogin: (factorId: string, code: string) => Promise<{ success: boolean, error: any }>;
  updateByline: (byline: string) => Promise<{ error: any }>;
  updateExperience: (experience: ProfessionalExperience[]) => Promise<{ error: any }>;
  updateQualifications: (qualifications: UserQualification[]) => Promise<{ error: any }>;
  updateThemePreference: (theme: string) => Promise<{ error: any }>;
  addRole: (role: 'entrepreneur' | 'mentor' | 'admin') => Promise<{ error: any }>;
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
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({
    isEnrolled: false,
    isChallengeRequired: false
  });
  const [oauthConnections, setOauthConnections] = useState<OAuthConnection[]>([]);

  const fetchUserProfile = async (userId: string) => {
    try {
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
          professional_details,
          byline,
          experience,
          qualifications,
          preferred_theme
        `)
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      const { data: userRoles, error: rolesError } = await typedSupabase
        .from('user_roles')
        .select('id, role, is_verified')
        .eq('user_id', userId);
      
      if (rolesError) throw rolesError;
      
      const { connections, error: oauthError } = await authApi.getUserOAuthConnections(userId);
      if (!oauthError && connections) {
        setOauthConnections(connections as OAuthConnection[]);
      }
      
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (!factorsError && factorsData) {
        const hasFactors = factorsData.all && factorsData.all.length > 0;
        
        setTwoFactorState({
          isEnrolled: hasFactors,
          isChallengeRequired: hasFactors,
          currentFactorId: hasFactors ? factorsData.all[0]?.id : undefined
        });
      }
      
      const enhancedProfile: ExtendedProfile = {
        ...profileData as any,
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

  const refreshProfile = async () => {
    if (!user) return;
    await fetchUserProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user as UserWithProfile);
          setIsAuthenticated(true);
          
          setTimeout(async () => {
            await updateLoginStreak(currentSession.user.id);
            
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
          setTwoFactorState({
            isEnrolled: false,
            isChallengeRequired: false
          });
          setOauthConnections([]);
        }
        
        setIsLoading(false);
      }
    );

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
          
          await updateLoginStreak(currentSession.user.id);
          
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

  const signInWithProvider = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { data, error } = await authApi.signInWithProvider(provider);
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error(`Sign in with ${provider} error:`, error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setSession(null);
        setIsAuthenticated(false);
        setTwoFactorState({
          isEnrolled: false,
          isChallengeRequired: false
        });
        setOauthConnections([]);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

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

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating password",
          description: error.message || "An error occurred while updating your password."
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully."
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  const setupTwoFactor = async () => {
    try {
      return await authApi.setupTwoFactor();
    } catch (error) {
      console.error('Setup two-factor error:', error);
      return { qrCode: null, secret: null, error };
    }
  };

  const verifyTwoFactorSetup = async (factorId: string, code: string) => {
    try {
      const { data, error } = await authApi.verifyTwoFactorSetup(factorId, code);
      
      if (error) throw error;
      
      setTwoFactorState(prev => ({
        ...prev,
        isEnrolled: true,
        currentFactorId: factorId
      }));
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Verify two-factor setup error:', error);
      return { success: false, error };
    }
  };

  const verifyTwoFactorLogin = async (factorId: string, code: string) => {
    try {
      const { data, error } = await authApi.verifyTwoFactorLogin(factorId, code);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Verify two-factor login error:', error);
      return { success: false, error };
    }
  };

  const updateByline = async (byline: string) => {
    if (!user?.id) {
      return { error: new Error('User not authenticated') };
    }
    
    try {
      const { data, error } = await authApi.updateUserByline(user.id, byline);
      
      if (error) throw error;
      
      if (profile) {
        setProfile({
          ...profile,
          byline
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Update byline error:', error);
      return { error };
    }
  };

  const updateExperience = async (experience: ProfessionalExperience[]) => {
    if (!user?.id) {
      return { error: new Error('User not authenticated') };
    }
    
    try {
      const { data, error } = await authApi.updateUserExperience(user.id, experience);
      
      if (error) throw error;
      
      if (profile) {
        setProfile(prev => ({
          ...prev,
          experience
        }));
      }
      
      return { error: null };
    } catch (error) {
      console.error('Update experience error:', error);
      return { error };
    }
  };

  const updateQualifications = async (qualifications: UserQualification[]) => {
    if (!user?.id) {
      return { error: new Error('User not authenticated') };
    }
    
    try {
      const { data, error } = await authApi.updateUserQualifications(user.id, qualifications);
      
      if (error) throw error;
      
      if (profile) {
        setProfile(prev => ({
          ...prev,
          qualifications
        }));
      }
      
      return { error: null };
    } catch (error) {
      console.error('Update qualifications error:', error);
      return { error };
    }
  };

  const updateThemePreference = async (theme: string) => {
    if (!user?.id) {
      return { error: new Error('User not authenticated') };
    }
    
    try {
      const { data, error } = await authApi.updateThemePreference(user.id, theme);
      
      if (error) throw error;
      
      if (profile) {
        setProfile(prev => ({
          ...prev,
          preferred_theme: theme
        }));
      }
      
      return { error: null };
    } catch (error) {
      console.error('Update theme preference error:', error);
      return { error };
    }
  };

  const addRole = async (role: 'entrepreneur' | 'mentor' | 'admin') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.user.id,
          role: role as any,
          is_verified: false
        });

      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Role added",
        description: `${role} role has been added successfully.`
      });
      
      return { error: null };
    } catch (error) {
      console.error('Add role error:', error);
      
      toast({
        variant: "destructive",
        title: "Error adding role",
        description: "There was an error adding the role."
      });
      
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
    twoFactorState,
    oauthConnections,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    setupTwoFactor,
    verifyTwoFactorSetup,
    verifyTwoFactorLogin,
    updateByline,
    updateExperience,
    updateQualifications,
    updateThemePreference,
    addRole
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
