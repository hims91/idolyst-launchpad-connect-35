
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import { Bell, Check, Settings } from "lucide-react";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { 
    groupedNotifications, 
    loading, 
    markAsRead, 
    removeNotification,
    markAllAsRead
  } = useNotifications();
  
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    await markAllAsRead();
    setIsMarkingAll(false);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
              <Bell className="h-12 w-12 text-idolyst-purple" />
            </div>
            
            <h1 className="text-3xl font-bold gradient-text mb-4">Notifications</h1>
            <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
              Stay updated with activity related to your posts, pitches, mentorship sessions, and more.
            </p>
            
            <Button asChild className="gradient-bg hover:scale-105 transition-transform text-lg py-6 px-8">
              <Link to="/auth/login">
                <Bell className="mr-2 h-5 w-5" />
                Sign In to View
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        className="max-w-2xl mx-auto pb-20 md:pb-0"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Notifications</h1>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading || isMarkingAll || groupedNotifications.length === 0}
              className="flex items-center text-sm transition-all hover:scale-105"
            >
              <Check className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
            
            <Button asChild size="sm" variant="ghost" className="transition-all hover:scale-105">
              <Link to="/settings#notifications">
                <Settings className="h-4 w-4 transition-transform hover:rotate-90" />
                <span className="sr-only md:not-sr-only md:ml-2">Settings</span>
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : groupedNotifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <AnimatePresence>
            <motion.div variants={staggerContainer}>
              {groupedNotifications.map((group) => (
                <div key={group.date} className="mb-8">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {group.title}
                  </h2>
                  <motion.div variants={staggerItem}>
                    <AnimatePresence>
                      {group.notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onDelete={removeNotification}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </Layout>
  );
};

export default Notifications;
