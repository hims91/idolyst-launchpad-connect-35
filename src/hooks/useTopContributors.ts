
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '@/types/profile';

export interface Contributor extends Partial<ExtendedProfile> {
  contribution_points: number;
  contribution_type?: string;
}

export const useTopContributors = (limit = 5) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setIsLoading(true);
        
        // Get users with the most XP as a proxy for contributions
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, xp, level')
          .order('xp', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        // Transform to contributor format
        const topContributors = data.map(profile => ({
          ...profile,
          contribution_points: profile.xp || 0,
          contribution_type: 'overall'
        }));
        
        setContributors(topContributors);
      } catch (err) {
        console.error('Error fetching top contributors:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch top contributors'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContributors();
  }, [limit]);

  return { contributors, isLoading, error };
};

export default useTopContributors;
