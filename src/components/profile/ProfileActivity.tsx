
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ExtendedProfile } from "@/types/profile";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";

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

const ProfileActivity = ({ profile }: ProfileActivityProps) => {
  const [currentTab, setCurrentTab] = useState("all");
  const [activities, setActivities] = useState<any[]>(profile.recent_activity);
  
  // Filter activities based on tab
  const filteredActivities = currentTab === 'all' ? 
    activities : 
    activities.filter(activity => activity.type === currentTab);

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

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="post">Posts</TabsTrigger>
          <TabsTrigger value="pitch">Pitches</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-center py-6 text-gray-500">No {currentTab === 'all' ? 'recent' : currentTab} activity to show</p>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileActivity;
