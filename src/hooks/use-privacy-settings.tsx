
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PrivacySettings } from '@/types/profile';
import { fetchPrivacySettings, updatePrivacySettings } from '@/api/profile';

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
  useEffect(() => {
    const loadPrivacySettings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchPrivacySettings(user.id);
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrivacySettings();
  }, [user]);

  // Update privacy settings
  const saveSettings = async (newSettings?: PrivacySettings): Promise<boolean> => {
    if (!user?.id) return false;
    
    const settingsToSave = newSettings || settings;
    setIsSaving(true);
    
    try {
      const success = await updatePrivacySettings(user.id, settingsToSave);
      if (success && newSettings) {
        setSettings(newSettings);
      }
      return success;
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
    updateSetting
  };
};
