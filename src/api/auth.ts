
import { supabase } from '@/integrations/supabase/client';

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
