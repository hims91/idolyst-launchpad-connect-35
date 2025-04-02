
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthState, UserProfile, mapSupabaseUser } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch user profile data including roles
  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch the user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      // Create a complete user profile with roles
      const userProfile: UserProfile = {
        ...mapSupabaseUser({ id: userId, email: profile.email })!,
        full_name: profile.full_name,
        bio: profile.bio,
        xp: profile.xp,
        last_active_tab: profile.last_active_tab,
        roles: roles || [],
        created_at: profile.created_at,
      };

      setState(prev => ({
        ...prev,
        profile: userProfile,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (error: any) {
      console.error("Error fetching user profile:", error.message);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Initialize auth state with session check
  useEffect(() => {
    const initializeAuth = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          setSession(currentSession);

          if (event === 'SIGNED_IN' && currentSession) {
            setState(prev => ({
              ...prev,
              user: mapSupabaseUser(currentSession.user),
              isAuthenticated: true,
            }));

            // Fetch profile in a separate call to avoid auth deadlocks
            setTimeout(() => {
              fetchUserProfile(currentSession.user.id);
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setState({
              ...initialState,
              isLoading: false,
            });
          } else if (event === 'USER_UPDATED' && currentSession) {
            setState(prev => ({
              ...prev,
              user: mapSupabaseUser(currentSession.user),
            }));

            // Fetch updated profile
            setTimeout(() => {
              fetchUserProfile(currentSession.user.id);
            }, 0);
          }
        }
      );

      // Then check for existing session
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();

      if (initialSession) {
        setState(prev => ({
          ...prev,
          user: mapSupabaseUser(initialSession.user),
          isAuthenticated: true,
        }));

        // Fetch the user profile after session check
        setTimeout(() => {
          fetchUserProfile(initialSession.user.id);
        }, 0);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      // Clean up subscription
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: any) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Logged in successfully",
        description: `Welcome back${data.user?.user_metadata?.username ? `, ${data.user.user_metadata.username}` : ''}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  // Reset password (send reset email)
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!state.user?.id) {
      throw new Error("User not authenticated");
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Update profile data
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.user.id);

      if (error) throw error;

      // Refresh profile after update
      await fetchUserProfile(state.user.id);

      toast({
        title: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Add a new role to user
  const addRole = async (role: 'entrepreneur' | 'mentor') => {
    if (!state.user?.id) {
      throw new Error("User not authenticated");
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Check if role already exists
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", state.user.id)
        .eq("role", role);

      if (existingRoles && existingRoles.length > 0) {
        throw new Error(`You already have the ${role} role`);
      }

      // Add the new role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: state.user.id,
          role,
        });

      if (error) throw error;

      // Refresh profile after update
      await fetchUserProfile(state.user.id);

      toast({
        title: "Role added successfully",
        description: `You now have the ${role} role`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding role",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Remove a role from user
  const removeRole = async (roleId: string) => {
    if (!state.user?.id) {
      throw new Error("User not authenticated");
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Delete the role
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId)
        .eq("user_id", state.user.id); // Ensure only deleting own roles

      if (error) throw error;

      // Refresh profile after update
      await fetchUserProfile(state.user.id);

      toast({
        title: "Role removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing role",
        description: error.message,
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Refresh user profile manually
  const refreshProfile = async () => {
    if (!state.user?.id) return;
    await fetchUserProfile(state.user.id);
  };

  const contextValue: AuthContextType = {
    ...state,
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
