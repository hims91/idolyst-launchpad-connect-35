
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  Filter, 
  Heart, 
  MessageSquare, 
  RefreshCw, 
  User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchExtendedProfile } from "@/api/profile";
import { ProfileActivity } from "@/types/profile";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const ActivityFeed = () => {
  const { id } = useParams<{ id: string }>();
  
  const [username, setUsername] = useState<string>("");
  const [activities, setActivities] = useState<ProfileActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    loadProfile();
  }, [id]);
  
  const loadProfile = async () => {
    if (!id) return;
    
    setLoading(true);
    const profile = await fetchExtendedProfile(id);
    
    if (profile) {
      setUsername(profile.username || "User");
      setActivities(profile.recent_activity || []);
    }
    
    // In a real implementation, you would load more activities via a dedicated endpoint
    // For now, just using the recent_activity from the profile
    
    setLoading(false);
    setHasMore(false); // For demo, no more data to load
  };
  
  const loadMore = async () => {
    setPage(prev => prev + 1);
    
    // In a real implementation, you would load more activities via API
    // For now, just simulating a load
    
    // Set hasMore to false when there's no more data to load
    setHasMore(false);
  };
  
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
    
    // In a real implementation, you would reload data with the new filter
  };
  
  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div>
            <h1 className="text-2xl font-bold gradient-text">Activity Feed</h1>
            {username && (
              <p className="text-gray-500">
                Recent activity for {username}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => loadProfile()}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filter
              <Badge variant="secondary" className="ml-1">
                {filter === "all" ? "All" : filter}
              </Badge>
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "post" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("post")}
            >
              Posts
            </Button>
            <Button 
              variant={filter === "pitch" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("pitch")}
            >
              Pitches
            </Button>
            <Button 
              variant={filter === "mentorship" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("mentorship")}
            >
              Mentorship
            </Button>
            <Button 
              variant={filter === "comment" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("comment")}
            >
              Comments
            </Button>
            <Button 
              variant={filter === "like" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("like")}
            >
              Likes
            </Button>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-idolyst-purple"></div>
            </div>
          ) : (
            <>
              {filteredActivities.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                  
                  {hasMore && (
                    <div className="pt-4 flex justify-center">
                      <Button onClick={loadMore} variant="outline">
                        Load More
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium">No activities found</h3>
                  <p className="text-gray-500">
                    {filter === "all" ? 
                      "There are no activities to display yet." : 
                      `There are no "${filter}" activities to display.`}
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

const ActivityItem = ({ activity }: { activity: ProfileActivity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'post':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'pitch':
        return <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      case 'mentorship':
        return <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-amber-500" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityTypeText = () => {
    switch (activity.type) {
      case 'post':
        return 'Posted';
      case 'pitch':
        return 'Submitted idea';
      case 'mentorship':
        return 'Mentorship session';
      case 'comment':
        return 'Commented';
      case 'like':
        return 'Liked';
      default:
        return 'Activity';
    }
  };

  const formattedDate = new Date(activity.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg border p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div className="mt-1">
          {getActivityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{activity.title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</span>
          </div>
          <Badge className="mt-1 mb-2">{getActivityTypeText()}</Badge>
          {activity.content && (
            <p className="text-gray-600 dark:text-gray-400 mt-1 mb-3">{activity.content}</p>
          )}
          {(activity.likes !== undefined || activity.comments !== undefined) && (
            <div className="flex gap-4 mt-3 text-sm text-gray-500">
              {activity.likes !== undefined && (
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-400" />
                  {activity.likes}
                </span>
              )}
              {activity.comments !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  {activity.comments}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
