
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ExtendedProfile } from "@/types/profile";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MessageSquare, ThumbsUp, PlusCircle } from "lucide-react";
import { useProfileActivity } from "@/hooks/use-profile-activity";

interface ProfileActivityProps {
  profile: ExtendedProfile;
}

const ActivityItem = ({ activity }: { activity: any }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'post':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'pitch':
        return <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
      case 'mentorship':
        return <svg className="h-4 w-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'like':
        return <ThumbsUp className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
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
    year: 'numeric'
  });

  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getActivityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{activity.title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formattedDate}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getActivityTypeText()}: {activity.content}</p>
          {(activity.likes !== undefined || activity.comments !== undefined) && (
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              {activity.likes !== undefined && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {activity.likes}
                </span>
              )}
              {activity.comments !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
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

const ActivitySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-full mt-2 rounded" />
        <Skeleton className="h-4 w-3/4 mt-1 rounded" />
        <div className="flex gap-4 mt-2">
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const ProfileActivity = ({ profile }: ProfileActivityProps) => {
  const { 
    activities, 
    isLoading, 
    hasMore, 
    loadMore, 
    filterActivities,
    currentFilter 
  } = useProfileActivity({
    userId: profile.id,
    initialLimit: 5
  });

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
        <Button variant="ghost" asChild>
          <Link to={`/profile/${profile.id}/activity`} className="text-idolyst-purple">
            View All
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={currentFilter} onValueChange={filterActivities}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="pitch">Pitches</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentFilter} className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentFilter}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {isLoading ? (
                // Loading skeletons
                <>
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                </>
              ) : activities.length > 0 ? (
                // Activity items
                <>
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                  
                  {hasMore && (
                    <div className="flex justify-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => loadMore()}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        {isLoading ? (
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
                </>
              ) : (
                // Empty state
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    No {currentFilter === 'all' ? 'recent' : currentFilter} activity to show
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 mt-1">
                    Activities will appear here as they happen
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileActivity;
