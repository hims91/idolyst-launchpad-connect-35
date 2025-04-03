
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionCard from "@/components/mentorspace/SessionCard";
import ReviewForm from "@/components/mentorspace/ReviewForm";
import EmptyState from "@/components/mentorspace/EmptyState";
import { 
  useUserSessions, 
  useUpdateSessionStatus,
  useMentorStatus
} from "@/hooks/use-mentors";
import { MentorshipSession, SessionStatus } from "@/types/mentor";
import { motion } from "framer-motion";
import { pageTransition, listContainer } from "@/lib/animations";
import { isAfter, parseISO } from "date-fns";

// Define the expected prop types based on the SessionCard component
interface SessionCardProps {
  session: MentorshipSession;
  onStatusChange?: (sessionId: string, status: SessionStatus) => void;
  onReview?: (sessionId: string) => void;
}

const SessionManagement = () => {
  const [reviewSession, setReviewSession] = useState<MentorshipSession | null>(null);
  const { data: sessions, isLoading } = useUserSessions();
  const { data: mentorStatus } = useMentorStatus();
  const updateSessionStatus = useUpdateSessionStatus();
  
  const isMentor = !!mentorStatus;
  
  const handleStatusChange = (sessionId: string, status: SessionStatus) => {
    updateSessionStatus.mutate({ sessionId, status });
  };
  
  const handleReview = (sessionId: string) => {
    const session = sessions?.find(s => s.id === sessionId);
    if (session) {
      setReviewSession(session);
    }
  };
  
  const handleReviewSuccess = () => {
    setReviewSession(null);
  };
  
  // Separate sessions by status for each view (mentor/mentee)
  const filterSessions = (type: 'mentor' | 'mentee', upcomingOnly = false) => {
    if (!sessions) return [];
    
    return sessions.filter(session => {
      const isRightType = type === 'mentor' 
        ? session.mentor_id === mentorStatus?.id
        : session.mentee_id !== mentorStatus?.id;
      
      if (!isRightType) return false;
      
      if (upcomingOnly) {
        return session.status === 'scheduled' && 
          isAfter(parseISO(session.session_date), new Date());
      }
      
      return true;
    });
  };
  
  const upcomingMentorSessions = filterSessions('mentor', true);
  const upcomingMenteeSessions = filterSessions('mentee', true);
  const allMentorSessions = filterSessions('mentor');
  const allMenteeSessions = filterSessions('mentee');

  return (
    <Layout>
      <Helmet>
        <title>Session Management | Idolyst MentorSpace</title>
        <meta name="description" content="Manage your mentorship sessions. View upcoming sessions, past sessions, and leave reviews for completed sessions." />
        <meta name="keywords" content="mentorship sessions, session management, mentorship schedule" />
        <link rel="canonical" href="/mentor-space/sessions" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text mb-2">Session Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isMentor 
              ? "Manage your mentoring sessions and mentee bookings"
              : "View and manage your booked mentorship sessions"}
          </p>
        </div>
        
        <Tabs defaultValue={isMentor ? "mentor" : "mentee"} className="mb-8">
          <TabsList className="grid grid-cols-2 mb-6">
            {isMentor && <TabsTrigger value="mentor">As Mentor</TabsTrigger>}
            <TabsTrigger value="mentee">As Mentee</TabsTrigger>
            <TabsTrigger value="all">All Sessions</TabsTrigger>
          </TabsList>
          
          {isMentor && (
            <TabsContent value="mentor" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingMentorSessions.length > 0 ? (
                <motion.div 
                  variants={listContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {upcomingMentorSessions.map((session) => (
                    <SessionCard 
                      key={session.id} 
                      session={session} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState 
                  type="sessions"
                  title="No Upcoming Sessions"
                  description="You don't have any upcoming sessions as a mentor. When mentees book sessions with you, they'll appear here."
                  actionText="View Your Mentor Profile"
                  actionLink="/mentor-space/profile"
                />
              )}
            </TabsContent>
          )}
          
          <TabsContent value="mentee" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : upcomingMenteeSessions.length > 0 ? (
              <motion.div 
                variants={listContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {upcomingMenteeSessions.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onStatusChange={handleStatusChange}
                    onReview={handleReview}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState 
                type="sessions"
                title="No Upcoming Sessions"
                description="You don't have any upcoming sessions as a mentee. Book a session with a mentor to get started."
                actionText="Find Mentors"
                actionLink="/mentor-space"
              />
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {isMentor && allMentorSessions.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">As Mentor</h2>
                    <motion.div 
                      variants={listContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {allMentorSessions.map((session) => (
                        <SessionCard 
                          key={session.id} 
                          session={session} 
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}
                
                {allMenteeSessions.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">As Mentee</h2>
                    <motion.div 
                      variants={listContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {allMenteeSessions.map((session) => (
                        <SessionCard 
                          key={session.id} 
                          session={session} 
                          onStatusChange={handleStatusChange}
                          onReview={handleReview}
                        />
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  <EmptyState 
                    type="sessions"
                    title="No Sessions Found"
                    description="You don't have any sessions yet. Book a session with a mentor to get started."
                    actionText="Find Mentors"
                    actionLink="/mentor-space"
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        {reviewSession && (
          <ReviewForm 
            session={reviewSession} 
            onCancel={() => setReviewSession(null)}
            onSuccess={handleReviewSuccess}
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default SessionManagement;
