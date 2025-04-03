
import { supabase } from "@/integrations/supabase/client";
import { ExtendedProfile, ProfileUpdatePayload, SocialLink, PrivacySettings } from "@/types/profile";
import { toast } from "@/hooks/use-toast";

// Fetch profile with extended details
export const fetchExtendedProfile = async (userId: string, currentUserId?: string): Promise<ExtendedProfile | null> => {
  try {
    // Fetch basic profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);

    if (rolesError) throw rolesError;

    // Fetch social links
    let socialLinks: SocialLink[] = [];
    const { data: socialLinksData, error: socialLinksError } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId);

    if (!socialLinksError && socialLinksData) {
      socialLinks = socialLinksData as SocialLink[];
    }

    // Fetch follower count
    const { data: followerCountData, count: followersCount, error: followersError } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("followed_id", userId);

    // Fetch following count
    const { data: followingCountData, count: followingCount, error: followingError } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("follower_id", userId);

    // Check if current user is following this profile
    let isFollowing = false;
    if (currentUserId) {
      const { data: followData } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUserId)
        .eq("followed_id", userId);
      
      isFollowing = followData && followData.length > 0;
    }

    // Fetch recent activity
    let recentActivity = [];
    const { data: activityData } = await supabase
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (activityData) {
      recentActivity = activityData;
    }

    // Fetch badges
    let badges = [];
    const { data: badgesData } = await supabase
      .from("user_badges")
      .select("*, badges(*)")
      .eq("user_id", userId);

    if (badgesData) {
      badges = badgesData.map((badge: any) => ({
        id: badge.badges?.id || '',
        name: badge.badges?.name || '',
        description: badge.badges?.description || '',
        icon: badge.badges?.icon || '',
        earned_at: badge.earned_at
      }));
    }

    return {
      id: profile.id,
      username: profile.username || '',
      email: profile.email,
      avatar_url: profile.avatar_url,
      full_name: profile.full_name,
      bio: profile.bio,
      xp: profile.xp,
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
      social_links: socialLinks,
      badges: badges,
      professional_details: profile.professional_details,
      portfolio_url: profile.portfolio_url,
      is_following: isFollowing,
      roles: roles || [],
      recent_activity: recentActivity,
      created_at: profile.created_at,
    };
  } catch (error: any) {
    console.error("Error fetching extended profile:", error.message);
    return null;
  }
};

// Update profile information
export const updateProfile = async (userId: string, profileData: ProfileUpdatePayload): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        professional_details: profileData.professional_details,
        portfolio_url: profileData.portfolio_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    
    toast({
      title: "Profile updated successfully",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating profile",
      description: error.message,
    });
    return false;
  }
};

// Follow a user
export const followUser = async (followerId: string, followedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id: followerId,
        followed_id: followedId,
      });

    if (error) throw error;
    
    toast({
      title: "Successfully followed user",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error following user",
      description: error.message,
    });
    return false;
  }
};

// Unfollow a user
export const unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("followed_id", followedId);

    if (error) throw error;
    
    toast({
      title: "Successfully unfollowed user",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error unfollowing user",
      description: error.message,
    });
    return false;
  }
};

// Add a social link
export const addSocialLink = async (userId: string, socialLink: Omit<SocialLink, 'id'>): Promise<SocialLink | null> => {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .insert({
        user_id: userId,
        platform: socialLink.platform,
        url: socialLink.url,
        icon: socialLink.icon,
      })
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Social link added",
    });
    return data as SocialLink;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error adding social link",
      description: error.message,
    });
    return null;
  }
};

// Remove a social link
export const removeSocialLink = async (linkId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", linkId);

    if (error) throw error;
    
    toast({
      title: "Social link removed",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error removing social link",
      description: error.message,
    });
    return false;
  }
};

// Fetch followers
export const fetchFollowers = async (userId: string, page = 1, limit = 20) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("follows")
      .select("follower_id, profiles!follows_follower_id_fkey(*)", { count: 'exact' })
      .eq("followed_id", userId)
      .range(from, to);

    if (error) throw error;

    return {
      followers: data?.map((item: any) => item.profiles) || [],
      total: count || 0,
    };
  } catch (error: any) {
    console.error("Error fetching followers:", error.message);
    return { followers: [], total: 0 };
  }
};

// Fetch following
export const fetchFollowing = async (userId: string, page = 1, limit = 20) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("follows")
      .select("followed_id, profiles!follows_followed_id_fkey(*)", { count: 'exact' })
      .eq("follower_id", userId)
      .range(from, to);

    if (error) throw error;

    return {
      following: data?.map((item: any) => item.profiles) || [],
      total: count || 0,
    };
  } catch (error: any) {
    console.error("Error fetching following:", error.message);
    return { following: [], total: 0 };
  }
};

// Update privacy settings
export const updatePrivacySettings = async (userId: string, settings: PrivacySettings): Promise<boolean> => {
  try {
    // Validate settings before saving
    if (!isValidProfileVisibility(settings.profile_visibility)) {
      throw new Error("Invalid profile visibility value");
    }
    if (!isValidMessagingPermissions(settings.messaging_permissions)) {
      throw new Error("Invalid messaging permissions value");
    }
    if (!isValidActivityVisibility(settings.activity_visibility)) {
      throw new Error("Invalid activity visibility value");
    }

    const { error } = await supabase
      .from("privacy_settings")
      .upsert({
        user_id: userId,
        profile_visibility: settings.profile_visibility,
        messaging_permissions: settings.messaging_permissions,
        activity_visibility: settings.activity_visibility,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    
    toast({
      title: "Privacy settings updated",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating privacy settings",
      description: error.message,
    });
    return false;
  }
};

// Fetch privacy settings
export const fetchPrivacySettings = async (userId: string): Promise<PrivacySettings | null> => {
  try {
    const { data, error } = await supabase
      .from("privacy_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'
    
    if (!data) {
      // Create default settings if none exist
      const defaultSettings: PrivacySettings = {
        profile_visibility: 'public',
        messaging_permissions: 'everyone',
        activity_visibility: 'public'
      };
      
      await updatePrivacySettings(userId, defaultSettings);
      return defaultSettings;
    }
    
    // Validate and sanitize the data
    const settings: PrivacySettings = {
      profile_visibility: isValidProfileVisibility(data.profile_visibility) 
        ? data.profile_visibility 
        : 'public',
      messaging_permissions: isValidMessagingPermissions(data.messaging_permissions) 
        ? data.messaging_permissions 
        : 'everyone',
      activity_visibility: isValidActivityVisibility(data.activity_visibility) 
        ? data.activity_visibility 
        : 'public'
    };
    
    return settings;
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return null;
  }
};
