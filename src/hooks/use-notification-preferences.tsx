
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationPreferences, EmailDigestFrequency } from '@/types/notifications';
import { 
  fetchNotificationPreferences, 
  updateNotificationPreferences,
  muteNotifications
} from '@/api/notifications';

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default preferences for new state creation
  const defaultPreferences: Omit<NotificationPreferences, 'id' | 'user_id' | 'updated_at'> = {
    email_enabled: true,
    push_enabled: true,
    email_digest_frequency: 'daily',
    muted_until: null,
    new_follower: true,
    new_message: true,
    mentorship_booking: true,
    mentorship_cancellation: true,
    mentorship_reminder: true,
    pitch_vote: true,
    pitch_comment: true,
    pitch_feedback: true,
    level_up: true,
    badge_unlock: true,
    leaderboard_shift: true,
    launchpad_comment: true,
    launchpad_reaction: true,
    launchpad_repost: true,
  };

  // Fetch current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotificationPreferences();
        setPreferences(data);
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadPreferences();
    }
  }, [user]);

  // Save preferences
  const savePreferences = async (newPrefs?: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user) return false;
    
    const prefsToSave = newPrefs || preferences;
    if (!prefsToSave) return false;
    
    setIsSaving(true);
    
    try {
      const result = await updateNotificationPreferences(prefsToSave);
      if (result) {
        setPreferences(result);
        return true;
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update individual preference
  const updatePreference = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
    if (!preferences) return;
    
    setPreferences(prev => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };

  // Mute notifications temporarily
  const muteForHours = async (hours: number | null): Promise<boolean> => {
    if (!user || !preferences) return false;
    
    if (hours === null) {
      // Clear muting
      return savePreferences({ muted_until: null });
    }
    
    try {
      setIsSaving(true);
      const success = await muteNotifications(hours);
      
      if (success) {
        // Update local state
        const muteUntil = new Date();
        muteUntil.setHours(muteUntil.getHours() + hours);
        
        setPreferences(prev => {
          if (!prev) return null;
          return { ...prev, muted_until: muteUntil.toISOString() };
        });
      }
      
      return success;
    } finally {
      setIsSaving(false);
    }
  };

  // Check if notifications are currently muted
  const isMuted = (): boolean => {
    if (!preferences?.muted_until) return false;
    
    try {
      const muteUntil = new Date(preferences.muted_until);
      return muteUntil > new Date();
    } catch (e) {
      return false;
    }
  };

  // Get remaining mute time in hours
  const getMuteRemainingHours = (): number => {
    if (!preferences?.muted_until) return 0;
    
    try {
      const muteUntil = new Date(preferences.muted_until);
      const now = new Date();
      
      if (muteUntil <= now) return 0;
      
      const diffMs = muteUntil.getTime() - now.getTime();
      return Math.ceil(diffMs / (1000 * 60 * 60));
    } catch (e) {
      return 0;
    }
  };

  return {
    preferences,
    setPreferences,
    isLoading,
    isSaving,
    savePreferences,
    updatePreference,
    muteForHours,
    isMuted,
    getMuteRemainingHours,
    defaultPreferences
  };
};
