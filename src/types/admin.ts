
export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name: string;
  maintenance_mode: boolean;
  version: string;
}

export interface ModerationSettings {
  auto_flag_keywords: string[];
  require_approval_for_new_users: boolean;
}

export interface NotificationSettings {
  admin_email: string;
  alert_on_reports: boolean;
}

export interface ModerationItem {
  id: string;
  content_type: string;
  content_id: string;
  reported_by: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  moderator_id?: string;
  moderator?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  moderator_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  log_type: 'error' | 'warning' | 'info';
  component: string;
  message: string;
  metadata?: any;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_pitches: number;
  total_mentors: number;
  new_users_today: number;
  active_users_last_week: number;
  total_reports: number;
  pending_reports: number;
}
