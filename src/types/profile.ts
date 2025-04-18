
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
  user_id?: string; // Added user_id as optional to accommodate existing code
}

export interface ExtendedProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
  xp: number;
  level?: number; // Added level field
  followers_count: number;
  following_count: number;
  pitches_count?: number;
  comments_count?: number;
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
  experience?: any; // Changed from any[] to any to handle different types from database
  qualifications?: any; // Changed from any[] to any to handle different types from database
  preferred_theme?: string;
  resume_url?: string | null; // Added for professional profiles
  github_url?: string | null; // Added for developer profiles
  availability_status?: 'available' | 'busy' | 'offline'; // Added for real-time status
  contribution_points?: number; // Added for right sidebar contributor ranking
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
  preferred_theme?: string;
  experience?: any[];
  qualifications?: any[];
  resume_url?: string; // Added
  github_url?: string; // Added
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'followers' | 'private';
  messaging_permissions: 'everyone' | 'followers' | 'none';
  activity_visibility: 'public' | 'followers' | 'private';
}

// Type guard functions to validate settings values
export const isValidProfileVisibility = (value: string): value is PrivacySettings['profile_visibility'] => {
  return ['public', 'followers', 'private'].includes(value);
};

export const isValidMessagingPermissions = (value: string): value is PrivacySettings['messaging_permissions'] => {
  return ['everyone', 'followers', 'none'].includes(value);
};

export const isValidActivityVisibility = (value: string): value is PrivacySettings['activity_visibility'] => {
  return ['public', 'followers', 'private'].includes(value);
};
