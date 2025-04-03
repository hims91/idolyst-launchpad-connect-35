
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Eye, MessageSquare, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrivacySettings } from '@/types/profile';

export const PrivacySettingsComponent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    messaging_permissions: 'everyone',
    activity_visibility: 'public',
  });

  // Fetch current privacy settings
  const fetchPrivacySettings = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSettings({
          profile_visibility: data.profile_visibility,
          messaging_permissions: data.messaging_permissions,
          activity_visibility: data.activity_visibility,
        });
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  // Save privacy settings
  const savePrivacySettings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          profile_visibility: settings.profile_visibility,
          messaging_permissions: settings.messaging_permissions,
          activity_visibility: settings.activity_visibility,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating privacy settings",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold gradient-text mb-4">Privacy Settings</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Control your privacy settings and what information is visible to others.
      </p>
      
      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-semibold">Profile Visibility</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control who can see your profile information.
          </p>
          <RadioGroup
            value={settings.profile_visibility}
            onValueChange={(value: "public" | "followers" | "private") => 
              setSettings(prev => ({ ...prev, profile_visibility: value }))
            }
            className="mt-2 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="profile-public" />
              <Label htmlFor="profile-public">Public (Everyone can see your profile)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="profile-followers" />
              <Label htmlFor="profile-followers">Followers Only (Only followers can see your full profile)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="profile-private" />
              <Label htmlFor="profile-private">Private (Only you can see your profile details)</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Messaging Permissions */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-semibold">Messaging Permissions</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control who can send you messages.
          </p>
          <RadioGroup
            value={settings.messaging_permissions}
            onValueChange={(value: "everyone" | "followers" | "none") => 
              setSettings(prev => ({ ...prev, messaging_permissions: value }))
            }
            className="mt-2 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="everyone" id="msg-everyone" />
              <Label htmlFor="msg-everyone">Everyone (Anyone can message you)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="msg-followers" />
              <Label htmlFor="msg-followers">Followers Only (Only people you follow can message you)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="msg-none" />
              <Label htmlFor="msg-none">No One (Disable incoming messages)</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Activity Visibility */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-semibold">Activity Visibility</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control who can see your activity feed.
          </p>
          <RadioGroup
            value={settings.activity_visibility}
            onValueChange={(value: "public" | "followers" | "private") => 
              setSettings(prev => ({ ...prev, activity_visibility: value }))
            }
            className="mt-2 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="activity-public" />
              <Label htmlFor="activity-public">Public (Everyone can see your activity)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="activity-followers" />
              <Label htmlFor="activity-followers">Followers Only (Only followers can see your activity)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="activity-private" />
              <Label htmlFor="activity-private">Private (Only you can see your activity)</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Account Protection */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-semibold">Account Protection</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch id="two-factor" disabled aria-label="Enable two-factor authentication" />
          </div>
          <p className="text-xs text-amber-500">Coming soon</p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={savePrivacySettings} 
            disabled={isLoading} 
            className="gradient-bg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : "Save Privacy Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};
