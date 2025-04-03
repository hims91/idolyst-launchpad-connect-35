
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import MentorApplicationForm from "@/components/mentorspace/MentorApplicationForm";
import { ExpertiseCategory } from "@/types/mentor";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp } from "@/lib/animations";
import { useMentorStatus } from "@/hooks/use-mentors";
import { CheckCircle2, Users } from "lucide-react";

const expertiseCategories: ExpertiseCategory[] = [
  'Business',
  'Marketing',
  'Technology',
  'Design',
  'Finance',
  'Product',
  'Leadership',
  'Sales',
  'Operations',
  'Data'
];

const MentorApplication = () => {
  const navigate = useNavigate();
  const { data: mentorStatus, isLoading } = useMentorStatus();
  
  useEffect(() => {
    // If user is already an approved mentor, redirect to profile page
    if (mentorStatus && mentorStatus.status === 'approved') {
      navigate('/mentor-space/profile');
    }
  }, [mentorStatus, navigate]);

  return (
    <Layout>
      <Helmet>
        <title>Become a Mentor | Idolyst MentorSpace</title>
        <meta name="description" content="Share your expertise and help others grow by becoming a mentor on Idolyst. Set your own rates, choose your availability, and build your professional reputation." />
        <meta name="keywords" content="become a mentor, mentor application, share expertise, mentorship" />
        <link rel="canonical" href="/mentor-space/apply" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-idolyst-purple/20 p-4">
              <Users className="h-10 w-10 text-idolyst-purple" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-3 text-center">Become a Mentor</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xl mx-auto">
            Share your expertise, help others grow, and earn while making an impact.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mentorStatus && mentorStatus.status === 'pending' ? (
          <motion.div 
            variants={fadeInUp}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center"
          >
            <div className="flex flex-col items-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-amber-500 mb-2" />
              <h2 className="text-xl font-semibold">Application Under Review</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your mentor application has been submitted and is currently being reviewed. You'll receive a notification once it's approved.
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Application submitted: {new Date(mentorStatus.created_at).toLocaleDateString()}</p>
              <p>Current status: <span className="font-medium capitalize">{mentorStatus.status}</span></p>
            </div>
          </motion.div>
        ) : mentorStatus && mentorStatus.status === 'rejected' ? (
          <div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Application Not Approved</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your previous application was not approved. You can update your information and reapply below.
              </p>
            </div>
            <MentorApplicationForm expertiseCategories={expertiseCategories} mentorData={mentorStatus} />
          </div>
        ) : (
          <>
            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-lg">Set Your Own Rates</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-13">
                  Choose your hourly rate based on your expertise and experience level.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-lg">Flexible Schedule</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Set your own availability and choose when you want to mentor.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-lg">Earn XP & Badges</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Get rewarded with XP and special badges for your mentoring efforts.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-lg">Build Your Reputation</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive reviews and build your professional reputation as a mentor.
                </p>
              </div>
            </motion.div>
            
            <MentorApplicationForm expertiseCategories={expertiseCategories} />
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default MentorApplication;
