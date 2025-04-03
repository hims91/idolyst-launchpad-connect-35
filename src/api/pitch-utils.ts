

import { supabase } from "@/integrations/supabase/client";
import { PitchIdea, PitchFeedback } from '@/api/pitch';

// Helper function to enrich pitch data with vote counts and user votes
export const enrichPitchData = async (pitchIdeas: any[]): Promise<PitchIdea[]> => {
  try {
    // Get current user
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    // If there are no pitches, return an empty array
    if (pitchIdeas.length === 0) return [];
    
    // Get all votes for these pitches
    const pitchIds = pitchIdeas.map(pitch => pitch.id);
    
    const { data: votesData, error: votesError } = await supabase
      .from('pitch_votes')
      .select('*')
      .in('pitch_id', pitchIds);

    if (votesError) throw votesError;

    // Get all feedback for these pitches
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('pitch_feedback')
      .select('*')
      .in('pitch_id', pitchIds);

    if (feedbackError) throw feedbackError;

    // Fetch author information for all pitches
    const userIds = [...new Set(pitchIdeas.map(pitch => pitch.user_id))];
    let authorProfiles = {};
    
    if (userIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
        
      if (profileError) {
        console.error('Error fetching author profiles:', profileError);
      } else if (profileData) {
        authorProfiles = profileData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Process each pitch with its votes, feedback, and author info
    return pitchIdeas.map(pitch => {
      const pitchVotes = votesData?.filter(vote => vote.pitch_id === pitch.id) || [];
      const upvotes = pitchVotes.filter(vote => vote.vote_type === 'upvote').length;
      const downvotes = pitchVotes.filter(vote => vote.vote_type === 'downvote').length;
      const userVote = userId ? 
        pitchVotes.find(vote => vote.user_id === userId)?.vote_type : 
        null;
        
      const pitchFeedback = feedbackData?.filter(feedback => feedback.pitch_id === pitch.id) || [];
      const mentorFeedback = pitchFeedback.filter(feedback => feedback.is_mentor_feedback);
      
      return {
        ...pitch,
        author: authorProfiles[pitch.user_id] || null,
        vote_count: upvotes - downvotes,
        user_vote: userVote,
        feedback_count: pitchFeedback.length,
        mentor_feedback_count: mentorFeedback.length
      } as PitchIdea;
    });
  } catch (error) {
    console.error('Error enriching pitch data:', error);
    return pitchIdeas as PitchIdea[];
  }
};

// Update the pitch_ideas query to use direct fields rather than JOINs
export const getPitchWithAuthor = async (id: string) => {
  try {
    // First, get the pitch details
    const { data: pitchData, error: pitchError } = await supabase
      .from('pitch_ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (pitchError) throw pitchError;
    if (!pitchData) return null;

    // Then get the author information separately
    const { data: authorData, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', pitchData.user_id)
      .single();

    if (authorError) {
      console.warn('Could not fetch author data:', authorError);
      // Don't fail the whole operation if we can't get author data
    }

    // Combine the pitch with its author
    return {
      ...pitchData,
      author: authorData || null
    };
  } catch (error) {
    console.error('Error fetching pitch with author:', error);
    throw error;
  }
};

// Manually increment view count instead of using RPC 
// (since the RPC function is not working in production)
export const incrementPitchView = async (id: string) => {
  try {
    // First get current view count
    const { data: currentData, error: getError } = await supabase
      .from('pitch_ideas')
      .select('views_count')
      .eq('id', id)
      .single();
      
    if (getError) {
      console.error('Error getting current view count:', getError);
      return;
    }
    
    // Increment the view count
    const { error: updateError } = await supabase
      .from('pitch_ideas')
      .update({ views_count: (currentData?.views_count || 0) + 1 })
      .eq('id', id);
      
    if (updateError) {
      console.error('Error updating view count:', updateError);
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};
