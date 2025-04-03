
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import MentorCard from "@/components/mentorspace/MentorCard";
import MentorCardSkeleton from "@/components/mentorspace/MentorCardSkeleton";
import { Button } from "@/components/ui/button";
import { ExpertiseCategory, MentorFilter } from "@/types/mentor";
import { useMentors } from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { 
  UsersRound, 
  Calendar, 
  BookOpen, 
  Star, 
  Filter, 
  ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const MentorSpace = () => {
  const navigate = useNavigate();
  const { data: featuredMentors, isLoading } = useMentors({ sortBy: 'rating' });
  
  return (
    <Layout>
      <Helmet>
        <title>MentorSpace | Idolyst</title>
        <meta name="description" content="Connect with experienced mentors, book personalized sessions, and accelerate your professional growth with Idolyst MentorSpace." />
        <meta name="keywords" content="mentorship, professional development, expert guidance, career growth" />
        <link rel="canonical" href="/mentor-space" />
      </Helmet>
      
      <motion.div 
        className="max-w-6xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Hero Section */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col items-center text-center py-12 md:py-16"
        >
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <UsersRound className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">MentorSpace</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-xl">
            Connect with experienced mentors, book personalized sessions, and accelerate your professional growth.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              className="gradient-bg hover-scale text-lg py-6 px-8"
              onClick={() => navigate('/mentor-space/directory')}
            >
              <UsersRound className="mr-2 h-5 w-5" />
              Browse Mentors
            </Button>
            <Button 
              variant="outline" 
              className="text-lg py-6 px-8"
              onClick={() => navigate('/mentor-space/sessions')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Your Sessions
            </Button>
          </div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
        >
          <motion.div 
            variants={staggerItem}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center"
          >
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn From Experts</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized guidance from industry professionals with proven expertise.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerItem}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center"
          >
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4 mb-4">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book sessions that fit your schedule, with real-time availability and instant confirmation.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerItem}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center"
          >
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
              <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Growth & Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your development, earn XP for completed sessions, and reach your career goals faster.
            </p>
          </motion.div>
        </motion.div>
        
        {/* Featured Mentors Section */}
        <motion.div 
          variants={fadeInUp}
          className="my-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Featured Mentors</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="group"
              asChild
            >
              <Link to="/mentor-space/directory">
                View All 
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <MentorCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredMentors && featuredMentors.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              className="space-y-4"
            >
              {featuredMentors.slice(0, 3).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No mentors available at the moment.
              </p>
              <Button onClick={() => navigate('/mentor-space/apply')}>
                Become a Mentor
              </Button>
            </div>
          )}
        </motion.div>
        
        {/* Become a Mentor Section */}
        <motion.div 
          variants={fadeInUp}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-8 text-white my-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Become a Mentor</h2>
              <p className="text-purple-100 mb-4 max-w-xl">
                Share your expertise, help others grow, and earn while making an impact. Join our community of mentors today.
              </p>
              <ul className="list-disc list-inside mb-6 text-purple-100">
                <li>Set your own rates and availability</li>
                <li>Build your professional reputation</li>
                <li>Earn XP and unlock special badges</li>
              </ul>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="whitespace-nowrap"
              onClick={() => navigate('/mentor-space/apply')}
            >
              Apply Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default MentorSpace;
