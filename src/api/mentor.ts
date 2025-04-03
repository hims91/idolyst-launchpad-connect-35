
import { supabase } from "@/integrations/supabase/client";
import { 
  Mentor, MentorAvailability, MentorCertification, 
  MentorFilter, MentorWithProfile, MentorshipSession, 
  SessionReview, TimeSlot, DateException, SessionStatus
} from "@/types/mentor";
import { ExtendedProfile } from "@/types/profile";
import { format, addDays, parseISO, isAfter, isSameDay } from "date-fns";

// Fetching mentors with profiles
export const fetchMentors = async (filter?: MentorFilter): Promise<MentorWithProfile[]> => {
  let query = supabase
    .from('mentors')
    .select(`
      *,
      profiles!inner(
        id, username, full_name, avatar_url, bio, xp,
        user_roles!inner(role)
      )
    `)
    .eq('status', 'approved');

  // Apply filters
  if (filter) {
    if (filter.expertise && filter.expertise.length > 0) {
      query = query.overlaps('expertise', filter.expertise);
    }
    
    if (filter.minPrice !== undefined) {
      query = query.gte('hourly_rate', filter.minPrice);
    }
    
    if (filter.maxPrice !== undefined) {
      query = query.lte('hourly_rate', filter.maxPrice);
    }
    
    if (filter.minRating !== undefined) {
      query = query.gte('avg_rating', filter.minRating);
    }
    
    if (filter.searchQuery) {
      query = query.or(`profiles.username.ilike.%${filter.searchQuery}%,profiles.full_name.ilike.%${filter.searchQuery}%,profiles.bio.ilike.%${filter.searchQuery}%`);
    }
    
    // Apply sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'rating':
          query = query.order('avg_rating', { ascending: false });
          break;
        case 'price_low':
          query = query.order('hourly_rate', { ascending: true });
          break;
        case 'price_high':
          query = query.order('hourly_rate', { ascending: false });
          break;
        case 'sessions':
          query = query.order('total_sessions', { ascending: false });
          break;
      }
    } else {
      // Default sort by featured and then rating
      query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
    }
  } else {
    // Default sort by featured and then rating
    query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching mentors:", error);
    throw error;
  }

  // Process the data to match our MentorWithProfile type
  return data.map(item => {
    const profile = item.profiles as any;
    const mentorData = {
      ...item,
      profile: {
        ...profile,
        roles: (profile.user_roles || []).map((ur: any) => ur.role)
      }
    };
    return mentorData as unknown as MentorWithProfile;
  });
};

