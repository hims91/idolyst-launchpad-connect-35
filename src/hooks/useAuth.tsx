
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthContextType, AuthState, AuthUser, UserProfile, SignUpFormData, LoginFormData, ForgotPasswordFormData, ResetPasswordFormData, mapSupabaseUser } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const authUser = mapSupabaseUser(session.user);
          
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              *,
              roles:user_roles(id, role, is_verified)
            `)
            .eq('id', authUser.id)
            .single();
            
          if (profileError) throw profileError;
          
          setAuthState({
            user: authUser,
            profile: profileData as UserProfile,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const authUser = mapSupabaseUser(session.user);
          
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select(`
              *,
              roles:user_roles(id, role, is_verified)
            `)
            .eq('id', authUser.id)
            .single();
            
          setAuthState({
            user: authUser,
            profile: profileData as UserProfile || null,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Sign up successful',
        description: 'Please check your email to verify your account',
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Sign in successful',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: 'Signed out successfully',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for the reset link',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Failed to send reset email',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated successfully',
        description: 'Your password has been changed',
      });
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: 'Failed to update password',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!authState.user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', authState.user.id);
        
      if (error) throw error;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...profile } : null,
      }));
      
      toast({
        title: 'Profile updated successfully',
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: 'Failed to update profile',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addRole = async (role: 'entrepreneur' | 'mentor') => {
    try {
      if (!authState.user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: authState.user.id,
          role,
        });
        
      if (error) throw error;
      
      // Refresh profile
      await refreshProfile();
      
      toast({
        title: 'Role added successfully',
        description: `You're now ${role === 'entrepreneur' ? 'an entrepreneur' : 'a mentor'}!`,
      });
    } catch (error: any) {
      console.error('Add role error:', error);
      toast({
        title: 'Failed to add role',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removeRole = async (roleId: string) => {
    try {
      if (!authState.user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
        
      if (error) throw error;
      
      // Refresh profile
      await refreshProfile();
      
      toast({
        title: 'Role removed successfully',
      });
    } catch (error: any) {
      console.error('Remove role error:', error);
      toast({
        title: 'Failed to remove role',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!authState.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:user_roles(id, role, is_verified)
        `)
        .eq('id', authState.user.id)
        .single();
        
      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        profile: data as UserProfile,
      }));
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    addRole,
    removeRole,
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
