
import { useState, useEffect } from 'react';
import { useNotificationPreferences } from '@/hooks/use-notification-preferences';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  User, 
  BadgeCheck, 
  TrendingUp,
  MessageCircle, 
  Award, 
  Repeat,
  ThumbsUp
} from 'lucide-react';
import { NotificationPreferences, EmailDigestFrequency } from '@/types/notifications';

const NotificationSettings = () => {
  const { 
    preferences, 
    isLoading, 
    isSaving, 
    savePreferences, 
    updatePreference 
  } = useNotificationPreferences();
  
  if (isLoading || !preferences) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const handleSave = async () => {
    await savePreferences();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold gradient-text mb-4">Notification Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Control how and when you receive notifications from Idolyst.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* General Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-idolyst-purple" />
            <h3 className="text-lg font-semibold">General Notification Settings</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-enabled" className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <Switch 
              id="email-enabled" 
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-enabled" className="text-base">Push Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications on your device
              </p>
            </div>
            <Switch 
              id="push-enabled" 
              checked={preferences.push_enabled}
              onCheckedChange={(checked) => updatePreference('push_enabled', checked)}
            />
          </div>
          
          {preferences.email_enabled && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Label htmlFor="email-digest" className="text-base mb-2 block">Email Digest Frequency</Label>
              <RadioGroup 
                value={preferences.email_digest_frequency}
                onValueChange={(value) => updatePreference('email_digest_frequency', value as EmailDigestFrequency)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily Digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly Digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">No Digest (Immediate Notifications Only)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        
        {/* Notification Categories */}
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-idolyst-purple" />
                <span>Network Activity</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="new_follower" className="text-base">New Followers</Label>
                <Switch 
                  id="new_follower" 
                  checked={preferences.new_follower}
                  onCheckedChange={(checked) => updatePreference('new_follower', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new_message" className="text-base">New Messages</Label>
                <Switch 
                  id="new_message" 
                  checked={preferences.new_message}
                  onCheckedChange={(checked) => updatePreference('new_message', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-idolyst-purple" />
                <span>Launchpad Activity</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="launchpad_comment" className="text-base">Post Comments</Label>
                <Switch 
                  id="launchpad_comment" 
                  checked={preferences.launchpad_comment}
                  onCheckedChange={(checked) => updatePreference('launchpad_comment', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="launchpad_reaction" className="text-base">Post Reactions</Label>
                <Switch 
                  id="launchpad_reaction" 
                  checked={preferences.launchpad_reaction}
                  onCheckedChange={(checked) => updatePreference('launchpad_reaction', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="launchpad_repost" className="text-base">Post Reposts</Label>
                <Switch 
                  id="launchpad_repost" 
                  checked={preferences.launchpad_repost}
                  onCheckedChange={(checked) => updatePreference('launchpad_repost', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-idolyst-purple" />
                <span>PitchHub Activity</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch_vote" className="text-base">Pitch Votes</Label>
                <Switch 
                  id="pitch_vote" 
                  checked={preferences.pitch_vote}
                  onCheckedChange={(checked) => updatePreference('pitch_vote', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch_comment" className="text-base">Pitch Comments</Label>
                <Switch 
                  id="pitch_comment" 
                  checked={preferences.pitch_comment}
                  onCheckedChange={(checked) => updatePreference('pitch_comment', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch_feedback" className="text-base">Pitch Feedback</Label>
                <Switch 
                  id="pitch_feedback" 
                  checked={preferences.pitch_feedback}
                  onCheckedChange={(checked) => updatePreference('pitch_feedback', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-idolyst-purple" />
                <span>Mentorship Activities</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="mentorship_booking" className="text-base">Session Bookings</Label>
                <Switch 
                  id="mentorship_booking" 
                  checked={preferences.mentorship_booking}
                  onCheckedChange={(checked) => updatePreference('mentorship_booking', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mentorship_cancellation" className="text-base">Session Cancellations</Label>
                <Switch 
                  id="mentorship_cancellation" 
                  checked={preferences.mentorship_cancellation}
                  onCheckedChange={(checked) => updatePreference('mentorship_cancellation', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mentorship_reminder" className="text-base">Session Reminders</Label>
                <Switch 
                  id="mentorship_reminder" 
                  checked={preferences.mentorship_reminder}
                  onCheckedChange={(checked) => updatePreference('mentorship_reminder', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-idolyst-purple" />
                <span>Progress & Achievements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="level_up" className="text-base">Level Ups</Label>
                <Switch 
                  id="level_up" 
                  checked={preferences.level_up}
                  onCheckedChange={(checked) => updatePreference('level_up', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="badge_unlock" className="text-base">Badge Unlocks</Label>
                <Switch 
                  id="badge_unlock" 
                  checked={preferences.badge_unlock}
                  onCheckedChange={(checked) => updatePreference('badge_unlock', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="leaderboard_shift" className="text-base">Leaderboard Position Changes</Label>
                <Switch 
                  id="leaderboard_shift" 
                  checked={preferences.leaderboard_shift}
                  onCheckedChange={(checked) => updatePreference('leaderboard_shift', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="gradient-bg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : "Save Notification Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
