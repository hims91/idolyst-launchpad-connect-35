
import { supabase } from "@/integrations/supabase/client";
import { 
  Notification, 
  NotificationType, 
  NotificationPreferences,
  EmailDigestFrequency,
  isValidEmailDigestFrequency
} from "@/types/notifications";

/**
 * Fetches a user's notifications
 * @param userId The user ID to fetch notifications for
 * @param limit The maximum number of notifications to fetch
 * @param offset Pagination offset
 * @returns Array of notifications
 */
export const fetchNotifications = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Notification[]> => {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data as Notification[];
  } catch (error) {
    console.error("Error in fetchNotifications:", error);
    return [];
  }
};

/**
 * Marks a notification as read
 * @param notificationId The notification ID to mark as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
};

/**
 * Marks all notifications for a user as read
 * @param userId The user ID to mark all notifications as read for
 */
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<boolean> => {
  try {
    if (!userId) return false;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    return false;
  }
};

/**
 * Fetches notification preferences for a user
 * @param userId The user ID to fetch preferences for
 * @returns The notification preferences
 */
export const fetchNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences | null> => {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching notification preferences:", error);
      return null;
    }

    // Convert email_digest_frequency to proper type
    if (data.email_digest_frequency && !isValidEmailDigestFrequency(data.email_digest_frequency)) {
      data.email_digest_frequency = 'daily' as EmailDigestFrequency;
    }

    return data as NotificationPreferences;
  } catch (error) {
    console.error("Error in fetchNotificationPreferences:", error);
    return null;
  }
};

/**
 * Updates notification preferences for a user
 * @param userId The user ID to update preferences for
 * @param preferences The new notification preferences
 * @returns Boolean indicating success
 */
export const updateNotificationPreferences = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<boolean> => {
  try {
    if (!userId) return false;

    // Validate email digest frequency
    if (
      preferences.email_digest_frequency && 
      !isValidEmailDigestFrequency(preferences.email_digest_frequency)
    ) {
      return false;
    }

    const { error } = await supabase
      .from("notification_preferences")
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating notification preferences:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateNotificationPreferences:", error);
    return false;
  }
};

/**
 * Mutes notifications for a specified duration
 * @param userId The user ID to mute notifications for
 * @param hours Number of hours to mute notifications for
 * @returns Boolean indicating success
 */
export const muteNotifications = async (
  userId: string,
  hours: number
): Promise<boolean> => {
  try {
    if (!userId || hours <= 0) return false;

    const muteUntil = new Date();
    muteUntil.setHours(muteUntil.getHours() + hours);

    const { error } = await supabase
      .from("notification_preferences")
      .update({
        muted_until: muteUntil.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error muting notifications:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in muteNotifications:", error);
    return false;
  }
};

/**
 * Unmutes notifications
 * @param userId The user ID to unmute notifications for
 * @returns Boolean indicating success
 */
export const unmuteNotifications = async (
  userId: string
): Promise<boolean> => {
  try {
    if (!userId) return false;

    const { error } = await supabase
      .from("notification_preferences")
      .update({
        muted_until: null,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error unmuting notifications:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in unmuteNotifications:", error);
    return false;
  }
};
