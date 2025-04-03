
import { supabase } from "@/integrations/supabase/client";
import { 
  Mentor, 
  MentorWithProfile, 
  MentorCertification, 
  MentorAvailability, 
  DateException, 
  MentorshipSession, 
  SessionReview, 
  TimeSlot, 
  MentorFilter,
  ExpertiseCategory,
  SessionStatus
} from "@/types/mentor";
import { ExtendedProfile } from "@/types/profile";
import { format, addDays, isBefore, isAfter, parseISO, setHours, setMinutes } from "date-fns";

// Fetch all approved mentors, with optional filtering
export const fetchMentors = async (filter?: MentorFilter) => {
  let query = supabase
    .from('mentors')
    .select(`
      *,
      profile:id(
        id, 
        username, 
        full_name, 
        avatar_url, 
        bio,
        location
      )
    `)
    .eq('status', 'approved');
  
  // Apply filters if provided
  if (filter) {
    // Filter by expertise
    if (filter.expertise && filter.expertise.length > 0) {
      query = query.contains('expertise', filter.expertise);
    }
    
    // Filter by price range
    if (filter.minPrice !== undefined) {
      query = query.gte('hourly_rate', filter.minPrice);
    }
    if (filter.maxPrice !== undefined) {
      query = query.lte('hourly_rate', filter.maxPrice);
    }
    
    // Filter by minimum rating
    if (filter.minRating !== undefined) {
      query = query.gte('avg_rating', filter.minRating);
    }
    
    // Search query (name or bio)
    if (filter.searchQuery) {
      query = query.or(`profile.full_name.ilike.%${filter.searchQuery}%,bio.ilike.%${filter.searchQuery}%`);
    }
    
    // Sorting
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
      // Default sort by is_featured and then rating
      query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
    }
  } else {
    // Default sort by is_featured and then rating
    query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Transform the data to match our MentorWithProfile type
  const mentors: MentorWithProfile[] = data.map(item => {
    const { profile: profileData, ...mentorData } = item;
    return {
      ...mentorData,
      profile: (profileData || {}) as ExtendedProfile
    };
  });
  
  return mentors;
};

// Fetch a single mentor by ID
export const fetchMentor = async (mentorId: string) => {
  // Fetch mentor data
  const { data: mentorData, error: mentorError } = await supabase
    .from('mentors')
    .select(`
      *,
      profile:id(
        id, 
        username, 
        full_name, 
        avatar_url, 
        bio,
        location,
        social_links
      )
    `)
    .eq('id', mentorId)
    .single();
  
  if (mentorError) throw mentorError;
  
  if (!mentorData) throw new Error('Mentor not found');
  
  // Fetch mentor certifications
  const { data: certificationData, error: certificationError } = await supabase
    .from('mentor_certifications')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('issue_date', { ascending: false });
  
  if (certificationError) throw certificationError;
  
  // Get session IDs for this mentor first to use in the reviews query
  const { data: sessionIds, error: sessionError } = await supabase
    .from('mentorship_sessions')
    .select('id')
    .eq('mentor_id', mentorId);
    
  if (sessionError) throw sessionError;
  
  // Extract session IDs
  const sessionIdArray: string[] = (sessionIds || []).map(item => item.id);
  
  // Fetch recent reviews using the session IDs
  const { data: reviewsData, error: reviewsError } = await supabase
    .from('session_reviews')
    .select(`
      *,
      reviewer:reviewer_id(
        id,
        username,
        full_name,
        avatar_url
      ),
      session:session_id(
        id,
        session_date
      )
    `)
    .eq('is_public', true)
    .in('session_id', sessionIdArray.length > 0 ? sessionIdArray : ['no-sessions'])
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (reviewsError) throw reviewsError;
  
  // Fetch availability
  const { data: availabilityData, error: availabilityError } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId);
    
  if (availabilityError) throw availabilityError;
  
  // Fetch date exceptions
  const { data: exceptionData, error: exceptionError } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', mentorId)
    .gte('exception_date', format(new Date(), 'yyyy-MM-dd'));
    
  if (exceptionError) throw exceptionError;
  
  // Transform the data
  const { profile: profileData, ...mentorDataOnly } = mentorData;
  
  // Process reviews data with proper type handling
  const processedReviews = (reviewsData || []).map(review => {
    const { reviewer, session, ...reviewData } = review;
    return {
      ...reviewData,
      reviewer: reviewer as unknown as ExtendedProfile,
      session: session || null
    };
  });
  
  const mentorWithProfile: MentorWithProfile & {
    certifications: MentorCertification[];
    reviews: SessionReview[];
    availability: MentorAvailability[];
    date_exceptions: DateException[];
  } = {
    ...mentorDataOnly,
    profile: (profileData || {}) as ExtendedProfile,
    certifications: certificationData || [],
    reviews: processedReviews as SessionReview[],
    availability: availabilityData || [],
    date_exceptions: exceptionData || [],
  };
  
  return mentorWithProfile;
};

