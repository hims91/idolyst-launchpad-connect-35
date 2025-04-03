
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationGroup, NotificationPreferences } from '@/types/notifications';
import { useAuth } from '@/providers/AuthProvider';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  
  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch notification preferences
  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      // First check if preferences exist
      const { data: existingPrefs, error: checkError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking notification preferences:', checkError);
        return;
      }
      
      // If no preferences exist, create default ones
      if (!existingPrefs) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            // Default values will be used from the schema
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating notification preferences:', insertError);
          return;
        }
        
        setPreferences(newPrefs);
      } else {
        setPreferences(existingPrefs);
      }
    } catch (error) {
      console.error('Error managing notification preferences:', error);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      setNotifications(notifications.map(n => {
        if (n.id === notificationId) {
          return { ...n, is_read: true };
        }
        return n;
      }));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Group notifications by date
  const groupNotificationsByDate = (): NotificationGroup[] => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Today's notifications
    const todayNotifications = notifications.filter(n => {
      const date = new Date(n.created_at);
      return date.toDateString() === today.toDateString();
    });
    
    if (todayNotifications.length > 0) {
      groups.push({
        date: today.toISOString(),
        title: 'Today',
        notifications: todayNotifications
      });
    }
    
    // Yesterday's notifications
    const yesterdayNotifications = notifications.filter(n => {
      const date = new Date(n.created_at);
      return date.toDateString() === yesterday.toDateString();
    });
    
    if (yesterdayNotifications.length > 0) {
      groups.push({
        date: yesterday.toISOString(),
        title: 'Yesterday',
        notifications: yesterdayNotifications
      });
    }
    
    // Earlier notifications
    const earlierNotifications = notifications.filter(n => {
      const date = new Date(n.created_at);
      return date.toDateString() !== today.toDateString() && 
             date.toDateString() !== yesterday.toDateString();
    });
    
    if (earlierNotifications.length > 0) {
      groups.push({
        date: 'earlier',
        title: 'Earlier',
        notifications: earlierNotifications
      });
    }
    
    return groups;
  };
  
  // Update notification preferences
  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(newPrefs)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPreferences(data);
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return null;
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user]);
  
  return {
    notifications,
    unreadCount,
    loading,
    preferences,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    groupNotificationsByDate,
    updatePreferences
  };
};
