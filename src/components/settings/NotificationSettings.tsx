
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationSettingItem } from "@/components/notifications/NotificationSettingItem";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Info } from "lucide-react";
import { fadeIn } from "@/lib/animations";

export function NotificationSettings() {
  const { 
    preferences, 
    preferencesLoading, 
    updatePreferences,
    muteForPeriod
  } = useNotifications();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [localPrefs, setLocalPrefs] = useState({
    push_enabled: true,
    email_enabled: true,
    email_digest_frequency: "daily",
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
    launchpad_repost: true
  });
  
  // Initialize local state from fetched preferences
  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        push_enabled: preferences.push_enabled,
        email_enabled: preferences.email_enabled,
        email_digest_frequency: preferences.email_digest_frequency,
        new_follower: preferences.new_follower ?? true,
        new_message: preferences.new_message ?? true,
        mentorship_booking: preferences.mentorship_booking ?? true,
        mentorship_cancellation: preferences.mentorship_cancellation ?? true,
        mentorship_reminder: preferences.mentorship_reminder ?? true,
        pitch_vote: preferences.pitch_vote ?? true,
        pitch_comment: preferences.pitch_comment ?? true,
        pitch_feedback: preferences.pitch_feedback ?? true,
        level_up: preferences.level_up ?? true,
        badge_unlock: preferences.badge_unlock ?? true,
        leaderboard_shift: preferences.leaderboard_shift ?? true,
        launchpad_comment: preferences.launchpad_comment ?? true,
        launchpad_reaction: preferences.launchpad_reaction ?? true,
        launchpad_repost: preferences.launchpad_repost ?? true
      });
    }
  }, [preferences]);

  const handleUpdatePreferences = async () => {
    setIsUpdating(true);
    await updatePreferences(localPrefs);
    setIsUpdating(false);
  };
  
  const handleToggleType = (type: string, value: boolean) => {
    setLocalPrefs(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Fixed this function to properly handle string value from Select component
  const handleEmailDigestChange = (value: string) => {
    setLocalPrefs(prev => ({
      ...prev,
      email_digest_frequency: value
    }));
  };
  
  const handleMuteNotifications = async (hours: number) => {
    await muteForPeriod(hours);
  };
  
  const isMuted = preferences?.muted_until && new Date(preferences.muted_until) > new Date();
  
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div>
        <h2 className="text-xl font-bold gradient-text mb-4">Notification Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Manage how and when you receive notifications from Idolyst.
        </p>
      </div>
      
      {isMuted && (
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Notifications are muted</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Your notifications are muted until{" "}
            {new Date(preferences!.muted_until!).toLocaleString()}. You won't receive any push notifications during this time.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delivery Methods</h3>
        
        {preferencesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                checked={localPrefs.push_enabled}
                onCheckedChange={(checked) => handleToggleType('push_enabled', checked)}
                className="data-[state=checked]:bg-idolyst-purple"
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications and digests
                </p>
              </div>
              <Switch
                checked={localPrefs.email_enabled}
                onCheckedChange={(checked) => handleToggleType('email_enabled', checked)}
                className="data-[state=checked]:bg-idolyst-purple"
              />
            </div>
            
            {localPrefs.email_enabled && (
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Email Digest Frequency</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    How often you want to receive email digests
                  </p>
                </div>
                <Select
                  value={localPrefs.email_digest_frequency}
                  onValueChange={handleEmailDigestChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="py-3 space-y-2">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Mute Notifications</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Temporarily mute all notifications for a specific period
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMuteNotifications(1)}
                  className="transition-transform hover:scale-105"
                >
                  1 hour
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMuteNotifications(4)}
                  className="transition-transform hover:scale-105"
                >
                  4 hours
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMuteNotifications(24)}
                  className="transition-transform hover:scale-105"
                >
                  24 hours
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Types</h3>
        
        {preferencesLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 py-4 border-b border-gray-200 dark:border-gray-700">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-1 mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Social</h4>
              
              <NotificationSettingItem
                type="new_follower"
                label="New Followers"
                description="When someone follows you"
                enabled={localPrefs.new_follower}
                onToggle={(checked) => handleToggleType('new_follower', checked)}
              />
              
              <NotificationSettingItem
                type="new_message"
                label="Messages"
                description="When you receive a new message"
                enabled={localPrefs.new_message}
                onToggle={(checked) => handleToggleType('new_message', checked)}
              />
            </div>
            
            <div className="space-y-1 mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mentorship</h4>
              
              <NotificationSettingItem
                type="mentorship_booking"
                label="Bookings"
                description="When someone books a mentorship session with you"
                enabled={localPrefs.mentorship_booking}
                onToggle={(checked) => handleToggleType('mentorship_booking', checked)}
              />
              
              <NotificationSettingItem
                type="mentorship_cancellation"
                label="Cancellations"
                description="When a mentorship session is cancelled"
                enabled={localPrefs.mentorship_cancellation}
                onToggle={(checked) => handleToggleType('mentorship_cancellation', checked)}
              />
              
              <NotificationSettingItem
                type="mentorship_reminder"
                label="Reminders"
                description="Reminders about upcoming mentorship sessions"
                enabled={localPrefs.mentorship_reminder}
                onToggle={(checked) => handleToggleType('mentorship_reminder', checked)}
              />
            </div>
            
            <div className="space-y-1 mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">PitchHub</h4>
              
              <NotificationSettingItem
                type="pitch_vote"
                label="Votes"
                description="When someone votes on your pitch idea"
                enabled={localPrefs.pitch_vote}
                onToggle={(checked) => handleToggleType('pitch_vote', checked)}
              />
              
              <NotificationSettingItem
                type="pitch_comment"
                label="Comments"
                description="When someone comments on your pitch idea"
                enabled={localPrefs.pitch_comment}
                onToggle={(checked) => handleToggleType('pitch_comment', checked)}
              />
              
              <NotificationSettingItem
                type="pitch_feedback"
                label="Mentor Feedback"
                description="When a mentor provides feedback on your pitch"
                enabled={localPrefs.pitch_feedback}
                onToggle={(checked) => handleToggleType('pitch_feedback', checked)}
              />
            </div>
            
            <div className="space-y-1 mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Ascend</h4>
              
              <NotificationSettingItem
                type="level_up"
                label="Level Ups"
                description="When you level up in the platform"
                enabled={localPrefs.level_up}
                onToggle={(checked) => handleToggleType('level_up', checked)}
              />
              
              <NotificationSettingItem
                type="badge_unlock"
                label="Badge Unlocks"
                description="When you earn a new badge"
                enabled={localPrefs.badge_unlock}
                onToggle={(checked) => handleToggleType('badge_unlock', checked)}
              />
              
              <NotificationSettingItem
                type="leaderboard_shift"
                label="Leaderboard Changes"
                description="When your position changes on the leaderboard"
                enabled={localPrefs.leaderboard_shift}
                onToggle={(checked) => handleToggleType('leaderboard_shift', checked)}
              />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Launchpad</h4>
              
              <NotificationSettingItem
                type="launchpad_comment"
                label="Comments"
                description="When someone comments on your post"
                enabled={localPrefs.launchpad_comment}
                onToggle={(checked) => handleToggleType('launchpad_comment', checked)}
              />
              
              <NotificationSettingItem
                type="launchpad_reaction"
                label="Reactions"
                description="When someone reacts to your post"
                enabled={localPrefs.launchpad_reaction}
                onToggle={(checked) => handleToggleType('launchpad_reaction', checked)}
              />
              
              <NotificationSettingItem
                type="launchpad_repost"
                label="Reposts"
                description="When someone reposts your content"
                enabled={localPrefs.launchpad_repost}
                onToggle={(checked) => handleToggleType('launchpad_repost', checked)}
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleUpdatePreferences}
          disabled={preferencesLoading || isUpdating}
          className="gradient-bg hover:scale-105 transition-transform"
        >
          <Bell className="mr-2 h-4 w-4" />
          Save Notification Settings
        </Button>
      </div>
    </motion.div>
  );
}
