
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { TwoFactorSetupResponse } from '@/types/auth';

// Verify email address
export const verifyEmail = async (token: string) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    
    return { error };
  } catch (error) {
    console.error('Email verification error:', error);
    return { error };
  }
};

// Check if user exists
export const checkUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    return { exists: !error, error };
  } catch (error) {
    console.error('Check user exists error:', error);
    return { exists: false, error };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, profile: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error('Update profile error:', error);
    return { data: null, error };
  }
};

// Update user password
export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    return { error };
  } catch (error) {
    console.error('Update password error:', error);
    return { error };
  }
};

// Social login with provider (Google, LinkedIn, etc.)
export const signInWithProvider = async (provider: Provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { data, error };
  } catch (error) {
    console.error(`Sign in with ${provider} error:`, error);
    return { data: null, error };
  }
};

// Setup two-factor authentication
export const setupTwoFactor = async (): Promise<TwoFactorSetupResponse> => {
  try {
    // First, get the user to ensure they're authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to setup 2FA');
    }
    
    // Generate the TOTP secret
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
    
    if (error) throw error;
    
    // Return the setup data with QR code URL and secret
    return {
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      error: null
    };
  } catch (error: any) {
    console.error('Two-factor setup error:', error);
    return {
      qrCode: null,
      secret: null,
      error
    };
  }
};

// Verify two-factor token during setup
export const verifyTwoFactorSetup = async (factorId: string, code: string) => {
  try {
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code
    });
    
    return { data, error };
  } catch (error) {
    console.error('Two-factor verification error:', error);
    return { data: null, error };
  }
};

// Verify two-factor token during login
export const verifyTwoFactorLogin = async (factorId: string, code: string) => {
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      code,
    });
    
    return { data, error };
  } catch (error) {
    console.error('Two-factor login verification error:', error);
    return { data: null, error };
  }
};

// Update user's theme preference in profile
export const updateThemePreference = async (userId: string, theme: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ preferred_theme: theme })
      .eq('id', userId);
    
    return { data, error };
  } catch (error) {
    console.error('Update theme preference error:', error);
    return { data: null, error };
  }
};

// Get user's byline
export const getUserByline = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('byline')
      .eq('id', userId)
      .single();
    
    return { byline: data?.byline, error };
  } catch (error) {
    console.error('Get user byline error:', error);
    return { byline: null, error };
  }
};

// Update user's byline
export const updateUserByline = async (userId: string, byline: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ byline })
      .eq('id', userId);
    
    return { data, error };
  } catch (error) {
    console.error('Update user byline error:', error);
    return { data: null, error };
  }
};

// Get user's experience and qualifications
export const getUserProfessionalDetails = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('experience, qualifications')
      .eq('id', userId)
      .single();
    
    return { 
      experience: data?.experience || [], 
      qualifications: data?.qualifications || [],
      error 
    };
  } catch (error) {
    console.error('Get user professional details error:', error);
    return { 
      experience: [], 
      qualifications: [],
      error 
    };
  }
};

// Update user's experience
export const updateUserExperience = async (userId: string, experience: any[]) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ experience })
      .eq('id', userId);
    
    return { data, error };
  } catch (error) {
    console.error('Update user experience error:', error);
    return { data: null, error };
  }
};

// Update user's qualifications
export const updateUserQualifications = async (userId: string, qualifications: any[]) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ qualifications })
      .eq('id', userId);
    
    return { data, error };
  } catch (error) {
    console.error('Update user qualifications error:', error);
    return { data: null, error };
  }
};

// Get user's OAuth connections
export const getUserOAuthConnections = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('oauth_accounts')
      .select('provider, last_sign_in')
      .eq('user_id', userId);
    
    return { connections: data || [], error };
  } catch (error) {
    console.error('Get user OAuth connections error:', error);
    return { connections: [], error };
  }
};
