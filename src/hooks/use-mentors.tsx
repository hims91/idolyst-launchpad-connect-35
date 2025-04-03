import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  addMentorCertification,
  addDateException
} from "@/api/mentor";
import { ExpertiseCategory, MentorFilter, SessionStatus } from "@/types/mentor";
import { useToast } from "./use-toast";

// Hook for fetching mentors with filtering
export const useMentors = (filter?: MentorFilter) => {
  return useQuery({
    queryKey: ['mentors', filter],
    queryFn: () => fetchMentors(filter),
  });
};

// Hook for fetching a single mentor
export const useMentor = (mentorId: string) => {
  return useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: () => fetchMentor(mentorId),
    enabled: !!mentorId
  });
};

// Hook for checking current user's mentor status
export const useMentorStatus = () => {
  return useQuery({
    queryKey: ['mentorStatus'],
    queryFn: checkMentorStatus,
  });
};

// Hook for fetching mentor availability
export const useMentorAvailability = (mentorId: string) => {
  return useQuery({
    queryKey: ['mentorAvailability', mentorId],
    queryFn: () => fetchMentorAvailability(mentorId),
    enabled: !!mentorId
  });
};

// Hook for fetching mentor date exceptions
export const useMentorDateExceptions = (mentorId: string) => {
  return useQuery({
    queryKey: ['mentorDateExceptions', mentorId],
    queryFn: () => fetchMentorDateExceptions(mentorId),
    enabled: !!mentorId
  });
};

// Hook for fetching available time slots
export const useAvailableTimeSlots = (mentorId: string, date: Date) => {
  return useQuery({
    queryKey: ['availableTimeSlots', mentorId, date.toISOString().split('T')[0]],
    queryFn: () => fetchAvailableTimeSlots(mentorId, date),
    enabled: !!mentorId && !!date
  });
};

// Hook for fetching user sessions
export const useUserSessions = () => {
  return useQuery({
    queryKey: ['userSessions'],
    queryFn: fetchUserSessions,
  });
};

// Mutation hook for booking a session
export const useBookSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      mentorId,
      title,
      description,
      date,
      startTime,
      endTime,
      price
    }: {
      mentorId: string;
      title: string;
      description: string;
      date: string;
      startTime: string;
      endTime: string;
      price: number;
    }) => bookMentorshipSession(mentorId, title, description, date, startTime, endTime, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      toast({
        title: "Session Booked",
        description: "Your mentorship session has been booked successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "There was an error booking your session",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for updating session status
export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      sessionId,
      status,
      meetingLink
    }: {
      sessionId: string;
      status: SessionStatus;
      meetingLink?: string;
    }) => updateSessionStatus(sessionId, status, meetingLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      toast({
        title: "Session Updated",
        description: "The session status has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "There was an error updating the session",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for submitting a review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      sessionId,
      rating,
      comment,
      isPublic
    }: {
      sessionId: string;
      rating: number;
      comment?: string;
      isPublic?: boolean;
    }) => submitSessionReview(sessionId, rating, comment, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your review",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for applying as a mentor
export const useApplyAsMentor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      bio,
      expertise,
      hourlyRate,
      yearsExperience
    }: {
      bio: string;
      expertise: ExpertiseCategory[];
      hourlyRate: number;
      yearsExperience: number;
    }) => applyAsMentor(bio, expertise, hourlyRate, yearsExperience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorStatus'] });
      toast({
        title: "Application Submitted",
        description: "Your mentor application has been submitted for review!",
      });
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for updating mentor profile
export const useUpdateMentorProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      bio,
      expertise,
      hourlyRate,
      yearsExperience
    }: {
      bio: string;
      expertise: ExpertiseCategory[];
      hourlyRate: number;
      yearsExperience: number;
    }) => updateMentorProfile(bio, expertise, hourlyRate, yearsExperience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorStatus'] });
      toast({
        title: "Profile Updated",
        description: "Your mentor profile has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "There was an error updating your profile",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for adding a mentor certification
export const useAddMentorCertification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialUrl,
      imageUrl
    }: {
      title: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      credentialUrl?: string;
      imageUrl?: string;
    }) => addMentorCertification(title, issuer, issueDate, expiryDate, credentialUrl, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] });
      toast({
        title: "Certification Added",
        description: "Your certification has been added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Addition Failed",
        description: error instanceof Error ? error.message : "There was an error adding your certification",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for updating mentor availability
export const useUpdateMentorAvailability = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (availabilitySlots: Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
      is_recurring: boolean;
    }>) => updateMentorAvailability(availabilitySlots),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorAvailability'] });
      toast({
        title: "Availability Updated",
        description: "Your availability has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "There was an error updating your availability",
        variant: "destructive",
      });
    }
  });
};

// Mutation hook for adding a date exception
export const useAddDateException = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      exceptionDate,
      isAvailable
    }: {
      exceptionDate: string;
      isAvailable: boolean;
    }) => addDateException(exceptionDate, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorDateExceptions'] });
      toast({
        title: "Exception Added",
        description: "Your date exception has been added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Addition Failed",
        description: error instanceof Error ? error.message : "There was an error adding your date exception",
        variant: "destructive",
      });
    }
  });
};
