
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationGroup, NotificationPreferences } from '@/types/notifications';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  updateNotificationPreferences,
  muteNotifications,
  fetchNotificationPreferences
} from '@/api/notifications';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  
  // Fetch notifications
  const fetchUserNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchNotifications();
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch notification preferences
  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      setPreferencesLoading(true);
      const prefs = await fetchNotificationPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setPreferencesLoading(false);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      const success = await markNotificationAsRead(notificationId);
      
      if (success) {
        setNotifications(notifications.map(n => {
          if (n.id === notificationId) {
            return { ...n, is_read: true };
          }
          return n;
        }));
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };
  
  // Mark all as read
  const markAllAsRead = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await markAllNotificationsAsRead();
      
      if (success) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
      
      return success;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };
  
  // Delete a notification
  const removeNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const success = await deleteNotification(notificationId);
      
      if (success) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
        // Update unread count if the deleted notification was unread
        const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
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
  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>): Promise<NotificationPreferences | null> => {
    if (!user || !preferences) return null;
    
    try {
      const updatedPrefs = await updateNotificationPreferences(newPrefs);
      
      if (updatedPrefs) {
        setPreferences(updatedPrefs);
      }
      
      return updatedPrefs;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return null;
    }
  };
  
  // Mute notifications for a period
  const muteForPeriod = async (hours: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await muteNotifications(hours);
      
      if (success && preferences) {
        // Update local preference state with new muted_until value
        const muteUntil = new Date();
        muteUntil.setHours(muteUntil.getHours() + hours);
        
        setPreferences({
          ...preferences,
          muted_until: muteUntil.toISOString()
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error muting notifications:', error);
      return false;
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserNotifications();
      fetchUserPreferences();
    }
  }, [user]);
  
  // Calculate grouped notifications for components to use
  const groupedNotifications = groupNotificationsByDate();
  
  return {
    notifications,
    groupedNotifications,
    unreadCount,
    loading,
    preferencesLoading,
    preferences,
    markAsRead,
    markAllAsRead,
    removeNotification,
    fetchNotifications: fetchUserNotifications,
    groupNotificationsByDate,
    updatePreferences,
    muteForPeriod
  };
};
