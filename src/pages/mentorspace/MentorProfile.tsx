
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/mentorspace/EmptyState";
import { useMentorStatus } from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { Link } from "react-router-dom";

const MentorProfilePage = () => {
  const { data: mentorStatus, isLoading } = useMentorStatus();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0 px-4 flex justify-center py-20">
          <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }
  
  // If the user is not a mentor yet
  if (!mentorStatus) {
    return (
      <Layout>
        <Helmet>
          <title>Mentor Profile | Idolyst MentorSpace</title>
          <meta name="description" content="Become a mentor on Idolyst and share your expertise with others." />
          <link rel="canonical" href="/mentor-space/profile" />
        </Helmet>
        
        <motion.div 
          className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <EmptyState 
            type="profile"
            title="Become a Mentor"
            description="Share your knowledge and expertise with others. Apply to become a mentor and start helping others grow professionally."
            actionText="Apply Now"
            actionLink="/mentor-space/apply"
          />
        </motion.div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>Mentor Profile | Idolyst MentorSpace</title>
        <meta name="description" content="Manage your mentor profile, track sessions, and see your performance metrics." />
        <meta name="keywords" content="mentor profile, mentorship sessions, mentor dashboard" />
        <link rel="canonical" href="/mentor-space/profile" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text mb-2">Mentor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mentor profile, sessions, and view your performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Mentor Status</h2>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                mentorStatus.status === 'approved' 
                  ? 'bg-green-500' 
                  : mentorStatus.status === 'pending' 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`} />
              <span className="capitalize">{mentorStatus.status}</span>
            </div>
            
            {mentorStatus.status === 'pending' && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your application is currently under review. We'll notify you once it's approved.
              </p>
            )}
            
            {mentorStatus.status === 'approved' && (
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link to={`/mentor-space/${mentorStatus.id}`}>
                    View Public Profile
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/profile/edit">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {mentorStatus.total_sessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sessions
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {mentorStatus.avg_rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rating
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {mentorStatus.total_reviews}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Reviews
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  ${mentorStatus.hourly_rate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hourly Rate
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link to="/mentor-space/sessions">
                  Manage Sessions
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/profile/edit">
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/settings">
                  Notification Settings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/messages">
                  Messages
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default MentorProfilePage;
