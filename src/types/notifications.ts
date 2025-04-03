
import { Database } from "@/integrations/supabase/types";

export type NotificationType = 
  | 'new_follower'
  | 'new_message' 
  | 'mentorship_booking'
  | 'mentorship_cancellation'
  | 'mentorship_reminder'
  | 'pitch_vote'
  | 'pitch_comment'
  | 'pitch_feedback'
  | 'level_up' 
  | 'badge_unlock'
  | 'leaderboard_shift'
  | 'launchpad_comment'
  | 'launchpad_reaction'
  | 'launchpad_repost'
  | 'payment_success'
  | 'reward_claimed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  content: string;
  related_id?: string;
  related_type?: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export type EmailDigestFrequency = 'daily' | 'weekly' | 'never';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  new_follower: boolean;
  new_message: boolean;
  mentorship_booking: boolean;
  mentorship_cancellation: boolean;
  mentorship_reminder: boolean;
  pitch_vote: boolean;
  pitch_comment: boolean;
  pitch_feedback: boolean;
  level_up: boolean;
  badge_unlock: boolean;
  leaderboard_shift: boolean;
  launchpad_comment: boolean;
  launchpad_reaction: boolean;
  launchpad_repost: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
  email_digest_frequency: EmailDigestFrequency;
  muted_until: string | null;
  updated_at: string;
}

export type NotificationGroup = {
  date: string;
  title: string;
  notifications: Notification[];
};

// Type guard for email digest frequency
export const isValidEmailDigestFrequency = (value: string): value is EmailDigestFrequency => {
  return ['daily', 'weekly', 'never'].includes(value);
};
