
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationGroup, NotificationPreferences, isValidEmailDigestFrequency } from '@/types/notifications';
import { useAuth } from '@/hooks/useAuth';
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
  
  const fetchUserNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchNotifications(user.id);
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserPreferences = async () => {
    if (!user?.id) return;
    
    try {
      setPreferencesLoading(true);
      const prefs = await fetchNotificationPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setPreferencesLoading(false);
    }
  };
  
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
  
  const markAllAsRead = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const success = await markAllNotificationsAsRead(user.id);
      
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
  
  const removeNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const success = await deleteNotification(notificationId);
      
      if (success) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
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
  
  const groupNotificationsByDate = (): NotificationGroup[] => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
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
  
  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user?.id || !preferences) return false;
    
    try {
      if (newPrefs.email_digest_frequency && !isValidEmailDigestFrequency(newPrefs.email_digest_frequency)) {
        throw new Error("Invalid email digest frequency");
      }
      
      const success = await updateNotificationPreferences(user.id, newPrefs);
      
      if (success) {
        setPreferences({
          ...preferences,
          ...newPrefs
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  };
  
  const muteForPeriod = async (hours: number): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const success = await muteNotifications(user.id, hours);
      
      if (success && preferences) {
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
