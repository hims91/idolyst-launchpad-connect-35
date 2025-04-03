
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPitchIdeas, 
  getPitchIdea,
  getLeaderboardIdeas, 
  votePitch,
  addFeedback,
  FilterType,
  TimeRange,
  PitchIdea 
} from '@/api/pitch';
import { useAuth } from '@/providers/AuthProvider'; // Correct import path for consistency

export const usePitchIdeas = (
  filter: FilterType = 'new',
  timeRange: TimeRange = 'all',
  tag?: string,
  search?: string
) => {
  const [page, setPage] = useState(1);
  
  const { 
    data: ideas,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['pitchIdeas', filter, timeRange, tag, search, page],
    queryFn: () => getPitchIdeas(filter, timeRange, tag, page, 10, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry twice for better resilience
  });

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return {
    ideas: ideas || [],
    isLoading,
    isError,
    error,
    refetch,
    page,
    handleLoadMore
  };
};

export const usePitchIdea = (id: string) => {
  const queryClient = useQueryClient();
  
  const { 
    data: pitch,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['pitchIdea', id],
    queryFn: () => getPitchIdea(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once to avoid too many failed requests
    enabled: !!id, // Only run query if id is provided
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ pitchId, voteType }: { pitchId: string; voteType: 'upvote' | 'downvote' }) => 
      votePitch(pitchId, voteType),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['pitchIdea', id]
      });
    }
  });

  // Feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: ({ pitchId, content }: { pitchId: string; content: string }) => 
      addFeedback(pitchId, content),
    onSuccess: (newFeedback) => {
      // Update the cache without refetching
      if (newFeedback && pitch) {
        queryClient.setQueryData(['pitchIdea', id], {
          ...pitch,
          feedback: [newFeedback, ...(pitch.feedback || [])],
          feedback_count: (pitch.feedback_count || 0) + 1,
          mentor_feedback_count: newFeedback.is_mentor_feedback 
            ? (pitch.mentor_feedback_count || 0) + 1 
            : (pitch.mentor_feedback_count || 0)
        });
      }
    }
  });

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (!id) return;
    voteMutation.mutate({ pitchId: id, voteType });
  };

  const handleAddFeedback = (content: string) => {
    if (!id) return;
    feedbackMutation.mutate({ pitchId: id, content });
  };

  return {
    pitch,
    isLoading,
    isError,
    error,
    refetch,
    handleVote,
    handleAddFeedback,
    isVoting: voteMutation.isPending,
    isAddingFeedback: feedbackMutation.isPending
  };
};

export const useLeaderboard = (timeRange: TimeRange = 'week') => {
  const { 
    data: leaderboard,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['leaderboard', timeRange],
    queryFn: () => getLeaderboardIdeas(timeRange),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry a couple times
    onError: (error) => {
      console.error('Error fetching leaderboard:', error);
    }
  });

  return {
    leaderboard: leaderboard || [],
    isLoading,
    isError,
    error,
    refetch
  };
};

// Hook for analytics data for a pitch idea
export const usePitchAnalytics = (pitch?: PitchIdea) => {
  // Calculate analytics data from pitch
  const analyticsData = useMemo(() => {
    if (!pitch) return null;
    
    return {
      views: pitch.views_count || 0,
      votes: pitch.vote_count || 0,
      feedbackCount: pitch.feedback_count || 0,
      mentorFeedbackCount: pitch.mentor_feedback_count || 0,
      // For a real app, we would have more historical data here
      // This is simplified for demonstration purposes
      viewsPerDay: Math.round((pitch.views_count || 0) / 7), //假设有7天的数据
      votesPerDay: Math.round((pitch.vote_count || 0) / 7)
    };
  }, [pitch]);

  return {
    analytics: analyticsData
  };
};

export const usePitchTags = () => {
  // This would normally be fetched from the server based on popularity
  const popularTags = [
    'AI', 'Blockchain', 'SaaS', 'Fintech', 'Mobile', 'Healthcare', 
    'Education', 'Gaming', 'Environment', 'B2B', 'B2C', 'Data', 
    'Social', 'E-commerce', 'PropTech', 'Marketplace'
  ];
  
  return {
    popularTags
  };
};
