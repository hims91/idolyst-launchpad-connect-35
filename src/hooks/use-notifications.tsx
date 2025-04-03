
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationGroup, NotificationPreferences } from "@/types/notifications";
import { 
  fetchNotifications, 
  fetchUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  muteNotifications
} from "@/api/notifications";
import { format, isToday, isYesterday, parseISO } from "date-fns";

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  
  // Fetch notifications
  const getNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      
      // Count unread
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  // Fetch preferences
  const getPreferences = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setPreferencesLoading(true);
    try {
      const data = await fetchNotificationPreferences();
      setPreferences(data);
    } catch (err) {
      console.error("Error fetching notification preferences:", err);
    } finally {
      setPreferencesLoading(false);
    }
  }, [isAuthenticated]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  }, []);
  
  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  }, []);
  
  // Delete notification
  const removeNotification = useCallback(async (notificationId: string) => {
    const success = await deleteNotification(notificationId);
    if (success) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
    return success;
  }, [notifications]);
  
  // Update preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    const updated = await updateNotificationPreferences(newPreferences);
    if (updated) {
      setPreferences(updated);
    }
    return updated;
  }, []);
  
  // Mute for period
  const muteForPeriod = useCallback(async (hours: number) => {
    const success = await muteNotifications(hours);
    if (success && preferences) {
      const muteUntil = new Date();
      muteUntil.setHours(muteUntil.getHours() + hours);
      setPreferences({
        ...preferences,
        muted_until: muteUntil.toISOString()
      });
    }
    return success;
  }, [preferences]);

  // Group notifications by date
  const groupedNotifications = useCallback((): NotificationGroup[] => {
    const groups: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = parseISO(notification.created_at);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = 'today';
      } else if (isYesterday(date)) {
        groupKey = 'yesterday';
      } else {
        groupKey = format(date, 'yyyy-MM-dd');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(notification);
    });
    
    // Sort groups by date (most recent first)
    return Object.entries(groups)
      .map(([key, notifs]) => {
        let title: string;
        switch (key) {
          case 'today':
            title = 'Today';
            break;
          case 'yesterday':
            title = 'Yesterday';
            break;
          default:
            title = format(parseISO(key), 'MMMM d, yyyy');
        }
        
        return {
          date: key,
          title,
          notifications: notifs
        };
      })
      .sort((a, b) => {
        if (a.date === 'today') return -1;
        if (b.date === 'today') return 1;
        if (a.date === 'yesterday') return -1;
        if (b.date === 'yesterday') return 1;
        return a.date > b.date ? -1 : 1;
      });
  }, [notifications]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      getNotifications();
      getPreferences();
    }
  }, [isAuthenticated, getNotifications, getPreferences]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(res => res.data.user?.id)}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  return {
    notifications,
    groupedNotifications: groupedNotifications(),
    unreadCount,
    loading,
    error,
    preferences,
    preferencesLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updatePreferences,
    muteForPeriod,
    refreshNotifications: getNotifications,
    refreshPreferences: getPreferences
  };
};
