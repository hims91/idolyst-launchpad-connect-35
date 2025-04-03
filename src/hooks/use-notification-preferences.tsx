
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  NotificationPreferences, 
  EmailDigestFrequency,
  isValidEmailDigestFrequency
} from '@/types/notifications';
import { 
  fetchNotificationPreferences, 
  updateNotificationPreferences 
} from '@/api/notifications';
import { toast } from '@/hooks/use-toast';

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notification preferences
  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await fetchNotificationPreferences(user.id);
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load your notification preferences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load preferences on mount or when user changes
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Update notification preferences
  const savePreferences = async (newPrefs?: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user?.id || !preferences) return false;
    
    const prefsToSave = newPrefs || preferences;
    setIsSaving(true);
    
    try {
      const success = await updateNotificationPreferences(user.id, prefsToSave);
      if (success) {
        if (newPrefs) {
          setPreferences(prev => prev ? { ...prev, ...newPrefs } : null);
        }
        toast({
          title: "Success",
          description: "Your notification preferences have been saved"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save your notification preferences",
          variant: "destructive"
        });
      }
      return success;
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update individual preference
  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K, 
    value: NotificationPreferences[K]
  ) => {
    if (!preferences) return;
    
    // Special validation for email digest frequency
    if (key === 'email_digest_frequency' && typeof value === 'string') {
      if (!isValidEmailDigestFrequency(value as string)) {
        return;
      }
    }
    
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);
  };

  return {
    preferences,
    isLoading,
    isSaving,
    savePreferences,
    updatePreference,
    refreshPreferences: loadPreferences
  };
};
