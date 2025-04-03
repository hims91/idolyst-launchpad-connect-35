
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import SessionCard from "@/components/mentorspace/SessionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorshipSession, SessionStatus } from "@/types/mentor";
import { useUserSessions, useUpdateSessionStatus } from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp, staggerContainer } from "@/lib/animations";
import { ArrowLeft, Calendar, Clock, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewForm from "@/components/mentorspace/ReviewForm";
import { useAuth } from "@/providers/AuthProvider";
import { format, parseISO, isBefore, isToday, addDays } from "date-fns";

const SessionManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sessions, isLoading, refetch } = useUserSessions();
  const updateSessionStatus = useUpdateSessionStatus();
  
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  
  // Separate sessions by status and role
  const getFilteredSessions = (sessions: MentorshipSession[] | undefined, tab: string): MentorshipSession[] => {
    if (!sessions) return [];
    
    let filtered: MentorshipSession[] = [];
    
    switch (tab) {
      case "upcoming":
        filtered = sessions.filter(s => 
          (s.status === 'scheduled' || s.status === 'rescheduled') && 
          (isBefore(new Date(), parseISO(s.session_date)) || 
           (isToday(parseISO(s.session_date)) && 
            isBefore(new Date(), new Date(`${s.session_date}T${s.start_time}`))))
        );
        break;
      case "completed":
        filtered = sessions.filter(s => s.status === 'completed');
        break;
      case "cancelled":
        filtered = sessions.filter(s => s.status === 'cancelled');
        break;
      case "today":
        filtered = sessions.filter(s => 
          (s.status === 'scheduled' || s.status === 'rescheduled') && 
          isToday(parseISO(s.session_date))
        );
        break;
      default:
        filtered = sessions;
    }
    
    return filtered.sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.session_date}T${a.start_time}`);
      const dateB = new Date(`${b.session_date}T${b.start_time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const handleStatusChange = (sessionId: string, status: SessionStatus, meetingLink?: string) => {
    updateSessionStatus.mutate({
      sessionId,
      status,
      meetingLink
    }, {
      onSuccess: () => {
        toast({
          title: "Session updated",
          description: `Session ${status === 'cancelled' ? 'cancelled' : status} successfully.`,
          variant: status === 'cancelled' ? "destructive" : "default"
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Error updating session",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };
  
  const handleReviewClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowReviewDialog(true);
  };
  
  const handleReviewComplete = () => {
    setShowReviewDialog(false);
    refetch();
  };
  
  const getTodaysSessions = () => {
    if (!sessions) return [];
    
    return sessions.filter(s => 
      (s.status === 'scheduled' || s.status === 'rescheduled') && 
      isToday(parseISO(s.session_date))
    ).sort((a, b) => {
      // Sort by time
      const timeA = a.start_time;
      const timeB = b.start_time;
      return timeA.localeCompare(timeB);
    });
  };
  
  const getUpcomingSessions = () => {
    if (!sessions) return [];
    
    return sessions.filter(s => 
      (s.status === 'scheduled' || s.status === 'rescheduled') && 
      (isBefore(new Date(), parseISO(s.session_date)) || 
       (isToday(parseISO(s.session_date)) && 
        isBefore(new Date(), new Date(`${s.session_date}T${s.start_time}`))))
    ).sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.session_date}T${a.start_time}`);
      const dateB = new Date(`${b.session_date}T${b.start_time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const todaySessions = getTodaysSessions();
  const upcomingSessions = getUpcomingSessions();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-0 px-4 flex justify-center py-20">
          <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>Mentorship Sessions | Idolyst MentorSpace</title>
        <meta name="description" content="Manage your mentorship sessions, view upcoming meetings, and track session history." />
        <meta name="keywords" content="mentorship sessions, meetings, scheduling, session management" />
        <link rel="canonical" href="/mentor-space/sessions" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/mentor-space')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Mentorship Sessions</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Manage your scheduled sessions and view session history
            </p>
          </div>
        </div>
        
        {todaySessions.length > 0 && (
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Today's Sessions
            </h2>
            
            <motion.div 
              variants={staggerContainer}
              className="space-y-4"
            >
              {todaySessions.map(session => {
                const isMentor = session.mentor_id === user?.id;
                
                return isMentor ? (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    isMentor={true}
                    onStatusChange={handleStatusChange} 
                  />
                ) : (
                  <SessionCard 
                    key={session.id} 
                    session={session}
                    onReview={handleReviewClick}
                    onStatusChange={handleStatusChange}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All Sessions</TabsTrigger>
          </TabsList>
          
          {["upcoming", "completed", "cancelled", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {getFilteredSessions(sessions, tab).length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {getFilteredSessions(sessions, tab).map(session => {
                    const isMentor = session.mentor_id === user?.id;
                    
                    return isMentor ? (
                      <SessionCard 
                        key={session.id} 
                        session={session} 
                        isMentor={true}
                        onStatusChange={handleStatusChange} 
                      />
                    ) : (
                      <SessionCard 
                        key={session.id} 
                        session={session}
                        onReview={handleReviewClick}
                        onStatusChange={handleStatusChange}
                      />
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  variants={fadeInUp}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4">
                      <Calendar className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No {tab} sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {tab === "upcoming" ? "You don't have any upcoming mentorship sessions scheduled." :
                     tab === "completed" ? "You haven't completed any mentorship sessions yet." :
                     tab === "cancelled" ? "You don't have any cancelled sessions." :
                     "You don't have any sessions yet."}
                  </p>
                  {tab === "upcoming" && (
                    <Button asChild>
                      <Link to="/mentor-space/directory">Find a Mentor</Link>
                    </Button>
                  )}
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this mentorship session.
              </DialogDescription>
            </DialogHeader>
            {selectedSessionId && (
              <ReviewForm 
                sessionId={selectedSessionId} 
                onComplete={handleReviewComplete} 
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

export default SessionManagement;
