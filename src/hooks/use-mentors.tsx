
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  fetchMentors,
  fetchMentor,
  checkMentorStatus,
  applyAsMentor,
  updateMentorProfile,
  addMentorCertification,
  updateMentorAvailability,
  addDateException,
  fetchUserSessions,
  bookMentorshipSession,
  updateSessionStatus,
  submitSessionReview,
  fetchAvailableTimeSlots
} from "@/api/mentor";
import { MentorFilter, ExpertiseCategory } from "@/types/mentor";

// Hook to fetch mentors with optional filtering
export const useMentors = (filter?: MentorFilter) => {
  return useQuery({
    queryKey: ["mentors", filter],
    queryFn: () => fetchMentors(filter),
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch a single mentor by ID
export const useMentor = (mentorId: string) => {
  return useQuery({
    queryKey: ["mentor", mentorId],
    queryFn: () => fetchMentor(mentorId),
    refetchOnWindowFocus: false,
    enabled: !!mentorId,
  });
};

// Hook to check the current user's mentor status
export const useMentorStatus = () => {
  return useQuery({
    queryKey: ["mentorStatus"],
    queryFn: checkMentorStatus,
    refetchOnWindowFocus: false,
    retry: 1,
    // Don't throw when the user isn't a mentor
    meta: {
      onError: () => {}
    }
  });
};

// Hook to apply as a mentor
export const useApplyAsMentor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { 
      bio: string, 
      expertise: ExpertiseCategory[], 
      hourlyRate: number, 
      yearsExperience: number 
    }) => {
      return applyAsMentor(
        data.bio,
        data.expertise,
        data.hourlyRate,
        data.yearsExperience
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorStatus"] });
    }
  });
};

// Hook to update mentor profile
export const useUpdateMentorProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { 
      bio: string, 
      expertise: ExpertiseCategory[], 
      hourlyRate: number, 
      yearsExperience: number 
    }) => {
      return updateMentorProfile(
        data.bio,
        data.expertise,
        data.hourlyRate,
        data.yearsExperience
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorStatus"] });
      toast({
        title: "Profile updated",
        description: "Your mentor profile has been updated successfully."
      });
    }
  });
};

// Hook to add a mentor certification
export const useAddMentorCertification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { 
      title: string, 
      issuer: string, 
      issueDate: string, 
      expiryDate?: string, 
      credentialUrl?: string, 
      imageUrl?: string 
    }) => {
      return addMentorCertification(
        data.title,
        data.issuer,
        data.issueDate,
        data.expiryDate,
        data.credentialUrl,
        data.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
      toast({
        title: "Certification added",
        description: "Your certification has been added successfully."
      });
    }
  });
};

// Hook to update mentor availability
export const useUpdateMentorAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (availabilitySlots: Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
      is_recurring: boolean;
    }>) => {
      return updateMentorAvailability(availabilitySlots);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
      toast({
        title: "Availability updated",
        description: "Your availability settings have been updated."
      });
    }
  });
};

// Hook to add a date exception
export const useAddDateException = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { exceptionDate: string, isAvailable: boolean }) => {
      return addDateException(data.exceptionDate, data.isAvailable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
      toast({
        title: "Date exception added",
        description: "Your calendar has been updated."
      });
    }
  });
};

// Hook to fetch user's mentorship sessions
export const useUserSessions = () => {
  return useQuery({
    queryKey: ["mentorshipSessions"],
    queryFn: fetchUserSessions,
    refetchOnWindowFocus: false,
  });
};

// Hook to book a mentorship session
export const useBookSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { 
      mentorId: string, 
      title: string, 
      description: string, 
      date: string, 
      startTime: string, 
      endTime: string, 
      price: number 
    }) => {
      return bookMentorshipSession(
        data.mentorId,
        data.title,
        data.description,
        data.date,
        data.startTime,
        data.endTime,
        data.price
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipSessions"] });
    }
  });
};

// Hook to update session status
export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { sessionId: string, status: string, meetingLink?: string }) => {
      return updateSessionStatus(data.sessionId, data.status as any, data.meetingLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipSessions"] });
    }
  });
};

// Hook to submit a session review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { 
      sessionId: string, 
      rating: number, 
      comment?: string, 
      isPublic: boolean 
    }) => {
      return submitSessionReview(
        data.sessionId,
        data.rating,
        data.comment,
        data.isPublic
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorshipSessions"] });
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
      toast({
        title: "Review submitted",
        description: "Thank you for providing your feedback."
      });
    }
  });
};

// Hook to fetch available time slots for a mentor on a given date
export const useAvailableTimeSlots = (mentorId: string, date: Date) => {
  return useQuery({
    queryKey: ["timeSlots", mentorId, date.toISOString().split('T')[0]],
    queryFn: () => fetchAvailableTimeSlots(mentorId, date),
    refetchOnWindowFocus: false,
    enabled: !!mentorId && !!date,
  });
};