// Check if the current user is a mentor
export const checkMentorStatus = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
    throw error;
  }
  
  return data;
};

// Fetch mentor's availability
export const fetchMentorAvailability = async (mentorId: string) => {
  const { data, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId);
  
  if (error) throw error;
  
  return data;
};

// Fetch mentor's date exceptions
export const fetchMentorDateExceptions = async (mentorId: string) => {
  const { data, error } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', mentorId)
    .gte('exception_date', format(new Date(), 'yyyy-MM-dd'));
  
  if (error) throw error;
  
  return data;
};

// Calculate available time slots for a specific date
export const fetchAvailableTimeSlots = async (mentorId: string, date: Date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get mentor's regular availability for this day of the week
  const { data: availabilityData, error: availabilityError } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('day_of_week', dayOfWeek);
  
  if (availabilityError) throw availabilityError;
  
  // Check if this date is an exception
  const { data: exceptionData, error: exceptionError } = await supabase
    .from('mentor_date_exceptions')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('exception_date', formattedDate)
    .single();
  
  if (exceptionError && exceptionError.code !== 'PGRST116') throw exceptionError;
  
  // If date is explicitly marked as unavailable, return empty array
  if (exceptionData && !exceptionData.is_available) {
    return [];
  }
  
  // Get already booked sessions for this date
  const { data: bookedSessionsData, error: bookedSessionsError } = await supabase
    .from('mentorship_sessions')
    .select('start_time, end_time')
    .eq('mentor_id', mentorId)
    .eq('session_date', formattedDate)
    .in('status', ['scheduled', 'rescheduled']);
  
  if (bookedSessionsError) throw bookedSessionsError;
  
  // Generate time slots based on availability
  const timeSlots: TimeSlot[] = [];
  
  if (availabilityData && availabilityData.length > 0) {
    for (const slot of availabilityData) {
      const [startHour, startMinute] = slot.start_time.split(':').map(Number);
      const [endHour, endMinute] = slot.end_time.split(':').map(Number);
      
      let slotTime = setMinutes(setHours(date, startHour), startMinute);
      const slotEndTime = setMinutes(setHours(date, endHour), endMinute);
      
      // Create 30-minute intervals
      while (isBefore(slotTime, slotEndTime)) {
        const endTimeSlot = addDays(slotTime, 0);
        endTimeSlot.setMinutes(endTimeSlot.getMinutes() + 30);
        
        if (isAfter(endTimeSlot, slotEndTime)) break;
        
        const startTimeString = format(slotTime, 'HH:mm');
        const endTimeString = format(endTimeSlot, 'HH:mm');
        
        // Check if slot is already booked
        const isBooked = bookedSessionsData?.some(session => {
          return session.start_time <= startTimeString && session.end_time > startTimeString;
        });
        
        if (!isBooked) {
          timeSlots.push({
            date: formattedDate,
            start_time: startTimeString,
            end_time: endTimeString,
            is_available: true
          });
        }
        
        slotTime = endTimeSlot;
      }
    }
  }
  
  return timeSlots;
};

