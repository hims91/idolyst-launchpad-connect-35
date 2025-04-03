import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { getTypedSupabaseClient } from "@/lib/supabase-types";

// Get a typed Supabase client
const typedSupabase = getTypedSupabaseClient(supabase);

export type IdeaStage = 
  | 'ideation'
  | 'mvp' 
  | 'investment' 
  | 'pmf' 
  | 'go_to_market' 
  | 'growth' 
  | 'maturity';

export interface PitchIdea {
  id: string;
  user_id: string;
  title: string;
  problem_statement: string;
  target_group: string;
  solution: string;
  stage: IdeaStage;
  tags: string[];
  media_urls: string[] | null;
  is_premium: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
    id?: string;
    bio?: string;
  };
  vote_count?: number;
  user_vote?: 'upvote' | 'downvote' | null;
  feedback_count?: number;
  mentor_feedback_count?: number;
  feedback?: PitchFeedback[];
}

export interface PitchDraft {
  id: string;
  user_id: string;
  title: string | null;
  problem_statement: string | null;
  target_group: string | null;
  solution: string | null;
  stage: IdeaStage | null;
  tags: string[] | null;
  media_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PitchFeedback {
  id: string;
  pitch_id: string;
  user_id: string;
  content: string;
  is_mentor_feedback: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    full_name: string;
    avatar_url: string | null;
    is_mentor?: boolean;
    id?: string;
  };
}

export type FilterType = 'new' | 'top' | 'mentor';
export type TimeRange = 'week' | 'month' | 'all';

