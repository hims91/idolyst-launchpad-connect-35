
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import { FeedType } from '@/api/launchpad';
import useLaunchpadPosts from '@/hooks/useLaunchpadPosts';
import { Loader2, RefreshCw, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LaunchpadFeedProps {
  feedType: FeedType;
  category?: string;
}

const LaunchpadFeed: React.FC<LaunchpadFeedProps> = ({ feedType, category }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    posts, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh,
    updatePost 
  } = useLaunchpadPosts({ feedType, category });
  
  // Infinite scroll implementation
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Load more when bottom is reached
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);
  
  // State for back-to-top button
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  
  // Show back-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Show empty state for following feed when not logged in
  if (feedType === 'following' && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h3 className="text-xl font-semibold mb-4">Sign in to see posts from people you follow</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect with founders, mentors, and others in the startup ecosystem.
          </p>
          <Button 
            className="gradient-bg hover-scale"
            onClick={() => navigate('/auth/login')}
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }
  
  // Show loading state
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-10 w-10 text-idolyst-purple animate-spin" />
      </div>
    );
  }
  
  // Show error state
  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-red-500 mb-4">Failed to load posts</p>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={refresh}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  // Empty state when no posts
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {feedType === 'following' 
              ? "Follow more people to see their posts here." 
              : "Be the first to share something!"}
          </p>
          {user && (
            <Button 
              className="gradient-bg hover-scale"
              onClick={() => navigate('/')}
            >
              Explore Trending Posts
            </Button>
          )}
        </motion.div>
      </div>
    );
  }
  
  // Render posts
  return (
    <>
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index < 5 ? index * 0.1 : 0 // Stagger animation only for first few posts
              }}
            >
              <PostCard 
                post={post} 
                onUpdate={updatePost}
              />
            </motion.div>
          ))}
          
          {/* Loading more indicator */}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 text-idolyst-purple animate-spin" />
            </div>
          )}
          
          {/* End of results message */}
          {!hasMore && !loading && posts.length > 5 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>You've reached the end of the feed</p>
            </div>
          )}
          
          {/* Intersection observer reference element */}
          {hasMore && <div ref={ref} className="h-10" />}
        </div>
      </AnimatePresence>
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 md:bottom-10 right-6 z-50"
          >
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg gradient-bg hover-scale"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LaunchpadFeed;
