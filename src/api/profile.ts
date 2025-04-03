import { supabase } from "@/integrations/supabase/client";
import { ProfileUpdatePayload, PrivacySettings, isValidProfileVisibility, isValidMessagingPermissions, isValidActivityVisibility, ExtendedProfile, ProfileActivity } from "@/types/profile";

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

/**
 * Fetches an extended profile with additional data like roles, badges, etc.
 * @param userId The user ID to fetch
 * @param currentUserId Optional current user ID to check if following
 * @returns The extended profile data
 */
export const fetchExtendedProfile = async (
  userId: string,
  currentUserId?: string
): Promise<ExtendedProfile | null> => {
  try {
    // Fetch basic profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Fetch user roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    }

    // Fetch followers count
    const { count: followersCount, error: followersError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followed_id", userId);

    if (followersError) {
      console.error("Error fetching followers count:", followersError);
    }

    // Fetch following count
    const { count: followingCount, error: followingError } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    if (followingError) {
      console.error("Error fetching following count:", followingError);
    }

    // Check if current user is following this profile
    let isFollowing = false;
    if (currentUserId) {
      const { data: followData, error: followError } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUserId)
        .eq("followed_id", userId)
        .single();

      if (!followError && followData) {
        isFollowing = true;
      }
    }

    // Fetch recent activity (simplified)
    // Instead of actual data, create sample activities for now
    const activities: ProfileActivity[] = [
      {
        id: "1",
        type: "post",
        title: "Created a new post",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        type: "pitch",
        title: "Launched a new pitch",
        created_at: new Date(Date.now() - 172800000).toISOString(),
      }
    ];

    // Construct extended profile
    const extendedProfile: ExtendedProfile = {
      ...profile,
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
      is_following: isFollowing,
      roles: roles || [],
      badges: [], // Placeholder - implement badge fetching if needed
      social_links: [], // Placeholder - implement social links fetching if needed
      recent_activity: activities || [],
      xp: profile.xp || 0
    };

    return extendedProfile;
  } catch (error) {
    console.error("Error in fetchExtendedProfile:", error);
    return null;
  }
};

/**
 * Follows a user
 * @param followerId The ID of the user who is following
 * @param followedId The ID of the user to be followed
 * @returns Boolean indicating success
 */
export const followUser = async (followerId: string, followedId: string): Promise<boolean> => {
  try {
    if (!followerId || !followedId || followerId === followedId) {
      return false;
    }

    // Check if already following
    const { data: existingFollow, error: checkError } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", followerId)
      .eq("followed_id", followedId)
      .single();

    if (!checkError && existingFollow) {
      // Already following
      return true;
    }

    // Create follow relationship
    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id: followerId,
        followed_id: followedId,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error following user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in followUser:", error);
    return false;
  }
};

/**
 * Unfollows a user
 * @param followerId The ID of the user who is unfollowing
 * @param followedId The ID of the user to be unfollowed
 * @returns Boolean indicating success
 */
export const unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
  try {
    if (!followerId || !followedId) {
      return false;
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("followed_id", followedId);

    if (error) {
      console.error("Error unfollowing user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    return false;
  }
};

/**
 * Fetches a user's followers
 * @param userId The user ID to fetch followers for
 * @returns Object containing array of followers and total count
 */
export const fetchFollowers = async (userId: string) => {
  try {
    // First get the follower IDs
    const { data: followData, error: followError } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("followed_id", userId);

    if (followError) {
      console.error("Error fetching followers:", followError);
      return { followers: [], count: 0 };
    }

    if (!followData || followData.length === 0) {
      return { followers: [], count: 0 };
    }

    // Extract follower IDs
    const followerIds = followData.map(item => item.follower_id);

    // Then fetch the profiles of those followers
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", followerIds);

    if (profilesError) {
      console.error("Error fetching follower profiles:", profilesError);
      return { followers: [], count: 0 };
    }

    return { followers: profiles || [], count: profiles.length };
  } catch (error) {
    console.error("Error in fetchFollowers:", error);
    return { followers: [], count: 0 };
  }
};

/**
 * Fetches users that a user is following
 * @param userId The user ID to fetch following for
 * @returns Object containing array of followed users and total count
 */
export const fetchFollowing = async (userId: string) => {
  try {
    // First get the following IDs
    const { data: followData, error: followError } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", userId);

    if (followError) {
      console.error("Error fetching following:", followError);
      return { following: [], count: 0 };
    }

    if (!followData || followData.length === 0) {
      return { following: [], count: 0 };
    }

    // Extract following IDs
    const followingIds = followData.map(item => item.followed_id);

    // Then fetch the profiles of those being followed
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", followingIds);

    if (profilesError) {
      console.error("Error fetching following profiles:", profilesError);
      return { following: [], count: 0 };
    }

    return { following: profiles || [], count: profiles.length };
  } catch (error) {
    console.error("Error in fetchFollowing:", error);
    return { following: [], count: 0 };
  }
};
