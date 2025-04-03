import { supabase } from "@/integrations/supabase/client";
import { ProfileUpdatePayload, PrivacySettings, isValidProfileVisibility, isValidMessagingPermissions, isValidActivityVisibility } from "@/types/profile";

/**
 * Fetches a user's profile by ID
 * @param userId The user ID to fetch
 * @returns The user profile
 */
export const fetchProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    return null;
  }
};

/**
 * Fetches a user's profile by username
 * @param username The username to fetch
 * @returns The user profile
 */
export const fetchProfileByUsername = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error fetching profile by username:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchProfileByUsername:", error);
    return null;
  }
};

/**
 * Updates a user's profile
 * @param userId The user ID to update
 * @param updates The updates to apply
 * @returns Boolean indicating success
 */
export const updateProfile = async (
  userId: string,
  updates: ProfileUpdatePayload
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return false;
  }
};

/**
 * Fetches the privacy settings for a user
 * @param userId The user ID to fetch privacy settings for
 * @returns The privacy settings or null if not found
 */
export const fetchPrivacySettings = async (
  userId: string
): Promise<PrivacySettings | null> => {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("privacy_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching privacy settings:", error);
      return null;
    }

    // Ensure the values are of the correct type
    return {
      profile_visibility: isValidProfileVisibility(data.profile_visibility) 
        ? data.profile_visibility 
        : 'public',
      messaging_permissions: isValidMessagingPermissions(data.messaging_permissions) 
        ? data.messaging_permissions 
        : 'everyone',
      activity_visibility: isValidActivityVisibility(data.activity_visibility) 
        ? data.activity_visibility 
        : 'public',
    };
  } catch (error) {
    console.error("Error in fetchPrivacySettings:", error);
    return null;
  }
};

/**
 * Updates the privacy settings for a user
 * @param userId The user ID to update privacy settings for
 * @param settings The new privacy settings
 * @returns Boolean indicating success
 */
export const updatePrivacySettings = async (
  userId: string,
  settings: PrivacySettings
): Promise<boolean> => {
  try {
    if (!userId) return false;

    // Validate inputs
    if (!isValidProfileVisibility(settings.profile_visibility)) {
      settings.profile_visibility = 'public';
    }
    
    if (!isValidMessagingPermissions(settings.messaging_permissions)) {
      settings.messaging_permissions = 'everyone';
    }
    
    if (!isValidActivityVisibility(settings.activity_visibility)) {
      settings.activity_visibility = 'public';
    }

    const { error } = await supabase
      .from("privacy_settings")
      .update({
        profile_visibility: settings.profile_visibility,
        messaging_permissions: settings.messaging_permissions,
        activity_visibility: settings.activity_visibility,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating privacy settings:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updatePrivacySettings:", error);
    return false;
  }
};