// Fetch a single mentor with profile and certifications
export const fetchMentor = async (mentorId: string): Promise<MentorWithProfile> => {
  const { data, error } = await supabase
    .from('mentors')
    .select(`
      *,
      profiles!inner(
        id, username, full_name, avatar_url, bio, professional_details, 
        portfolio_url, xp, created_at,
        user_roles!inner(role),
        social_links(id, platform, url, icon)
      )
    `)
    .eq('id', mentorId)
    .single();

  if (error) {
    console.error("Error fetching mentor:", error);
    throw error;
  }

  // Get certifications
  const { data: certifications, error: certError } = await supabase
    .from('mentor_certifications')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('issue_date', { ascending: false });

  if (certError) {
    console.error("Error fetching certifications:", certError);
    throw certError;
  }

  // Get reviews
  const { data: reviews, error: reviewError } = await supabase
    .from('session_reviews')
    .select(`
      *,
      mentorship_sessions!inner(mentor_id),
      profiles!reviewer_id(id, username, full_name, avatar_url)
    `)
    .eq('mentorship_sessions.mentor_id', mentorId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (reviewError) {
    console.error("Error fetching reviews:", reviewError);
    throw reviewError;
  }

  // Process the data
  const profile = data.profiles as any;
  
  const mentor: MentorWithProfile = {
    ...data as unknown as Mentor,
    profile: {
      ...profile,
      roles: (profile.user_roles || []).map((ur: any) => ur.role),
      social_links: profile.social_links || []
    } as ExtendedProfile,
    certifications: certifications as unknown as MentorCertification[],
    reviews: reviews.map((review: any) => ({
      ...review,
      reviewer: review.profiles
    })) as unknown as SessionReview[]
  };

  return mentor;
};

// Fetch mentor availability
export const fetchMentorAvailability = async (mentorId: string): Promise<MentorAvailability[]> => {
  const { data, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId);

  if (error) {
    console.error("Error fetching mentor availability:", error);
    throw error;
  }

  return data as unknown as MentorAvailability[];
};

// Fetch mentor date exceptions
export const fetchMentorDateExceptions = async (mentorId: string): Promise<DateException[]> => {
  const { data, error } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', mentorId);

  if (error) {
    console.error("Error fetching mentor date exceptions:", error);
    throw error;
  }

  return data as unknown as DateException[];
};

// Get available time slots for a mentor
export const fetchAvailableTimeSlots = async (mentorId: string, date: Date): Promise<TimeSlot[]> => {
  // Get regular availability for the day of the week
  const dayOfWeek = date.getDay(); // 0 is Sunday
  const dateString = format(date, 'yyyy-MM-dd');
  
  const { data: availability, error: availError } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('day_of_week', dayOfWeek);

  if (availError) {
    console.error("Error fetching availability:", availError);
    throw availError;
  }

  // Check for date exceptions
  const { data: exceptions, error: exceptError } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('exception_date', dateString);

  if (exceptError) {
    console.error("Error fetching date exceptions:", exceptError);
    throw exceptError;
  }

  // If the date is marked as unavailable, return empty array
  if (exceptions && exceptions.length > 0 && !exceptions[0].is_available) {
    return [];
  }

  // Get booked sessions for the date
  const { data: sessions, error: sessionError } = await supabase
    .from('mentorship_sessions')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('session_date', dateString)
    .not('status', 'eq', 'cancelled');

  if (sessionError) {
    console.error("Error fetching sessions:", sessionError);
    throw sessionError;
  }

  if (!availability) {
    return [];
  }

  // Convert regular availability to time slots
  const timeSlots: TimeSlot[] = (availability as unknown as MentorAvailability[]).map(slot => ({
    date: dateString,
    start_time: slot.start_time,
    end_time: slot.end_time,
    is_available: true
  }));

  // Mark booked slots as unavailable
  if (sessions) {
    (sessions as unknown as MentorshipSession[]).forEach(session => {
      const sessionStart = session.start_time;
      const sessionEnd = session.end_time;
      
      timeSlots.forEach(slot => {
        // If the slot overlaps with a booked session, mark it as unavailable
        if (
          (sessionStart >= slot.start_time && sessionStart < slot.end_time) ||
          (sessionEnd > slot.start_time && sessionEnd <= slot.end_time) ||
          (sessionStart <= slot.start_time && sessionEnd >= slot.end_time)
        ) {
          slot.is_available = false;
        }
      });
    });
  }

  // Filter out unavailable slots
  return timeSlots.filter(slot => slot.is_available);
};

// Book a mentorship session
export const bookMentorshipSession = async (
  mentorId: string,
  title: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  price: number
): Promise<MentorshipSession> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('mentorship_sessions')
    .insert({
      mentor_id: mentorId,
      mentee_id: user.id,
      title,
      description,
      session_date: date,
      start_time: startTime,
      end_time: endTime,
      price,
      status: 'scheduled'
    })
    .select()
    .single();

  if (error) {
    console.error("Error booking mentorship session:", error);
    throw error;
  }

  return data as unknown as MentorshipSession;
};

// Fetch user's sessions (as mentor or mentee)
export const fetchUserSessions = async (): Promise<MentorshipSession[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('mentorship_sessions')
    .select(`
      *,
      mentors!mentor_id(
        *,
        profiles!inner(id, username, full_name, avatar_url)
      ),
      profiles!mentee_id(id, username, full_name, avatar_url)
    `)
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
    .order('session_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }

  // Process the data
  return (data || []).map(session => {
    const mentor = session.mentors as any;
    const mentee = session.profiles as any;
    
    return {
      ...session,
      mentor: mentor ? {
        ...mentor,
        profile: mentor.profiles
      } : undefined,
      mentee: mentee
    } as unknown as MentorshipSession;
  });
};

// Update session status
export const updateSessionStatus = async (
  sessionId: string, 
  status: SessionStatus,
  meetingLink?: string
): Promise<MentorshipSession> => {
  const updateData: any = { status };
  if (meetingLink) {
    updateData.meeting_link = meetingLink;
  }

  const { data, error } = await supabase
    .from('mentorship_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating session status:", error);
    throw error;
  }

  return data as unknown as MentorshipSession;
};

// Submit a review for a completed session
export const submitSessionReview = async (
  sessionId: string,
  rating: number,
  comment?: string,
  isPublic = true
): Promise<SessionReview> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('session_reviews')
    .insert({
      session_id: sessionId,
      reviewer_id: user.id,
      rating,
      comment,
      is_public: isPublic
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting review:", error);
    throw error;
  }

  return data as unknown as SessionReview;
};

// Check if a user has applied to be a mentor
export const checkMentorStatus = async (): Promise<Mentor | null> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error("Error checking mentor status:", error);
    throw error;
  }

  return data as unknown as Mentor | null;
};

