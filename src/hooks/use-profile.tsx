
import { useState } from 'react';
import { ExtendedProfile, ProfileUpdatePayload } from '@/types/profile';
import { updateProfile } from '@/api/profile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useProfileUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshProfile } = useAuth();

  const uploadAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
    try {
      // Create a unique file name
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Failed to upload avatar",
        description: "There was a problem uploading your profile image. Please try again."
      });
      return null;
    }
  };

  const updateUserProfile = async (profileData: ProfileUpdatePayload, avatarFile: File | null = null) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to update your profile."
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      let avatarUrl = profileData.avatar_url;
      
      // Upload new avatar if provided
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Update profile with new data
      const updatedData: ProfileUpdatePayload = {
        ...profileData,
        avatar_url: avatarUrl || undefined,
      };
      
      const success = await updateProfile(user.id, updatedData);
      
      if (success) {
        // Refresh profile data after update
        await refreshProfile();
        
        toast({
          title: "Profile updated successfully",
          description: "Your profile changes have been saved."
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "An unexpected error occurred. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUserProfile,
    isLoading
  };
};

export const useProfileValidation = () => {
  const checkUsernameAvailability = async (username: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .not('id', 'eq', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no data is returned, username is available
      return !data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  return {
    checkUsernameAvailability
  };
};
