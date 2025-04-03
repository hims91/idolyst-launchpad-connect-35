
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import MentorApplicationForm from "@/components/mentorspace/MentorApplicationForm";
import { ExpertiseCategory } from "@/types/mentor";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text mb-2">Become a Mentor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your expertise, help others grow, and earn while making an impact.
          </p>
        </div>
        
        <MentorApplicationForm expertiseCategories={expertiseCategories} />
      </motion.div>
    </Layout>
  );
};

export default MentorApplication;
