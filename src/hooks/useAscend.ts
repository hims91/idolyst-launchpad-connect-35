
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  getUserStats,
  getRecentXpTransactions,
  getUserBadgesWithProgress,
  getAvailableRewards,
  getUserRewards,
  claimReward,
  getLeaderboard,
  updateLoginStreak,
  type UserStats,
  type XpTransaction,
  type Reward,
  type UserReward,
  type LeaderboardEntry
} from "@/api/ascend";

export const useUserStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return getUserStats(user.id);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentXpTransactions = (limit = 5) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['xpTransactions', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];
      return getRecentXpTransactions(user.id, limit);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserBadges = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userBadges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return getUserBadgesWithProgress(user.id);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAvailableRewards = () => {
  return useQuery({
    queryKey: ['availableRewards'],
    queryFn: async () => {
      return getAvailableRewards();
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserRewards = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRewards', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return getUserRewards(user.id);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useClaimReward = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user?.id) throw new Error('User is not authenticated');
      return claimReward(user.id, rewardId);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['xpTransactions'] });
    },
    onError: (error) => {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error claiming reward",
        description: "There was an error claiming your reward. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useLeaderboard = (timeRange: 'week' | 'month' | 'all' = 'week') => {
  return useQuery({
    queryKey: ['leaderboard', timeRange],
    queryFn: async () => {
      return getLeaderboard(timeRange);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useUpdateLoginStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User is not authenticated');
      return updateLoginStreak(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    }
  });
};
