
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to sync settings changes in real-time across devices
 * @param onPrivacyUpdate Callback to run when privacy settings are updated
 * @param onNotificationUpdate Callback to run when notification settings are updated
 */
export const useSettingsSync = (
  onPrivacyUpdate?: () => void, 
  onNotificationUpdate?: () => void
) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Create privacy settings channel
    const privacyChannel = supabase
      .channel('privacy-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'privacy_settings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Don't reload if the update was triggered by this client
          if (payload.new.updated_at === payload.old.updated_at) return;
          
          console.log('Privacy settings updated from another device');
          toast({
            title: "Privacy settings updated",
            description: "Your privacy settings were updated from another device."
          });
          
          if (onPrivacyUpdate) {
            onPrivacyUpdate();
          }
        }
      )
      .subscribe();
      
    // Create notification preferences channel  
    const notificationChannel = supabase
      .channel('notification-preferences-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification_preferences',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Don't reload if the update was triggered by this client
          if (payload.new.updated_at === payload.old.updated_at) return;
          
          console.log('Notification preferences updated from another device');
          toast({
            title: "Notification settings updated",
            description: "Your notification settings were updated from another device."
          });
          
          if (onNotificationUpdate) {
            onNotificationUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(privacyChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, [user, onPrivacyUpdate, onNotificationUpdate]);
};
