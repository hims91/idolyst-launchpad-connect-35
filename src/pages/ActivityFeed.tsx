
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ProfileActivity } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ActivityFeed = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ProfileActivity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [username, setUsername] = useState("");
  
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    // Reset page when filter changes
    setPage(1);
    setActivities([]);
    fetchActivities(1);
  }, [id, filter, sortBy]);
  
  useEffect(() => {
    // Fetch username for title
    const fetchUsername = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) setUsername(data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    
    fetchUsername();
  }, [id]);
  
  const fetchActivities = async (pageNum: number) => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      let query = supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', id);
      
      // Apply filtering
      if (filter !== 'all') {
        query = query.eq('type', filter);
      }
      
      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'popular') {
        query = query.order('likes', { ascending: false }).order('comments', { ascending: false });
      }
      
      // Apply pagination
      query = query
        .range((pageNum - 1) * ITEMS_PER_PAGE, pageNum * ITEMS_PER_PAGE - 1);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format data to match ProfileActivity type
      const formattedActivities: ProfileActivity[] = data.map(item => ({
        id: item.id,
        type: item.type as 'post' | 'pitch' | 'mentorship' | 'comment' | 'like',
        title: item.title,
        content: item.content || undefined,
        created_at: item.created_at,
        likes: item.likes || undefined,
        comments: item.comments || undefined
      }));
      
      if (pageNum === 1) {
        setActivities(formattedActivities);
      } else {
        setActivities(prev => [...prev, ...formattedActivities]);
      }
      
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        variant: "destructive",
        title: "Failed to load activities",
        description: "There was a problem loading the activity feed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchActivities(page + 1);
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
      case 'pitch':
        return <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      case 'mentorship':
        return <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'comment':
        return <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
      case 'like':
        return <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'post':
        return 'Posted in Launchpad';
      case 'pitch':
        return 'Submitted idea in PitchHub';
      case 'mentorship':
        return 'Mentorship session';
      case 'comment':
        return 'Added a comment';
      case 'like':
        return 'Liked content';
      default:
        return 'Activity';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <Layout>
      <Helmet>
        <title>{username ? `${username}'s Activity` : 'Activity Feed'} | Idolyst</title>
        <meta name="description" content={`View ${username ? `${username}'s` : ''} activity history on Idolyst platform.`} />
      </Helmet>
      
      <div className="max-w-4xl mx-auto pb-20 md:pb-10 px-4">
        <motion.div 
          className="flex items-center mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Link
            to={`/profile/${id}`}
            className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold gradient-text">
            {username ? `${username}'s Activity` : 'Activity Feed'}
          </h1>
        </motion.div>
        
        <motion.div 
          className="mb-6 flex flex-col md:flex-row gap-4 justify-between"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-idolyst-purple" />
              <span className="text-gray-700 dark:text-gray-300 mr-2">Filter:</span>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="pitch">Pitches</SelectItem>
                  <SelectItem value="mentorship">Mentorship</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="like">Likes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-idolyst-purple" />
              <span className="text-gray-700 dark:text-gray-300 mr-2">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
        
        <Card>
          <CardContent className="p-6">
            {loading && page === 1 ? (
              // Loading skeleton
              <div className="space-y-6">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              // Activity feed
              <motion.div 
                className="divide-y divide-gray-200 dark:divide-gray-700"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {activities.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    variants={staggerItem}
                    className="py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {activity.title}
                          </h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {getActivityTypeText(activity.type)}: {activity.content}
                        </p>
                        {(activity.likes !== undefined || activity.comments !== undefined) && (
                          <div className="flex gap-4 mt-3 text-sm text-gray-500">
                            {activity.likes !== undefined && (
                              <span className="flex items-center gap-1">
                                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                {activity.likes} likes
                              </span>
                            )}
                            {activity.comments !== undefined && (
                              <span className="flex items-center gap-1">
                                <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                {activity.comments} comments
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {hasMore && (
                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-idolyst-purple rounded-full border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4" />
                          Load More
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              // Empty state
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No activities found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {filter === 'all' 
                    ? "This user doesn't have any activity yet" 
                    : `No ${filter} activities found. Try a different filter.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ActivityFeed;