// Fetch user's mentorship sessions
export const fetchUserSessions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Fetch sessions where user is either mentor or mentee
  const { data, error } = await supabase
    .from('mentorship_sessions')
    .select(`
      *,
      mentor:mentor_id(
        id,
        hourly_rate,
        profile:id(
          id,
          username,
          full_name,
          avatar_url
        )
      ),
      mentee:mentee_id(
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
    .order('session_date', { ascending: false });
  
  if (error) throw error;
  
  // Transform the data to match our types, handling potential null values
  const sessions: MentorshipSession[] = (data || []).map(item => {
    const { mentor, mentee, ...sessionData } = item;
    
    // Create a properly structured mentor object
    const mentorObject = mentor ? {
      id: mentor.id,
      hourly_rate: mentor.hourly_rate,
      profile: mentor.profile as unknown as ExtendedProfile || {} as ExtendedProfile,
      bio: '',
      expertise: [] as ExpertiseCategory[],
      years_experience: 0,
      is_featured: false,
      avg_rating: 0,
      total_sessions: 0,
      total_reviews: 0,
      status: 'approved',
      created_at: '',
      updated_at: ''
    } : undefined;
    
    return {
      ...sessionData,
      mentor: mentorObject,
      mentee: mentee as unknown as ExtendedProfile || {} as ExtendedProfile
    };
  });
  
  return sessions;
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
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if the time slot is available
  const { data: existingSessions, error: checkError } = await supabase
    .from('mentorship_sessions')
    .select('id')
    .eq('mentor_id', mentorId)
    .eq('session_date', date)
    .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`)
    .in('status', ['scheduled', 'rescheduled']);
  
  if (checkError) throw checkError;
  
  if (existingSessions && existingSessions.length > 0) {
    throw new Error('This time slot is no longer available');
  }
  
  // Book the session
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
      status: 'scheduled',
      price,
      payment_status: true // Assuming payment is handled elsewhere
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// Update session status
export const updateSessionStatus = async (
  sessionId: string,
  status: SessionStatus,
  meetingLink?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user is authorized to update this session
  const { data: sessionData, error: checkError } = await supabase
    .from('mentorship_sessions')
    .select('mentor_id, mentee_id')
    .eq('id', sessionId)
    .single();
  
  if (checkError) throw checkError;
  
  if (sessionData.mentor_id !== user.id && sessionData.mentee_id !== user.id) {
    throw new Error('Not authorized to update this session');
  }
  
  // Only mentors can set meeting links
  const updateData: any = { status };
  if (meetingLink && sessionData.mentor_id === user.id) {
    updateData.meeting_link = meetingLink;
  }
  
  const { data, error } = await supabase
    .from('mentorship_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// Submit a review for a completed session
export const submitSessionReview = async (
  sessionId: string,
  rating: number,
  comment?: string,
  isPublic: boolean = true
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user was a mentee in this session
  const { data: sessionData, error: checkError } = await supabase
    .from('mentorship_sessions')
    .select('mentee_id, status')
    .eq('id', sessionId)
    .single();
  
  if (checkError) throw checkError;
  
  if (sessionData.mentee_id !== user.id) {
    throw new Error('Only mentees can review sessions');
  }
  
  if (sessionData.status !== 'completed') {
    throw new Error('Can only review completed sessions');
  }
  
  // Check if a review already exists
  const { data: existingReview, error: checkReviewError } = await supabase
    .from('session_reviews')
    .select('id')
    .eq('session_id', sessionId)
    .eq('reviewer_id', user.id)
    .single();
  
  if (checkReviewError && checkReviewError.code !== 'PGRST116') throw checkReviewError;
  
  if (existingReview) {
    // Update existing review
    const { data, error } = await supabase
      .from('session_reviews')
      .update({
        rating,
        comment,
        is_public: isPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingReview.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } else {
    // Create new review
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
    
    if (error) throw error;
    
    return data;
  }
};

// Apply to become a mentor
export const applyAsMentor = async (
  bio: string,
  expertise: ExpertiseCategory[],
  hourlyRate: number,
  yearsExperience: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user already has a mentor profile
  const { data: existingMentor, error: checkError } = await supabase
    .from('mentors')
    .select('id, status')
    .eq('id', user.id)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') throw checkError;
  
  if (existingMentor) {
    if (existingMentor.status === 'rejected') {
      // If previously rejected, allow to reapply with status set back to pending
      const { data, error } = await supabase
        .from('mentors')
        .update({
          bio,
          expertise,
          hourly_rate: hourlyRate,
          years_experience: yearsExperience,
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } else {
      throw new Error(`You already have a mentor profile with status: ${existingMentor.status}`);
    }
  } else {
    // Create new mentor profile
    const { data, error } = await supabase
      .from('mentors')
      .insert({
        id: user.id,
        bio,
        expertise,
        hourly_rate: hourlyRate,
        years_experience: yearsExperience
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
};

// Update mentor profile
export const updateMentorProfile = async (
  bio: string,
  expertise: ExpertiseCategory[],
  hourlyRate: number,
  yearsExperience: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
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
  
  if (error) throw error;
  
  return data;
};

// Add a mentor certification
export const addMentorCertification = async (
  title: string,
  issuer: string,
  issueDate: string,
  expiryDate?: string,
  credentialUrl?: string,
  imageUrl?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user is a mentor
  const { data: mentorData, error: checkError } = await supabase
    .from('mentors')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (checkError) throw checkError;
  
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
  
  if (error) throw error;
  
  return data;
};

// Update mentor availability
export const updateMentorAvailability = async (
  availabilitySlots: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
  }>
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // First delete all existing availability for this mentor
  const { error: deleteError } = await supabase
    .from('mentor_availability')
    .delete()
    .eq('mentor_id', user.id);
  
  if (deleteError) throw deleteError;
  
  // If no slots provided, just return after clearing
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return [];
  }
  
  // Then insert the new availability slots
  const { data, error } = await supabase
    .from('mentor_availability')
    .insert(
      availabilitySlots.map(slot => ({
        mentor_id: user.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_recurring: slot.is_recurring
      }))
    )
    .select();
  
  if (error) throw error;
  
  return data;
};

// Add a date exception (either mark a date as unavailable or as extra availability)
export const addDateException = async (
  exceptionDate: string,
  isAvailable: boolean
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if an exception already exists for this date
  const { data: existingException, error: checkError } = await supabase
    .from('mentor_date_exceptions')
    .select('id')
    .eq('mentor_id', user.id)
    .eq('exception_date', exceptionDate)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') throw checkError;
  
  if (existingException) {
    // Update existing exception
    const { data, error } = await supabase
      .from('mentor_date_exceptions')
      .update({
        is_available: isAvailable
      })
      .eq('id', existingException.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } else {
    // Create new exception
    const { data, error } = await supabase
      .from('mentor_date_exceptions')
      .insert({
        mentor_id: user.id,
        exception_date: exceptionDate,
        is_available: isAvailable
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
};
