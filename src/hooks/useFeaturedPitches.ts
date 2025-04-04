
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PitchIdea } from '@/api/pitch';

export const useFeaturedPitches = (limit = 3) => {
  const [pitches, setPitches] = useState<PitchIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedPitches = async () => {
      try {
        setIsLoading(true);
        
        // Get featured pitch ideas (highest view count as proxy for featured)
        const { data, error } = await supabase
          .from('pitch_ideas')
          .select(`
            id, 
            title, 
            problem_statement,
            views_count,
            user_id,
            created_at
          `)
          .order('views_count', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        // Get user info for each pitch
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(pitch => pitch.user_id))];
          
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', userIds);
          
          if (profilesError) throw profilesError;
          
          // Get vote counts for each pitch
          const { data: votes, error: votesError } = await supabase
            .from('pitch_votes')
            .select('pitch_id, vote_type')
            .in('pitch_id', data.map(pitch => pitch.id));
          
          if (votesError) throw votesError;
          
          // Calculate votes for each pitch
          const voteCountByPitch: Record<string, number> = {};
          votes?.forEach(vote => {
            if (!voteCountByPitch[vote.pitch_id]) {
              voteCountByPitch[vote.pitch_id] = 0;
            }
            voteCountByPitch[vote.pitch_id] += vote.vote_type === 'upvote' ? 1 : -1;
          });
          
          // Combine data
          const enhancedPitches = data.map(pitch => {
            const author = profiles?.find(profile => profile.id === pitch.user_id);
            return {
              ...pitch,
              author,
              vote_count: voteCountByPitch[pitch.id] || 0
            } as PitchIdea;
          });
          
          setPitches(enhancedPitches);
        } else {
          setPitches([]);
        }
      } catch (err) {
        console.error('Error fetching featured pitches:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch featured pitches'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedPitches();
  }, [limit]);

  return { pitches, isLoading, error };
};

export default useFeaturedPitches;
