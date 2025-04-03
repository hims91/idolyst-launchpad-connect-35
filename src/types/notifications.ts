
import { Database } from "@/integrations/supabase/types";

export type NotificationType = Database["public"]["Enums"]["notification_type"];

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
  email_digest_frequency: string;
  muted_until: string | null;
  updated_at: string;
}

export type NotificationGroup = {
  date: string;
  title: string;
  notifications: Notification[];
};