// Apply to become a mentor
export const applyAsMentor = async (
  bio: string,
  expertise: string[],
  hourlyRate: number,
  yearsExperience: number
): Promise<Mentor> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('mentors')
    .insert({
      id: user.id,
      bio,
      expertise,
      hourly_rate: hourlyRate,
      years_experience: yearsExperience,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error("Error applying as mentor:", error);
    throw error;
  }

  // Also add the mentor role to user_roles
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: 'mentor',
      is_verified: false
    });

  if (roleError) {
    console.error("Error adding mentor role:", roleError);
    // Don't throw, as the mentor record was created successfully
  }

  return data as unknown as Mentor;
};

// Update mentor profile
export const updateMentorProfile = async (
  bio: string,
  expertise: string[],
  hourlyRate: number,
  yearsExperience: number
): Promise<Mentor> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('mentors')
    .update({
      bio,
      expertise,
      hourly_rate: hourlyRate,
      years_experience: yearsExperience,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating mentor profile:", error);
    throw error;
  }

  return data as unknown as Mentor;
};

// Add mentor certification
export const addMentorCertification = async (
  title: string,
  issuer: string,
  issueDate: string,
  expiryDate?: string,
  credentialUrl?: string,
  imageUrl?: string
): Promise<MentorCertification> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('mentor_certifications')
    .insert({
      mentor_id: user.id,
      title,
      issuer,
      issue_date: issueDate,
      expiry_date: expiryDate,
      credential_url: credentialUrl,
      image_url: imageUrl
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding certification:", error);
    throw error;
  }

  return data as unknown as MentorCertification;
};

// Update mentor availability
export const updateMentorAvailability = async (
  availabilitySlots: Omit<MentorAvailability, 'id' | 'mentor_id' | 'created_at' | 'updated_at'>[]
): Promise<MentorAvailability[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  // First, delete all existing availability
  const { error: deleteError } = await supabase
    .from('mentor_availability')
    .delete()
    .eq('mentor_id', user.id);

  if (deleteError) {
    console.error("Error deleting existing availability:", deleteError);
    throw deleteError;
  }

  if (availabilitySlots.length === 0) {
    return [];
  }

  // Then, insert new availability slots
  const slotsWithMentorId = availabilitySlots.map(slot => ({
    ...slot,
    mentor_id: user.id
  }));

  const { data, error } = await supabase
    .from('mentor_availability')
    .insert(slotsWithMentorId)
    .select();

  if (error) {
    console.error("Error updating availability:", error);
    throw error;
  }

  return data as unknown as MentorAvailability[];
};

// Add date exception (day off or extra availability)
export const addDateException = async (
  exceptionDate: string,
  isAvailable: boolean
): Promise<DateException> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if an exception already exists for this date
  const { data: existingException, error: checkError } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', user.id)
    .eq('exception_date', exceptionDate)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing exception:", checkError);
    throw checkError;
  }

  let result;
  
  if (existingException) {
    // Update existing exception
    const { data, error } = await supabase
      .from('mentor_date_exceptions')
      .update({ is_available: isAvailable })
      .eq('id', existingException.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating date exception:", error);
      throw error;
    }
    
    result = data;
  } else {
    // Insert new exception
    const { data, error } = await supabase
      .from('mentor_date_exceptions')
      .insert({
        mentor_id: user.id,
        exception_date: exceptionDate,
        is_available: isAvailable
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding date exception:", error);
      throw error;
    }
    
    result = data;
  }

  return result as unknown as DateException;
};
