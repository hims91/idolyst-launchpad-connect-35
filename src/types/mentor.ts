
import { Database } from "@/integrations/supabase/types";
import { UserRole } from "./auth";
import { ExtendedProfile } from "./profile";

export type ExpertiseCategory = 'Business' | 'Marketing' | 'Technology' | 'Design' | 'Finance' | 'Product' | 'Leadership' | 'Sales' | 'Operations' | 'Data';
export type MentorStatus = 'pending' | 'approved' | 'rejected';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Mentor {
  id: string;
  bio: string;
  expertise: ExpertiseCategory[];
  hourly_rate: number;
  years_experience: number;
  is_featured: boolean;
  avg_rating: number;
  total_sessions: number;
  total_reviews: number;
  status: MentorStatus;
  created_at: string;
  updated_at: string;
  profile?: ExtendedProfile;
}

export interface MentorWithProfile extends Mentor {
  profile: ExtendedProfile;
}

export interface MentorCertification {
  id: string;
  mentor_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  image_url?: string;
  created_at: string;
}

export interface MentorAvailability {
  id: string;
  mentor_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface DateException {
  id: string;
  mentor_id: string;
  exception_date: string;
  is_available: boolean;
  created_at: string;
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  title: string;
  description?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: SessionStatus;
  meeting_link?: string;
  price: number;
  payment_status: boolean;
  created_at: string;
  updated_at: string;
  mentor?: MentorWithProfile;
  mentee?: ExtendedProfile;
}

export interface SessionReview {
  id: string;
  session_id: string;
  reviewer_id: string;
  rating: number;
  comment?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: ExtendedProfile;
}

export interface TimeSlot {
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface MentorFilter {
  expertise?: ExpertiseCategory[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
  sortBy?: 'rating' | 'price_low' | 'price_high' | 'sessions';
}
