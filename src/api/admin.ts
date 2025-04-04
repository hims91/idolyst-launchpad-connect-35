
import { supabase } from "@/integrations/supabase/client";
import { AdminSetting, ModerationItem, SystemLog } from "@/types/admin";

/**
 * Checks if the current user has admin privileges
 * @returns Boolean indicating if user is admin
 */
export const checkAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) return false;

    // Check if user has admin role directly from user_roles table
    // Use type assertion to fix the TypeScript error
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("role", "admin" as any);

    if (rolesError) {
      console.error("Error checking admin status:", rolesError);
      return false;
    }

    return userRoles && userRoles.length > 0;
  } catch (error) {
    console.error("Error in checkAdminAccess:", error);
    return false;
  }
};

/**
 * Fetches admin settings from the database
 * @param key Optional specific setting key to fetch
 * @returns Admin settings
 */
export const fetchAdminSettings = async (key?: string): Promise<AdminSetting[]> => {
  try {
    let query = supabase.from("admin_settings").select("*");
    
    if (key) {
      query = query.eq("setting_key", key);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching admin settings:", error);
      return [];
    }

    return data as AdminSetting[] || [];
  } catch (error) {
    console.error("Error in fetchAdminSettings:", error);
    return [];
  }
};

/**
 * Updates an admin setting
 * @param key Setting key to update
 * @param value New setting value
 * @returns Boolean indicating success
 */
export const updateAdminSetting = async (key: string, value: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("admin_settings")
      .update({
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .eq("setting_key", key);

    if (error) {
      console.error("Error updating admin setting:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateAdminSetting:", error);
    return false;
  }
};

/**
 * Fetches items in the moderation queue
 * @param status Optional status filter
 * @param contentType Optional content type filter
 * @returns Array of moderation items
 */
export const fetchModerationQueue = async (status?: string, contentType?: string): Promise<ModerationItem[]> => {
  try {
    let query = supabase
      .from("moderation_queue")
      .select(`
        *,
        reported_by:profiles!reported_by(username, full_name, avatar_url),
        moderator:profiles!moderator_id(username, full_name, avatar_url)
      `)
      .order("created_at", { ascending: false });
    
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    
    if (contentType && contentType !== "all") {
      query = query.eq("content_type", contentType);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching moderation queue:", error);
      return [];
    }

    return data as unknown as ModerationItem[] || [];
  } catch (error) {
    console.error("Error in fetchModerationQueue:", error);
    return [];
  }
};

/**
 * Updates the status of a moderation item
 * @param itemId The ID of the moderation item
 * @param status The new status ('pending', 'approved', 'rejected')
 * @param notes Optional moderator notes
 * @returns Boolean indicating success
 */
export const updateModerationStatus = async (
  itemId: string, 
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) return false;

    const { error } = await supabase
      .from("moderation_queue")
      .update({
        status,
        moderator_id: user.user.id,
        moderator_notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating moderation status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateModerationStatus:", error);
    return false;
  }
};

/**
 * Reports content for moderation
 * @param contentType Type of content ('post', 'pitch', 'comment', etc.)
 * @param contentId ID of the content
 * @param reason Reason for reporting
 * @returns Boolean indicating success
 */
export const reportContent = async (
  contentType: string,
  contentId: string,
  reason: string
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) return false;

    const { error } = await supabase
      .from("moderation_queue")
      .insert({
        content_type: contentType,
        content_id: contentId,
        reported_by: user.user.id,
        reason: reason,
        status: 'pending'
      });

    if (error) {
      console.error("Error reporting content:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in reportContent:", error);
    return false;
  }
};

/**
 * Logs a system event
 * @param logType Type of log ('error', 'warning', 'info')
 * @param component Component generating the log
 * @param message Log message
 * @param metadata Optional metadata
 * @returns Boolean indicating success
 */
export const logSystemEvent = async (
  logType: 'error' | 'warning' | 'info',
  component: string,
  message: string,
  metadata?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("system_logs")
      .insert({
        log_type: logType,
        component,
        message,
        metadata: metadata || null
      });

    if (error) {
      console.error("Error logging system event:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in logSystemEvent:", error);
    return false;
  }
};

/**
 * Fetches system logs
 * @param logType Optional type filter
 * @param component Optional component filter
 * @param limit Maximum number of logs to fetch
 * @returns Array of system logs
 */
export const fetchSystemLogs = async (
  logType?: string,
  component?: string,
  limit: number = 100
): Promise<SystemLog[]> => {
  try {
    let query = supabase
      .from("system_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (logType && logType !== "all") {
      query = query.eq("log_type", logType);
    }
    
    if (component) {
      query = query.eq("component", component);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching system logs:", error);
      return [];
    }

    return data as unknown as SystemLog[] || [];
  } catch (error) {
    console.error("Error in fetchSystemLogs:", error);
    return [];
  }
};

/**
 * Adds a role to a user
 * @param userId User ID to add role to
 * @param role Role to add
 * @param isVerified Whether the role should be marked as verified
 * @returns Boolean indicating success
 */
export const addUserRole = async (
  userId: string,
  role: 'entrepreneur' | 'mentor' | 'admin',
  isVerified: boolean = role === 'admin' // Admin roles are automatically verified
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: role as any,
        is_verified: isVerified
      });

    if (error) {
      console.error("Error adding role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addUserRole:", error);
    return false;
  }
};

/**
 * Removes a role from a user
 * @param roleId The ID of the role entry to remove
 * @returns Boolean indicating success
 */
export const removeUserRole = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      console.error("Error removing role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeUserRole:", error);
    return false;
  }
};
