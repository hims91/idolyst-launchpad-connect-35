
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getTypedSupabaseClient } from "@/lib/supabase-types";

// Create a typed supabase client
const typedSupabase = getTypedSupabaseClient(supabase);

// Types for Ascend module
export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  transaction_type: string;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
  expires_at?: string;
  is_used: boolean;
  used_at?: string;
  reward?: Reward;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  xp_cost: number;
  icon: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BadgeProgress {
  id: string;
  user_id: string;
  badge_id: string;
  current_progress: number;
  target_progress: number;
  created_at: string;
  updated_at: string;
  badge?: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
}

export interface LoginStreak {
  id: string;
  user_id: string;
  last_login_date: string;
  current_streak: number;
  max_streak: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  xp: number;
  weekly_rank: number;
  monthly_rank: number;
  weekly_change: number;
  monthly_change: number;
  snapshot_date: string;
  created_at: string;
  profile?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    level: number;
  };
}

export interface UserStats {
  xp: number;
  level: number;
  rank: number | null;
  rankChange: number;
  streakDays: number;
  badgesCount: number;
  nextLevelXp: number;
  progressToNextLevel: number;
}

// Function to get user stats
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    // Get user profile info
    const { data: profileData, error: profileError } = await typedSupabase
      .from('profiles')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profileData) return null;

    // Get user leaderboard rank
    const { data: leaderboardData, error: leaderboardError } = await typedSupabase
      .from('leaderboard_history')
      .select('weekly_rank, weekly_change')
      .eq('user_id', userId)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    // Get user streak info
    const { data: streakData, error: streakError } = await typedSupabase
      .from('login_streaks')
      .select('current_streak')
      .eq('user_id', userId)
      .single();

    // Get count of user badges
    const { count: badgesCount, error: badgesError } = await typedSupabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Calculate XP needed for next level
    const calculateNextLevelXp = (currentLevel: number) => {
      const nextLevel = currentLevel + 1;
      return nextLevel * nextLevel * 100; // Match the SQL function's formula
    };

    const nextLevelXp = calculateNextLevelXp(profileData.level);
    const currentLevelXp = (profileData.level) * (profileData.level) * 100;
    const progressToNextLevel = ((profileData.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

    return {
      xp: profileData.xp,
      level: profileData.level,
      rank: leaderboardError ? null : leaderboardData?.weekly_rank,
      rankChange: leaderboardError ? 0 : leaderboardData?.weekly_change || 0,
      streakDays: streakError ? 0 : streakData?.current_streak || 0,
      badgesCount: badgesError ? 0 : badgesCount || 0,
      nextLevelXp: nextLevelXp,
      progressToNextLevel: Math.max(0, Math.min(100, progressToNextLevel))
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    toast({
      title: "Error fetching stats",
      description: "Could not load your Ascend stats. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

// Function to get recent XP transactions
export const getRecentXpTransactions = async (userId: string, limit = 5): Promise<XpTransaction[]> => {
  try {
    const { data, error } = await typedSupabase
      .from('xp_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching XP transactions:', error);
    return [];
  }
};

// Function to get user badges with progress
export const getUserBadgesWithProgress = async (userId: string): Promise<any[]> => {
  try {
    // Get user's earned badges
    const { data: userBadges, error: badgesError } = await typedSupabase
      .from('user_badges')
      .select(`
        id,
        badge_id,
        earned_at,
        badges (
          id,
          name,
          description,
          icon
        )
      `)
      .eq('user_id', userId);

    if (badgesError) throw badgesError;

    // Get badge progress for badges not yet earned
    // Fixed query to handle the relationship properly
    const { data: badgeProgress, error: progressError } = await typedSupabase
      .from('badge_progress')
      .select(`
        id,
        badge_id,
        current_progress,
        target_progress
      `)
      .eq('user_id', userId);

    if (progressError) throw progressError;

    // Get badges for the badge progress
    const badgeIds = badgeProgress?.map(progress => progress.badge_id) || [];
    let badgeDetails: any[] = [];
    
    if (badgeIds.length > 0) {
      const { data: badges, error: badgesDetailError } = await typedSupabase
        .from('badges')
        .select('id, name, description, icon')
        .in('id', badgeIds);
        
      if (!badgesDetailError) {
        badgeDetails = badges || [];
      }
    }

    // Combine earned badges with badge details
    const earnedBadges = (userBadges || []).map(badge => ({
      id: badge.badges?.id || badge.badge_id,
      name: badge.badges?.name || 'Unknown Badge',
      description: badge.badges?.description || '',
      icon: badge.badges?.icon || '',
      earnedAt: badge.earned_at,
      isEarned: true,
      progress: 100,
      progressPercent: 100
    }));

    // Combine progress badges with badge details
    const inProgressBadges = (badgeProgress || []).map(progress => {
      const badgeDetail = badgeDetails.find(b => b.id === progress.badge_id);
      return {
        id: progress.badge_id,
        name: badgeDetail?.name || 'Unknown Badge',
        description: badgeDetail?.description || '',
        icon: badgeDetail?.icon || '',
        isEarned: false,
        progress: progress.current_progress,
        target: progress.target_progress,
        progressPercent: Math.round((progress.current_progress / progress.target_progress) * 100)
      };
    });

    return [...earnedBadges, ...inProgressBadges];
  } catch (error) {
    console.error('Error fetching user badges with progress:', error);
    return [];
  }
};

// Function to get available rewards
export const getAvailableRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await typedSupabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('xp_cost', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available rewards:', error);
    return [];
  }
};

// Function to get user's claimed rewards
export const getUserRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    const { data: userRewards, error: userRewardsError } = await typedSupabase
      .from('user_rewards')
      .select(`
        id,
        user_id,
        reward_id,
        claimed_at,
        expires_at,
        is_used,
        used_at
      `)
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false });

    if (userRewardsError) throw userRewardsError;
    
    // Get the reward details for each user reward
    const rewardIds = userRewards?.map(reward => reward.reward_id) || [];
    let rewardDetails: any[] = [];
    
    if (rewardIds.length > 0) {
      const { data: rewards, error: rewardsError } = await typedSupabase
        .from('rewards')
        .select('*')
        .in('id', rewardIds);
        
      if (!rewardsError) {
        rewardDetails = rewards || [];
      }
    }
    
    // Combine user rewards with reward details
    const userRewardsWithDetails = (userRewards || []).map(userReward => {
      const rewardDetail = rewardDetails.find(r => r.id === userReward.reward_id);
      return {
        ...userReward,
        reward: rewardDetail
      };
    });
    
    return userRewardsWithDetails;
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return [];
  }
};

