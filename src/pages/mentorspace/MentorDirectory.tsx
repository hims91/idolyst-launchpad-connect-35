
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import MentorCard from "@/components/mentorspace/MentorCard";
import MentorCardSkeleton from "@/components/mentorspace/MentorCardSkeleton";
import FilterBar from "@/components/mentorspace/FilterBar";
import EmptyState from "@/components/mentorspace/EmptyState";
import { Button } from "@/components/ui/button";
import { MentorFilter, ExpertiseCategory } from "@/types/mentor";
import { useMentors } from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition, listContainer } from "@/lib/animations";
import { useInView } from "framer-motion";
import { useRef } from "react";

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

const MentorDirectory = () => {
  const [filter, setFilter] = useState<MentorFilter>({});
  const { data: mentors, isLoading, isError } = useMentors(filter);
  
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);
  const [displayCount, setDisplayCount] = useState(6);
  
  useEffect(() => {
    if (isInView && mentors && displayCount < mentors.length) {
      setDisplayCount(prev => Math.min(prev + 3, mentors?.length || 0));
    }
  }, [isInView, mentors, displayCount]);

  const handleFilterChange = (newFilter: MentorFilter) => {
    setFilter(newFilter);
    setDisplayCount(6); // Reset display count when filter changes
  };

  return (
    <Layout>
      <Helmet>
        <title>Find Mentors | Idolyst MentorSpace</title>
        <meta name="description" content="Connect with experienced mentors in various fields to accelerate your professional growth. Book sessions, get personalized guidance, and level up your career." />
        <meta name="keywords" content="mentorship, find mentors, career advice, professional development, expert guidance" />
        <link rel="canonical" href="/mentor-space" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text">Find Mentors</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect with experienced professionals for personalized guidance and growth.
          </p>
        </div>
        
        <FilterBar 
          filter={filter} 
          onFilterChange={handleFilterChange} 
          expertiseCategories={expertiseCategories}
        />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <MentorCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Error loading mentors</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : mentors && mentors.length > 0 ? (
          <>
            <motion.div 
              className="space-y-4"
              variants={listContainer}
              initial="hidden"
              animate="visible"
            >
              {mentors.slice(0, displayCount).map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </motion.div>
            
            {displayCount < (mentors?.length || 0) && (
              <div ref={loadMoreRef} className="flex justify-center mt-8">
                <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            type="mentors"
            title="No Mentors Found"
            description="We couldn't find any mentors matching your criteria. Try adjusting your filters or check back later."
            actionText="Reset Filters"
            actionLink="/mentor-space"
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default MentorDirectory;
