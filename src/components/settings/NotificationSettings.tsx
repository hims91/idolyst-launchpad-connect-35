import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Mail, Smartphone, Clock } from "lucide-react";
import { EmailDigestFrequency, isValidEmailDigestFrequency } from "@/types/notifications";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";

export const NotificationSettings = () => {
  const {
    preferences,
    isLoading,
    isSaving,
    savePreferences,
    updatePreference,
    muteForHours,
    isMuted,
    getMuteRemainingHours,
    defaultPreferences
  } = useNotificationPreferences();

  // Toggle temporary muting
  const setTemporaryMute = (hours: number | null) => {
    muteForHours(hours);
  };

  // Toggle all notifications by category
  const toggleCategoryNotifications = (category: string, value: boolean) => {
    if (!preferences) return;
    
    const categoryMap: Record<string, (keyof typeof defaultPreferences)[]> = {
      'social': ['new_follower', 'new_message'],
      'launchpad': ['launchpad_reaction', 'launchpad_comment', 'launchpad_repost'],
      'pitchhub': ['pitch_feedback', 'pitch_comment', 'pitch_vote'],
      'mentorship': ['mentorship_reminder', 'mentorship_cancellation', 'mentorship_booking'],
      'ascend': ['level_up', 'badge_unlock', 'leaderboard_shift']
    };
    
    const keysToUpdate = categoryMap[category] || [];
    const updatedPrefs = { ...preferences };
    
    keysToUpdate.forEach(key => {
      updatedPrefs[key] = value;
    });
    
    savePreferences(updatedPrefs);
  };

  // Check if any notification in a category is enabled
  const isCategoryEnabled = (category: string): boolean => {
    if (!preferences) return false;
    
    const categoryMap: Record<string, (keyof typeof defaultPreferences)[]> = {
      'social': ['new_follower', 'new_message'],
      'launchpad': ['launchpad_reaction', 'launchpad_comment', 'launchpad_repost'],
      'pitchhub': ['pitch_feedback', 'pitch_comment', 'pitch_vote'],
      'mentorship': ['mentorship_reminder', 'mentorship_cancellation', 'mentorship_booking'],
      'ascend': ['level_up', 'badge_unlock', 'leaderboard_shift']
    };
    
    const keysToCheck = categoryMap[category] || [];
    return keysToCheck.some(key => preferences[key] === true);
  };

  // Loading skeleton
  if (isLoading || !preferences) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-6" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-10" />
            </div>
            <Separator />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold gradient-text mb-4">Notification Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Control how and when you receive notifications from Idolyst.
        </p>
        
        {/* Delivery Channels */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delivery Channels</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-idolyst-purple" />
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-idolyst-purple" />
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_enabled}
              onCheckedChange={(checked) => updatePreference('push_enabled', checked)}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <Label>Email Digest Frequency</Label>
            <RadioGroup
              value={preferences.email_digest_frequency}
              onValueChange={(value) => {
                if (isValidEmailDigestFrequency(value)) {
                  updatePreference('email_digest_frequency', value);
                }
              }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily-digest" />
                <Label htmlFor="daily-digest">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly-digest" />
                <Label htmlFor="weekly-digest">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never-digest" />
                <Label htmlFor="never-digest">Never (Immediate notifications only)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        {/* Temporary Muting */}
        <div className="space-y-3 mt-8">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-medium">Temporary Muting</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Temporarily pause all notifications for a specific duration
          </p>
          
          <div className="flex flex-wrap gap-3 mt-2">
            <Button 
              variant={preferences.muted_until === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setTemporaryMute(null)}
              className={preferences.muted_until === null ? "gradient-bg" : ""}
            >
              Not Muted
            </Button>
            <Button 
              variant={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() < 4 * 60 * 60 * 1000 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTemporaryMute(1)}
              className={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() < 4 * 60 * 60 * 1000 ? "gradient-bg" : ""}
            >
              1 Hour
            </Button>
            <Button 
              variant={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() >= 4 * 60 * 60 * 1000 && new Date(preferences.muted_until).getTime() - Date.now() < 8 * 60 * 60 * 1000 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTemporaryMute(4)}
              className={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() >= 4 * 60 * 60 * 1000 && new Date(preferences.muted_until).getTime() - Date.now() < 8 * 60 * 60 * 1000 ? "gradient-bg" : ""}
            >
              4 Hours
            </Button>
            <Button 
              variant={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() >= 8 * 60 * 60 * 1000 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTemporaryMute(24)}
              className={preferences.muted_until !== null && new Date(preferences.muted_until).getTime() - Date.now() >= 8 * 60 * 60 * 1000 ? "gradient-bg" : ""}
            >
              24 Hours
            </Button>
          </div>
          
          {isMuted() && (
            <p className="text-sm text-amber-500 mt-2">
              Notifications muted for {getMuteRemainingHours()} more hour{getMuteRemainingHours() === 1 ? '' : 's'}
            </p>
          )}
        </div>
        
        {/* Notification Types */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-medium">Notification Types</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize which notifications you want to receive
          </p>
          
          <Accordion type="multiple" className="w-full">
            {/* Social Notifications */}
            <AccordionItem value="social-notifications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Social Notifications</span>
                  <Switch 
                    checked={isCategoryEnabled('social')}
                    onCheckedChange={(checked) => toggleCategoryNotifications('social', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-follower" className="cursor-pointer">New Follower</Label>
                    <Switch 
                      id="new-follower" 
                      checked={preferences.new_follower}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, new_follower: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-message" className="cursor-pointer">New Message</Label>
                    <Switch 
                      id="new-message" 
                      checked={preferences.new_message}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, new_message: checked }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Launchpad Notifications */}
            <AccordionItem value="launchpad-notifications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Launchpad Notifications</span>
                  <Switch 
                    checked={isCategoryEnabled('launchpad')}
                    onCheckedChange={(checked) => toggleCategoryNotifications('launchpad', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="launchpad-reaction" className="cursor-pointer">Reactions on your posts</Label>
                    <Switch 
                      id="launchpad-reaction" 
                      checked={preferences.launchpad_reaction}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, launchpad_reaction: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="launchpad-comment" className="cursor-pointer">Comments on your posts</Label>
                    <Switch 
                      id="launchpad-comment" 
                      checked={preferences.launchpad_comment}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, launchpad_comment: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="launchpad-repost" className="cursor-pointer">Reposts of your content</Label>
                    <Switch 
                      id="launchpad-repost" 
                      checked={preferences.launchpad_repost}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, launchpad_repost: checked }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* PitchHub Notifications */}
            <AccordionItem value="pitchhub-notifications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>PitchHub Notifications</span>
                  <Switch 
                    checked={isCategoryEnabled('pitchhub')}
                    onCheckedChange={(checked) => toggleCategoryNotifications('pitchhub', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pitch-feedback" className="cursor-pointer">Feedback on your pitches</Label>
                    <Switch 
                      id="pitch-feedback" 
                      checked={preferences.pitch_feedback}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pitch_feedback: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pitch-comment" className="cursor-pointer">Comments on your pitches</Label>
                    <Switch 
                      id="pitch-comment" 
                      checked={preferences.pitch_comment}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pitch_comment: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pitch-vote" className="cursor-pointer">Votes on your pitches</Label>
                    <Switch 
                      id="pitch-vote" 
                      checked={preferences.pitch_vote}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pitch_vote: checked }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Mentorship Notifications */}
            <AccordionItem value="mentorship-notifications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Mentorship Notifications</span>
                  <Switch 
                    checked={isCategoryEnabled('mentorship')}
                    onCheckedChange={(checked) => toggleCategoryNotifications('mentorship', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentorship-booking" className="cursor-pointer">Session bookings</Label>
                    <Switch 
                      id="mentorship-booking" 
                      checked={preferences.mentorship_booking}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, mentorship_booking: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentorship-reminder" className="cursor-pointer">Session reminders</Label>
                    <Switch 
                      id="mentorship-reminder" 
                      checked={preferences.mentorship_reminder}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, mentorship_reminder: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentorship-cancellation" className="cursor-pointer">Session cancellations</Label>
                    <Switch 
                      id="mentorship-cancellation" 
                      checked={preferences.mentorship_cancellation}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, mentorship_cancellation: checked }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Ascend Notifications */}
            <AccordionItem value="ascend-notifications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Ascend Notifications</span>
                  <Switch 
                    checked={isCategoryEnabled('ascend')}
                    onCheckedChange={(checked) => toggleCategoryNotifications('ascend', checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="level-up" className="cursor-pointer">Level up notifications</Label>
                    <Switch 
                      id="level-up" 
                      checked={preferences.level_up}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, level_up: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="badge-unlock" className="cursor-pointer">Badge unlocks</Label>
                    <Switch 
                      id="badge-unlock" 
                      checked={preferences.badge_unlock}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, badge_unlock: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="leaderboard-shift" className="cursor-pointer">Leaderboard position changes</Label>
                    <Switch 
                      id="leaderboard-shift" 
                      checked={preferences.leaderboard_shift}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, leaderboard_shift: checked }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={() => savePreferences()}
            disabled={isSaving}
            className="gradient-bg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