// Function to claim a reward
export const claimReward = async (userId: string, rewardId: string): Promise<boolean> => {
  try {
    // Get the reward to check XP cost
    const { data: rewardData, error: rewardError } = await typedSupabase
      .from('rewards')
      .select('xp_cost, name')
      .eq('id', rewardId)
      .single();

    if (rewardError) throw rewardError;
    if (!rewardData) throw new Error('Reward not found');

    // Get user's current XP
    const { data: userData, error: userError } = await typedSupabase
      .from('profiles')
      .select('xp')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    // Check if user has enough XP
    if (userData.xp < rewardData.xp_cost) {
      toast({
        title: "Not enough XP",
        description: `You need ${rewardData.xp_cost - userData.xp} more XP to claim this reward.`,
        variant: "destructive"
      });
      return false;
    }

    // Begin transaction
    // 1. Deduct XP from user
    const { error: updateError } = await typedSupabase
      .from('profiles')
      .update({ xp: userData.xp - rewardData.xp_cost })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 2. Record XP transaction
    const { error: transactionError } = await typedSupabase
      .from('xp_transactions')
      .insert({
        user_id: userId,
        amount: -rewardData.xp_cost,
        description: `Claimed reward: ${rewardData.name}`,
        transaction_type: 'reward_claim',
        reference_type: 'reward',
        reference_id: rewardId
      });

    if (transactionError) throw transactionError;

    // 3. Create user reward record
    const { error: rewardClaimError } = await typedSupabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        // Set expiry date to 30 days from now if applicable
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (rewardClaimError) throw rewardClaimError;

    toast({
      title: "Reward Claimed!",
      description: "You have successfully claimed your reward.",
      variant: "default"
    });

    return true;
  } catch (error) {
    console.error('Error claiming reward:', error);
    toast({
      title: "Error claiming reward",
      description: "There was an error claiming your reward. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

// Function to get leaderboard data
export const getLeaderboard = async (timeRange: 'week' | 'month' | 'all' = 'week'): Promise<LeaderboardEntry[]> => {
  try {
    // Get the latest snapshot date from leaderboard history
    const { data: latestSnapshot, error: snapshotError } = await typedSupabase
      .from('leaderboard_history')
      .select('snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    if (snapshotError) {
      console.error('Error fetching latest snapshot date:', snapshotError);
      // Fallback to getting top users directly from profiles
      const { data: profilesData, error: profilesError } = await typedSupabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, xp, level')
        .order('xp', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      // Format data to match leaderboard entry structure
      return (profilesData || []).map((profile, index) => ({
        id: profile.id, // Using profile ID as a substitute for entry ID
        user_id: profile.id,
        xp: profile.xp,
        weekly_rank: index + 1,
        monthly_rank: index + 1,
        weekly_change: 0,
        monthly_change: 0,
        snapshot_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        profile: {
          id: profile.id,
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          level: profile.level
        }
      }));
    }

    // Get leaderboard entries with user profiles
    const { data: leaderboardData, error: leaderboardError } = await typedSupabase
      .from('leaderboard_history')
      .select(`
        id,
        user_id,
        xp,
        weekly_rank,
        monthly_rank,
        weekly_change,
        monthly_change,
        snapshot_date,
        created_at
      `)
      .eq('snapshot_date', latestSnapshot.snapshot_date)
      .order(timeRange === 'week' ? 'weekly_rank' : 'monthly_rank', { ascending: true })
      .limit(50);

    if (leaderboardError) throw leaderboardError;
    
    // Fetch profiles separately and join them manually
    const userIds = leaderboardData?.map(entry => entry.user_id) || [];
    let profilesData: any[] = [];
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await typedSupabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, level')
        .in('id', userIds);
        
      if (!profilesError) {
        profilesData = profiles || [];
      }
    }
    
    // Join leaderboard data with profiles
    const leaderboardWithProfiles = (leaderboardData || []).map(entry => {
      const profile = profilesData.find(p => p.id === entry.user_id);
      return {
        ...entry,
        profile
      };
    });

    return leaderboardWithProfiles;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};

// Function to update login streak
export const updateLoginStreak = async (userId: string): Promise<void> => {
  try {
    // Call the RPC function to update the login streak
    const { error } = await typedSupabase.rpc('update_login_streak', { user_id_param: userId });
    
    if (error) {
      console.error('Error updating login streak via RPC:', error);
      
      // Fallback: update streak directly
      // Check if a streak record exists
      const { data: streakData } = await typedSupabase
        .from('login_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (streakData) {
        // Update existing streak
        await typedSupabase
          .from('login_streaks')
          .update({
            last_login_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new streak
        await typedSupabase
          .from('login_streaks')
          .insert({
            user_id: userId,
            last_login_date: new Date().toISOString().split('T')[0],
            current_streak: 1,
            max_streak: 1
          });
      }
    }
  } catch (error) {
    console.error('Error updating login streak:', error);
  }
};
