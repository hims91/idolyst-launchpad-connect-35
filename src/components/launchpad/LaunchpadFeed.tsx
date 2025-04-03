
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import PostCard from "./PostCard";
import EmptyState from "../shared/EmptyState";
import { getPosts, FeedType, Post } from "@/api/launchpad";

interface LaunchpadFeedProps {
  feedType: FeedType;
  category?: string;
}

const LaunchpadFeed = ({ feedType, category }: LaunchpadFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Setup IntersectionObserver for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Fetch posts when component mounts or when feed type changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const fetchedPosts = await getPosts(feedType, category, 1);
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length === 10); // If we get back 10 posts, there may be more
        setPage(1);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [feedType, category]);
  
  // Load more posts when the user scrolls down
  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        
        try {
          const nextPage = page + 1;
          const morePosts = await getPosts(feedType, category, nextPage);
          
          if (morePosts.length === 0) {
            setHasMore(false);
          } else {
            setPosts(prevPosts => [...prevPosts, ...morePosts]);
            setPage(nextPage);
            setHasMore(morePosts.length === 10);
          }
        } catch (error) {
          console.error("Error loading more posts:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadMorePosts();
  }, [inView, hasMore, page, loading, feedType, category]);
  
  // Handle post update (e.g. after a reaction)
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };
  
  // Empty state
  if (!loading && posts.length === 0) {
    return (
      <EmptyState 
        title={feedType === 'following' ? "No posts from people you follow" : "No posts yet"}
        description={feedType === 'following' ? "Follow users to see their posts here" : "Be the first one to post!"}
        actionText="Create a post"
        actionLink="#create-post"
        icon="post"
      />
    );
  }
  
  return (
    <div className="space-y-4 pb-20">
      <AnimatePresence initial={false}>
        {posts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <PostCard post={post} onUpdate={handlePostUpdate} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Loading indicator and infinite scroll trigger */}
      <div 
        ref={ref} 
        className="flex justify-center py-8"
      >
        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-idolyst-purple" />
            <span className="ml-2 text-sm text-idolyst-gray">Loading more posts...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchpadFeed;
