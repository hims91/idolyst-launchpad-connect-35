import { UserRole } from "./auth";

// Profile types
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface ProfileActivity {
  id: string;
  type: 'post' | 'pitch' | 'mentorship' | 'comment' | 'like';
  title: string;
  content?: string;
  created_at: string;
  likes?: number;
  comments?: number;
}

export interface ExtendedProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
  xp: number;
  followers_count: number;
  following_count: number;
  pitches_count?: number; // Added
  comments_count?: number; // Added
  social_links: SocialLink[];
  badges: Badge[];
  professional_details: string | null;
  portfolio_url: string | null;
  is_following?: boolean;
  roles: UserRole[];
  recent_activity: ProfileActivity[];
  created_at: string;
  location?: string | null;
  byline?: string | null;
}

export interface ProfileUpdatePayload {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  professional_details?: string;
  portfolio_url?: string;
  location?: string;
  byline?: string;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'followers' | 'private';
  messaging_permissions: 'everyone' | 'followers' | 'none';
  activity_visibility: 'public' | 'followers' | 'private';
}
