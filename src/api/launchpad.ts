
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getTypedSupabaseClient } from "@/lib/supabase-types";
import { ExtendedProfile } from "@/types/profile";

// Create a typed supabase client
const typedSupabase = getTypedSupabaseClient(supabase);

// Types for Launchpad module
export type ReactionType = 'insightful' | 'fundable' | 'innovative' | 'collab_worthy' | 'like';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  category: string;
  tags: string[];
  media_url?: string | null;
  media_type?: string | null;
  url?: string | null;
  url_preview?: any | null;
  poll_data?: any | null;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  views_count: number;
  engagement_score: number;
  author?: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
  };
  reactions_count?: number;
  comments_count?: number;
  reposts_count?: number;
  shares_count?: number;
  saves_count?: number;
  user_reaction?: ReactionType | null;
  user_reposted?: boolean;
  user_saved?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  };
  replies?: Comment[];
}

export type FeedType = 'trending' | 'following' | 'latest';
export type SortOption = 'newest' | 'oldest' | 'most_engagement';

// Function to get posts with filters
export const getPosts = async (
  feedType: FeedType = 'trending',
  category?: string,
  page = 1,
  limit = 10,
  sort: SortOption = 'newest'
): Promise<Post[]> => {
  try {
    // Get the current user for personalized queries
    const { data: { user } } = await supabase.auth.getUser();
    
    // Set up the base query
    let query = typedSupabase
      .from('posts')
      .select('*');
    
    // Apply feed type filter
    if (feedType === 'trending') {
      query = query.eq('is_trending', true);
    } else if (feedType === 'following' && user) {
      const { data: followingData } = await typedSupabase
        .from('follows')
        .select('followed_id')
        .eq('follower_id', user.id);
      
      const followingIds = followingData?.map(follow => follow.followed_id) || [];
      
      // Add the user's own id to see their posts too
      followingIds.push(user.id);
      
      if (followingIds.length > 0) {
        query = query.in('user_id', followingIds);
      } else {
        // If not following anyone, return empty array
        return [];
      }
    }
    
    // Apply category filter if provided
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    // Apply sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'most_engagement') {
      query = query.order('engagement_score', { ascending: false });
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    query = query.range(from, to);
    
    // Execute the query
    const { data: posts, error } = await query;
    
    if (error) throw error;
    
    if (!posts || posts.length === 0) {
      return [];
    }
    
    // Get author profiles
    const userIds = [...new Set(posts.map(post => post.user_id))];
    const { data: profiles } = await typedSupabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .in('id', userIds);
    
    // Create a map for quick lookup
    const profilesMap = new Map();
    profiles?.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
    
    // Enrich posts with author and counts
    const enrichedPosts = await Promise.all(posts.map(async post => {
      // Get reaction count
      const { count: reactionsCount } = await typedSupabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      // Get comments count
      const { count: commentsCount } = await typedSupabase
        .from('post_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      // Get reposts count
      const { count: repostsCount } = await typedSupabase
        .from('post_reposts')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      // Get shares count
      const { count: sharesCount } = await typedSupabase
        .from('post_shares')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      // Get saves count
      const { count: savesCount } = await typedSupabase
        .from('post_saves')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);
      
      // Check user interactions if logged in
      let userReaction = null;
      let userReposted = false;
      let userSaved = false;
      
      if (user) {
        // Check if user reacted to this post
        const { data: reactionData } = await typedSupabase
          .from('post_reactions')
          .select('reaction_type')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (reactionData) {
          userReaction = reactionData.reaction_type;
        }
        
        // Check if user reposted this post
        const { data: repostData } = await typedSupabase
          .from('post_reposts')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        userReposted = !!repostData;
        
        // Check if user saved this post
        const { data: saveData } = await typedSupabase
          .from('post_saves')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        userSaved = !!saveData;
      }
      
      return {
        ...post,
        author: profilesMap.get(post.user_id),
        reactions_count: reactionsCount || 0,
        comments_count: commentsCount || 0,
        reposts_count: repostsCount || 0,
        shares_count: sharesCount || 0,
        saves_count: savesCount || 0,
        user_reaction: userReaction,
        user_reposted: userReposted,
        user_saved: userSaved
      };
    }));
    
    return enrichedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    toast({
      title: "Error",
      description: "Failed to load posts. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Function to get a single post by ID
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    // Get the post
    const { data: post, error } = await typedSupabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    if (!post) return null;
    
    // Get the post author
    const { data: author, error: authorError } = await typedSupabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', post.user_id)
      .single();
    
    if (authorError) throw authorError;
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get counts and user interactions
    const { count: reactionsCount } = await typedSupabase
      .from('post_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    const { count: commentsCount } = await typedSupabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    const { count: repostsCount } = await typedSupabase
      .from('post_reposts')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    const { count: sharesCount } = await typedSupabase
      .from('post_shares')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    const { count: savesCount } = await typedSupabase
      .from('post_saves')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    // Check user interactions if logged in
    let userReaction = null;
    let userReposted = false;
    let userSaved = false;
    
    if (user) {
      // Check if user reacted to this post
      const { data: reactionData } = await typedSupabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (reactionData) {
        userReaction = reactionData.reaction_type;
      }
      
      // Check if user reposted this post
      const { data: repostData } = await typedSupabase
        .from('post_reposts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      userReposted = !!repostData;
      
      // Check if user saved this post
      const { data: saveData } = await typedSupabase
        .from('post_saves')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      userSaved = !!saveData;
    }
    
    // Increment view count
    await typedSupabase
      .from('posts')
      .update({ views_count: post.views_count + 1 })
      .eq('id', postId);
    
    return {
      ...post,
      author,
      reactions_count: reactionsCount || 0,
      comments_count: commentsCount || 0,
      reposts_count: repostsCount || 0,
      shares_count: sharesCount || 0,
      saves_count: savesCount || 0,
      user_reaction: userReaction,
      user_reposted: userReposted,
      user_saved: userSaved
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    toast({
      title: "Error",
      description: "Failed to load post. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to create a new post
export const createPost = async (
  content: string,
  category: string,
  tags: string[] = [],
  mediaUrl?: string,
  mediaType?: string,
  url?: string,
  urlPreview?: any,
  pollData?: any
): Promise<Post | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return null;
    }
    
    // Create the post
    const { data: post, error } = await typedSupabase
      .from('posts')
      .insert({
        user_id: user.id,
        content,
        category,
        tags,
        media_url: mediaUrl,
        media_type: mediaType,
        url,
        url_preview: urlPreview,
        poll_data: pollData
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Your post has been published!",
    });
    
    // Get author info
    const { data: author } = await typedSupabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', user.id)
      .single();
    
    return {
      ...post,
      author: author || undefined,
      reactions_count: 0,
      comments_count: 0,
      reposts_count: 0,
      shares_count: 0,
      saves_count: 0,
      user_reaction: null,
      user_reposted: false,
      user_saved: false
    };
  } catch (error) {
    console.error("Error creating post:", error);
    toast({
      title: "Error",
      description: "Failed to create post. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to upload media for a post
export const uploadPostMedia = async (file: File): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload media",
        variant: "destructive",
      });
      return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('post-media')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('post-media')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading media:", error);
    toast({
      title: "Error",
      description: "Failed to upload media. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to handle post reactions
export const reactToPost = async (
  postId: string,
  reactionType: ReactionType
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to react to posts",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if user already reacted with this reaction type
    const { data: existingReaction, error: checkError } = await typedSupabase
      .from('post_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingReaction) {
      // Remove reaction if already exists
      const { error: deleteError } = await typedSupabase
        .from('post_reactions')
        .delete()
        .eq('id', existingReaction.id);
      
      if (deleteError) throw deleteError;
      return false; // Reaction was removed
    } else {
      // Add new reaction
      const { error: insertError } = await typedSupabase
        .from('post_reactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType
        });
      
      if (insertError) throw insertError;
      return true; // Reaction was added
    }
  } catch (error) {
    console.error("Error reacting to post:", error);
    toast({
      title: "Error",
      description: "Failed to save your reaction. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to repost
export const repostPost = async (postId: string, comment?: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to repost",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if already reposted
    const { data: existingRepost, error: checkError } = await typedSupabase
      .from('post_reposts')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingRepost) {
      // Remove repost if already exists
      const { error: deleteError } = await typedSupabase
        .from('post_reposts')
        .delete()
        .eq('id', existingRepost.id);
      
      if (deleteError) throw deleteError;
      toast({
        title: "Repost removed",
        description: "This post has been removed from your profile.",
      });
      return false; // Repost was removed
    } else {
      // Add new repost
      const { error: insertError } = await typedSupabase
        .from('post_reposts')
        .insert({
          post_id: postId,
          user_id: user.id,
          comment: comment
        });
      
      if (insertError) throw insertError;
      toast({
        title: "Reposted",
        description: "This post has been shared on your profile.",
      });
      return true; // Repost was added
    }
  } catch (error) {
    console.error("Error reposting:", error);
    toast({
      title: "Error",
      description: "Failed to repost. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to save a post
export const savePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save posts",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if already saved
    const { data: existingSave, error: checkError } = await typedSupabase
      .from('post_saves')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingSave) {
      // Remove save if already exists
      const { error: deleteError } = await typedSupabase
        .from('post_saves')
        .delete()
        .eq('id', existingSave.id);
      
      if (deleteError) throw deleteError;
      toast({
        title: "Removed from saved",
        description: "Post has been removed from your saved items.",
      });
      return false; // Save was removed
    } else {
      // Add new save
      const { error: insertError } = await typedSupabase
        .from('post_saves')
        .insert({
          post_id: postId,
          user_id: user.id
        });
      
      if (insertError) throw insertError;
      toast({
        title: "Saved",
        description: "Post has been saved to your profile.",
      });
      return true; // Save was added
    }
  } catch (error) {
    console.error("Error saving post:", error);
    toast({
      title: "Error",
      description: "Failed to save post. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Function to share a post
export const sharePost = async (postId: string, platform: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // For sharing, we don't require login but just don't track it
      return true;
    }
    
    // Record the share
    const { error: insertError } = await typedSupabase
      .from('post_shares')
      .insert({
        post_id: postId,
        user_id: user.id,
        platform: platform
      });
    
    if (insertError) throw insertError;
    return true;
  } catch (error) {
    console.error("Error recording share:", error);
    // Don't show toast for this as it's not critical
    return false;
  }
};

// Function to add a comment
export const addComment = async (
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return null;
    }
    
    // Create the comment
    const { data: comment, error } = await typedSupabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
        parent_id: parentId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Get author info
    const { data: author } = await typedSupabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', user.id)
      .single();
    
    toast({
      title: "Comment added",
      description: parentId ? "Your reply has been posted." : "Your comment has been posted.",
    });
    
    return {
      ...comment,
      author: author || undefined,
      replies: []
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    toast({
      title: "Error",
      description: "Failed to post your comment. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to get comments for a post
export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    // Get all comments for this post
    const { data: comments, error } = await typedSupabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    if (!comments || comments.length === 0) {
      return [];
    }
    
    // Get author profiles
    const userIds = [...new Set(comments.map(comment => comment.user_id))];
    const { data: profiles } = await typedSupabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);
    
    // Create a map for quick lookup
    const profilesMap = new Map();
    profiles?.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
    
    // Group comments as a tree structure (parent comments and replies)
    const commentMap = new Map();
    const rootComments: Comment[] = [];
    
    // First pass: add all comments to the map
    comments.forEach(comment => {
      const enrichedComment: Comment = {
        ...comment,
        author: profilesMap.get(comment.user_id),
        replies: []
      };
      commentMap.set(comment.id, enrichedComment);
    });
    
    // Second pass: add replies to parent comments
    comments.forEach(comment => {
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        const parentComment = commentMap.get(comment.parent_id);
        parentComment.replies!.push(commentMap.get(comment.id));
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });
    
    return rootComments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    toast({
      title: "Error",
      description: "Failed to load comments. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Get list of available categories
export const getCategories = (): string[] => {
  return [
    "All",
    "Funding",
    "Startup News",
    "Growth",
    "Networking",
    "Product Launch",
    "Tech",
    "Hiring",
    "Advice",
    "Success Stories",
    "Challenges",
    "Events"
  ];
};