// Get all pitch ideas with various filters
export const getPitchIdeas = async (
  filter: FilterType = 'new',
  timeRange: TimeRange = 'all',
  tag?: string,
  page = 1,
  limit = 10,
  search?: string
) => {
  try {
    let query = typedSupabase
      .from('pitch_ideas')
      .select(`
        *,
        author:profiles!pitch_ideas_user_id_fkey(username, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    // Apply time range filter
    if (timeRange !== 'all') {
      const date = new Date();
      if (timeRange === 'week') {
        date.setDate(date.getDate() - 7);
      } else if (timeRange === 'month') {
        date.setMonth(date.getMonth() - 1);
      }
      query = query.gte('created_at', date.toISOString());
    }

    // Apply tag filter
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,problem_statement.ilike.%${search}%,solution.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    // Post-process to calculate vote counts and add user's vote if authenticated
    const processedData = await enrichPitchData(data || []);

    // Sort by votes if top filter is applied
    if (filter === 'top') {
      processedData.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }

    return processedData;
  } catch (error) {
    console.error('Error fetching pitch ideas:', error);
    toast({
      title: "Error fetching ideas",
      description: "Failed to load pitch ideas. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Get a single pitch idea by ID with detailed information
export const getPitchIdea = async (id: string) => {
  try {
    const { data, error } = await typedSupabase
      .from('pitch_ideas')
      .select(`
        *,
        author:profiles!pitch_ideas_user_id_fkey(id, username, full_name, avatar_url, bio)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Increment view count using RPC function
    await typedSupabase.rpc('increment_pitch_view', { id });

    // Get votes for this pitch
    const votesResponse = await typedSupabase
      .from('pitch_votes')
      .select('*')
      .eq('pitch_id', id);

    const feedbackResponse = await typedSupabase
      .from('pitch_feedback')
      .select(`
        *,
        author:profiles!pitch_feedback_user_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq('pitch_id', id)
      .order('is_mentor_feedback', { ascending: false })
      .order('created_at', { ascending: false });

    if (votesResponse.error) throw votesResponse.error;
    if (feedbackResponse.error) throw feedbackResponse.error;

    // Calculate vote counts
    const upvotes = votesResponse.data.filter(vote => vote.vote_type === 'upvote').length;
    const downvotes = votesResponse.data.filter(vote => vote.vote_type === 'downvote').length;
    const voteCount = upvotes - downvotes;

    // Check current user's vote
    const user = await typedSupabase.auth.getUser();
    let userVote = null;
    if (user.data.user) {
      const userVoteData = votesResponse.data.find(vote => vote.user_id === user.data.user?.id);
      if (userVoteData) {
        userVote = userVoteData.vote_type;
      }
    }

    // Enhanced feedback with author info and mentor status
    const enhancedFeedback = await Promise.all(
      feedbackResponse.data.map(async (feedback) => {
        // Check if the feedback author is a mentor
        const { data: roleData } = await typedSupabase
          .from('user_roles')
          .select('role')
          .eq('user_id', feedback.user_id)
          .eq('role', 'mentor')
          .maybeSingle();

        return {
          ...feedback,
          author: {
            ...feedback.author,
            is_mentor: !!roleData
          }
        } as PitchFeedback;
      })
    );

    return {
      ...data,
      vote_count: voteCount,
      user_vote: userVote,
      feedback: enhancedFeedback,
      feedback_count: enhancedFeedback.length,
      mentor_feedback_count: enhancedFeedback.filter(f => f.is_mentor_feedback).length
    } as PitchIdea;
  } catch (error) {
    console.error('Error fetching pitch idea:', error);
    toast({
      title: "Error fetching idea",
      description: "Failed to load the pitch idea. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Upload media for a pitch idea
export const uploadPitchMedia = async (file: File, userId: string) => {
  try {
    if (!userId) throw new Error('User not authenticated');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await typedSupabase.storage
      .from('pitch-media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL for the uploaded file
    const { data } = typedSupabase.storage
      .from('pitch-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading pitch media:', error);
    toast({
      title: "Error uploading media",
      description: "Failed to upload media file. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Create a new pitch idea
export const createPitchIdea = async (pitch: {
  title: string;
  problem_statement: string;
  target_group: string;
  solution: string;
  stage: IdeaStage;
  tags: string[];
  media_urls: string[] | null;
}) => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data, error } = await typedSupabase
      .from('pitch_ideas')
      .insert({
        user_id: user.data.user.id,
        title: pitch.title,
        problem_statement: pitch.problem_statement,
        target_group: pitch.target_group,
        solution: pitch.solution,
        stage: pitch.stage,
        tags: pitch.tags,
        media_urls: pitch.media_urls || []
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Idea submitted",
      description: "Your pitch idea has been successfully submitted!",
    });

    return data;
  } catch (error) {
    console.error('Error creating pitch idea:', error);
    toast({
      title: "Error submitting idea",
      description: "Failed to submit your pitch idea. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Save pitch as draft
export const savePitchDraft = async (draft: Partial<PitchDraft>) => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data, error } = await typedSupabase
      .from('pitch_drafts')
      .insert({
        user_id: user.data.user.id,
        title: draft.title || null,
        problem_statement: draft.problem_statement || null,
        target_group: draft.target_group || null,
        solution: draft.solution || null,
        stage: draft.stage || null,
        tags: draft.tags || [],
        media_urls: draft.media_urls || []
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Draft saved",
      description: "Your pitch idea has been saved as a draft.",
    });

    return data;
  } catch (error) {
    console.error('Error saving pitch draft:', error);
    toast({
      title: "Error saving draft",
      description: "Failed to save your draft. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Get user's pitch drafts
export const getUserDrafts = async () => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data, error } = await typedSupabase
      .from('pitch_drafts')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching pitch drafts:', error);
    toast({
      title: "Error fetching drafts",
      description: "Failed to load your draft ideas. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Vote on a pitch idea
export const votePitch = async (pitchId: string, voteType: 'upvote' | 'downvote') => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    // Check if user has already voted
    const { data: existingVote, error: checkError } = await typedSupabase
      .from('pitch_votes')
      .select('*')
      .eq('pitch_id', pitchId)
      .eq('user_id', user.data.user.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingVote) {
      // Update existing vote
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same button
        const { error: deleteError } = await typedSupabase
          .from('pitch_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) throw deleteError;
        return null;
      } else {
        // Change vote type
        const { data, error: updateError } = await typedSupabase
          .from('pitch_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return data;
      }
    } else {
      // Create new vote
      const { data, error: insertError } = await typedSupabase
        .from('pitch_votes')
        .insert({
          pitch_id: pitchId,
          user_id: user.data.user.id,
          vote_type: voteType
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      return data;
    }
  } catch (error) {
    console.error('Error voting on pitch:', error);
    toast({
      title: "Error voting",
      description: "Failed to register your vote. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Add feedback/comment to a pitch idea
export const addFeedback = async (pitchId: string, content: string) => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    // Check if user is a mentor
    const { data: mentorData, error: mentorError } = await typedSupabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.data.user.id)
      .eq('role', 'mentor')
      .maybeSingle();

    if (mentorError) throw mentorError;

    const isMentor = !!mentorData;

    const { data, error } = await typedSupabase
      .from('pitch_feedback')
      .insert({
        pitch_id: pitchId,
        user_id: user.data.user.id,
        content,
        is_mentor_feedback: isMentor
      })
      .select(`
        *,
        author:profiles!pitch_feedback_user_id_fkey(id, username, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    toast({
      title: isMentor ? "Mentor feedback added" : "Comment added",
      description: "Your feedback has been added to the pitch idea.",
    });

    return {
      ...data,
      author: {
        ...data.author,
        is_mentor: isMentor
      }
    } as PitchFeedback;
  } catch (error) {
    console.error('Error adding feedback:', error);
    toast({
      title: "Error adding feedback",
      description: "Failed to add your feedback. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Get top ideas for leaderboard
export const getLeaderboardIdeas = async (timeRange: TimeRange = 'week', limit = 10) => {
  try {
    // First get all ideas within the time range
    let query = typedSupabase
      .from('pitch_ideas')
      .select(`
        *,
        author:profiles!pitch_ideas_user_id_fkey(username, full_name, avatar_url)
      `);

    // Apply time range filter
    if (timeRange !== 'all') {
      const date = new Date();
      if (timeRange === 'week') {
        date.setDate(date.getDate() - 7);
      } else if (timeRange === 'month') {
        date.setMonth(date.getMonth() - 1);
      }
      query = query.gte('created_at', date.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process and sort by vote count
    const processedData = await enrichPitchData(data || []);
    processedData.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));

    return processedData.slice(0, limit);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    toast({
      title: "Error fetching leaderboard",
      description: "Failed to load the leaderboard. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Make a payment to boost a pitch idea
export const createPremiumPayment = async (pitchId: string, amount: number, paymentMethod: string) => {
  try {
    const user = await typedSupabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    // In a real app, you would integrate with PayPal/Razorpay here and get a payment ID
    const mockPaymentId = `payment_${uuidv4().substring(0, 8)}`;

    const { data, error } = await typedSupabase
      .from('pitch_payments')
      .insert({
        pitch_id: pitchId,
        user_id: user.data.user.id,
        amount,
        payment_method: paymentMethod,
        payment_id: mockPaymentId,
        payment_status: 'completed' // Simulating immediate completion
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Payment successful",
      description: "Your pitch has been boosted for premium visibility!",
    });

    return data;
  } catch (error) {
    console.error('Error processing payment:', error);
    toast({
      title: "Payment error",
      description: "Failed to process your payment. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Helper function to enrich pitch data with vote counts and user votes
const enrichPitchData = async (pitchIdeas: any[]) => {
  try {
    // Get current user
    const user = await typedSupabase.auth.getUser();
    const userId = user.data.user?.id;

    // Get all votes for these pitches
    const pitchIds = pitchIdeas.map(pitch => pitch.id);
    
    if (pitchIds.length === 0) return [];
    
    const { data: votesData, error: votesError } = await typedSupabase
      .from('pitch_votes')
      .select('*')
      .in('pitch_id', pitchIds);

    if (votesError) throw votesError;

    // Get all feedback for these pitches
    const { data: feedbackData, error: feedbackError } = await typedSupabase
      .from('pitch_feedback')
      .select('*')
      .in('pitch_id', pitchIds);

    if (feedbackError) throw feedbackError;

    // Process each pitch with its votes and feedback
    return pitchIdeas.map(pitch => {
      const pitchVotes = votesData.filter(vote => vote.pitch_id === pitch.id);
      const upvotes = pitchVotes.filter(vote => vote.vote_type === 'upvote').length;
      const downvotes = pitchVotes.filter(vote => vote.vote_type === 'downvote').length;
      const userVote = userId ? 
        pitchVotes.find(vote => vote.user_id === userId)?.vote_type : 
        null;
        
      const pitchFeedback = feedbackData.filter(feedback => feedback.pitch_id === pitch.id);
      const mentorFeedback = pitchFeedback.filter(feedback => feedback.is_mentor_feedback);
      
      return {
        ...pitch,
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
