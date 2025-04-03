
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PrivacySettings } from '@/types/profile';
import { fetchPrivacySettings, updatePrivacySettings } from '@/api/profile';
import { toast } from '@/hooks/use-toast';

export const usePrivacySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    messaging_permissions: 'everyone',
    activity_visibility: 'public',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current privacy settings
  const loadPrivacySettings = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await fetchPrivacySettings(user.id);
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to load your privacy settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load settings on mount or when user changes
  useEffect(() => {
    loadPrivacySettings();
  }, [loadPrivacySettings]);

  // Update privacy settings
  const saveSettings = async (newSettings?: PrivacySettings): Promise<boolean> => {
    if (!user?.id) return false;
    
    const settingsToSave = newSettings || settings;
    setIsSaving(true);
    
    try {
      const success = await updatePrivacySettings(user.id, settingsToSave);
      if (success) {
        if (newSettings) {
          setSettings(newSettings);
        }
        toast({
          title: "Success",
          description: "Your privacy settings have been saved"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save your privacy settings",
          variant: "destructive"
        });
      }
      return success;
    } catch (error) {
      console.error('Error saving privacy settings:', error);
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

  // Update individual setting
  const updateSetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    setSettings,
    isLoading,
    isSaving,
    saveSettings,
    updateSetting,
    refreshSettings: loadPrivacySettings
  };
};
