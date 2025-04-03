
import { useState, useEffect } from 'react';
import { Post, FeedType, getPosts } from '@/api/launchpad';
import { toast } from '@/components/ui/use-toast';

interface UseLaunchpadPostsProps {
  feedType: FeedType;
  category?: string;
  limit?: number;
  initialPage?: number;
}

export const useLaunchpadPosts = ({
  feedType,
  category,
  limit = 10,
  initialPage = 1
}: UseLaunchpadPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const fetchedPosts = await getPosts(feedType, category, initialPage, limit);
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length === limit);
        setPage(initialPage);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [feedType, category, initialPage, limit]);

  // Function to load more posts
  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const morePosts = await getPosts(feedType, category, nextPage, limit);
      
      if (morePosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...morePosts]);
        setPage(nextPage);
        setHasMore(morePosts.length === limit);
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError(err instanceof Error ? err : new Error('Failed to load more posts'));
      toast({
        title: "Error",
        description: "Failed to load more posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the feed
  const refresh = async () => {
    setLoading(true);
    
    try {
      const freshPosts = await getPosts(feedType, category, initialPage, limit);
      setPosts(freshPosts);
      setHasMore(freshPosts.length === limit);
      setPage(initialPage);
      setError(null);
    } catch (err) {
      console.error("Error refreshing posts:", err);
      setError(err instanceof Error ? err : new Error('Failed to refresh posts'));
      toast({
        title: "Error",
        description: "Failed to refresh posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update a post in the state (e.g., after a reaction)
  const updatePost = (updatedPost: Post) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  // Function to add a post to the feed (e.g., after creating a new post)
  const addPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return { 
    posts, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh, 
    updatePost,
    addPost
  };
};

export default useLaunchpadPosts;
