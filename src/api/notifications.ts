
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationPreferences, NotificationType } from "@/types/notifications";
import { toast } from "@/hooks/use-toast";

// Fetch all notifications for the current user
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Notification[];
  } catch (error: any) {
    console.error("Error fetching notifications:", error.message);
    return [];
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error marking notification as read:", error.message);
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.user.id)
      .is("is_read", false);

    if (error) throw error;
    
    toast({
      title: "All notifications marked as read",
    });
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error marking notifications as read",
      description: error.message,
    });
    return false;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error deleting notification:", error.message);
    return false;
  }
};

// Fetch the count of unread notifications
export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) throw error;
    return count || 0;
  } catch (error: any) {
    console.error("Error fetching unread notifications count:", error.message);
    return 0;
  }
};

// Fetch notification preferences
export const fetchNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'
    
    // If preferences don't exist, create default ones
    if (!data) {
      return createDefaultPreferences(user.user.id);
    }
    
    return data as NotificationPreferences;
  } catch (error: any) {
    console.error("Error fetching notification preferences:", error.message);
    return null;
  }
};

// Create default notification preferences if not exist
const createDefaultPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from("notification_preferences")
      .insert({
        user_id: userId,
        // Default values will be used from schema defaults
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as NotificationPreferences;
  } catch (error: any) {
    console.error("Error creating default preferences:", error.message);
    return null;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    // Check if preferences exist
    const { data: existing } = await supabase
      .from("notification_preferences")
      .select("id")
      .eq("user_id", user.user.id)
      .single();
    
    let result;
    
    if (!existing) {
      // Insert new preferences with user_id
      const { data, error } = await supabase
        .from("notification_preferences")
        .insert({ ...preferences, user_id: user.user.id })
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Update existing preferences
      const { data, error } = await supabase
        .from("notification_preferences")
        .update(preferences)
        .eq("user_id", user.user.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    toast({
      title: "Notification preferences updated",
    });
    
    return result as NotificationPreferences;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating notification preferences",
      description: error.message,
    });
    return null;
  }
};

// Mute notifications for a specified period
export const muteNotifications = async (hours: number): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const muteUntil = new Date();
    muteUntil.setHours(muteUntil.getHours() + hours);
    
    const { error } = await supabase
      .from("notification_preferences")
      .update({ muted_until: muteUntil.toISOString() })
      .eq("user_id", user.user.id);

    if (error) throw error;
    
    toast({
      title: `Notifications muted for ${hours} hour${hours === 1 ? '' : 's'}`,
    });
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error muting notifications",
      description: error.message,
    });
    return false;
  }
};

// Create a notification (typically would be done server-side, but included for completeness)
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  content: string,
  relatedId?: string,
  relatedType?: string,
  actionUrl?: string
): Promise<Notification | null> => {
  try {
    // We need to cast the type to any to bypass the TypeScript error
    // until the Supabase types are regenerated
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: type as any, // Cast to bypass TypeScript error
        title,
        content,
        related_id: relatedId,
        related_type: relatedType,
        action_url: actionUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  } catch (error: any) {
    console.error("Error creating notification:", error.message);
    return null;
  }
};
