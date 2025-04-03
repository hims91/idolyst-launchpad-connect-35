
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileActivity } from '@/types/profile';
import { toast } from '@/hooks/use-toast';

interface UseProfileActivityParams {
  userId: string;
  initialLimit?: number;
}

interface UseProfileActivityReturn {
  activities: ProfileActivity[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  filterActivities: (type: string) => void;
  currentFilter: string;
}

export const useProfileActivity = ({
  userId,
  initialLimit = 5
}: UseProfileActivityParams): UseProfileActivityReturn => {
  const [activities, setActivities] = useState<ProfileActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentLimit, setCurrentLimit] = useState<number>(initialLimit);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  
  const fetchActivities = async (limit: number, filter: string = 'all') => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // Apply filtering if not 'all'
      if (filter !== 'all') {
        query = query.eq('type', filter);
      }
      
      const { data, error: supabaseError } = await query;
      
      if (supabaseError) throw supabaseError;
      
      // Shape the data to match the ProfileActivity type
      const formattedActivities: ProfileActivity[] = data.map(item => ({
        id: item.id,
        type: item.type as 'post' | 'pitch' | 'mentorship' | 'comment' | 'like',
        title: item.title,
        content: item.content || undefined,
        created_at: item.created_at,
        likes: item.likes || undefined,
        comments: item.comments || undefined
      }));
      
      setActivities(formattedActivities);
      setHasMore(data.length === limit); // If we got less items than requested, there are no more
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        variant: "destructive",
        title: "Failed to load activities",
        description: "There was a problem loading your activities. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchActivities(currentLimit, currentFilter);
  }, [userId, currentLimit, currentFilter]);
  
  // Load more function
  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setCurrentLimit(prevLimit => prevLimit + initialLimit);
  };
  
  // Filter function
  const filterActivities = (type: string) => {
    setCurrentFilter(type);
    setCurrentLimit(initialLimit);
  };
  
  return {
    activities,
    isLoading,
    error,
    hasMore,
    loadMore,
    filterActivities,
    currentFilter
  };
};
