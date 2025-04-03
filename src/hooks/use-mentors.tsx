
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyAsMentor,
  bookMentorshipSession,
  checkMentorStatus,
  fetchAvailableTimeSlots,
  fetchMentor,
  fetchMentorAvailability,
  fetchMentorDateExceptions,
  fetchMentors,
  fetchUserSessions,
  submitSessionReview,
  updateMentorAvailability,
  updateMentorProfile,
  updateSessionStatus,
  addDateException,
  addMentorCertification
} from "@/api/mentor";
import { MentorFilter, SessionStatus } from "@/types/mentor";
import { format } from "date-fns";
import { toast } from "sonner";

// Hook to fetch all mentors with filtering
export const useMentors = (filter?: MentorFilter) => {
  return useQuery({
    queryKey: ['mentors', filter],
    queryFn: () => fetchMentors(filter),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch a single mentor
export const useMentor = (mentorId: string | undefined) => {
  return useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: () => fetchMentor(mentorId as string),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch mentor availability
export const useMentorAvailability = (mentorId: string | undefined) => {
  return useQuery({
    queryKey: ['mentor-availability', mentorId],
    queryFn: () => fetchMentorAvailability(mentorId as string),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch mentor date exceptions
export const useMentorDateExceptions = (mentorId: string | undefined) => {
  return useQuery({
    queryKey: ['mentor-date-exceptions', mentorId],
    queryFn: () => fetchMentorDateExceptions(mentorId as string),
    enabled: !!mentorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to fetch available time slots for a mentor on a specific date
export const useAvailableTimeSlots = (mentorId: string | undefined, date: Date | null) => {
  return useQuery({
    queryKey: ['available-time-slots', mentorId, date ? format(date, 'yyyy-MM-dd') : null],
    queryFn: () => fetchAvailableTimeSlots(mentorId as string, date as Date),
    enabled: !!mentorId && !!date,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Hook to fetch user's sessions
export const useUserSessions = () => {
  return useQuery({
    queryKey: ['user-sessions'],
    queryFn: fetchUserSessions,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Hook to check if the current user is a mentor
export const useMentorStatus = () => {
  return useQuery({
    queryKey: ['mentor-status'],
    queryFn: checkMentorStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Mutation hook to apply as a mentor
export const useApplyAsMentor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bio, expertise, hourlyRate, yearsExperience }: {
      bio: string, 
      expertise: string[], 
      hourlyRate: number, 
      yearsExperience: number
    }) => applyAsMentor(bio, expertise, hourlyRate, yearsExperience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-status'] });
      toast.success("Mentor application submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit mentor application. Please try again.");
      console.error("Mentor application error:", error);
    }
  });
};

// Mutation hook to update mentor profile
export const useUpdateMentorProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bio, expertise, hourlyRate, yearsExperience }: {
      bio: string, 
      expertise: string[], 
      hourlyRate: number, 
      yearsExperience: number
    }) => updateMentorProfile(bio, expertise, hourlyRate, yearsExperience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-status'] });
      queryClient.invalidateQueries({ queryKey: ['mentor'] });
      toast.success("Mentor profile updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update mentor profile. Please try again.");
      console.error("Update mentor profile error:", error);
    }
  });
};

// Mutation hook to add mentor certification
export const useAddMentorCertification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ title, issuer, issueDate, expiryDate, credentialUrl, imageUrl }: {
      title: string, 
      issuer: string, 
      issueDate: string,
      expiryDate?: string,
      credentialUrl?: string,
      imageUrl?: string
    }) => addMentorCertification(title, issuer, issueDate, expiryDate, credentialUrl, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] });
      toast.success("Certification added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add certification. Please try again.");
      console.error("Add certification error:", error);
    }
  });
};

// Mutation hook to update mentor availability
export const useUpdateMentorAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availabilitySlots: any[]) => updateMentorAvailability(availabilitySlots),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-availability'] });
      toast.success("Availability updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update availability. Please try again.");
      console.error("Update availability error:", error);
    }
  });
};

// Mutation hook to add date exception
export const useAddDateException = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ exceptionDate, isAvailable }: {
      exceptionDate: string, 
      isAvailable: boolean
    }) => addDateException(exceptionDate, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-date-exceptions'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      toast.success("Date exception added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add date exception. Please try again.");
      console.error("Add date exception error:", error);
    }
  });
};

// Mutation hook to book a mentorship session
export const useBookMentorshipSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ mentorId, title, description, date, startTime, endTime, price }: {
      mentorId: string, 
      title: string, 
      description: string,
      date: string,
      startTime: string,
      endTime: string,
      price: number
    }) => bookMentorshipSession(mentorId, title, description, date, startTime, endTime, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      toast.success("Session booked successfully!");
    },
    onError: (error) => {
      toast.error("Failed to book session. Please try again.");
      console.error("Book session error:", error);
    }
  });
};

// Mutation hook to update session status
export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, status, meetingLink }: {
      sessionId: string, 
      status: SessionStatus,
      meetingLink?: string
    }) => updateSessionStatus(sessionId, status, meetingLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      toast.success("Session updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update session. Please try again.");
      console.error("Update session error:", error);
    }
  });
};

// Mutation hook to submit a session review
export const useSubmitSessionReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, rating, comment, isPublic }: {
      sessionId: string, 
      rating: number,
      comment?: string,
      isPublic?: boolean
    }) => submitSessionReview(sessionId, rating, comment, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor'] });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit review. Please try again.");
      console.error("Submit review error:", error);
    }
  });
};
