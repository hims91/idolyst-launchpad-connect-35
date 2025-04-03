
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MentorshipSession, SessionStatus } from "@/types/mentor";
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Star, 
  Video, 
  XCircle, 
  CheckCircle, 
  CalendarClock,
  RefreshCw 
} from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { useUpdateSessionStatus, useSubmitReview } from "@/hooks/use-mentors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fadeInUp } from "@/lib/animations";
import { ExtendedProfile } from "@/types/profile";

interface SessionCardProps {
  session: MentorshipSession;
  isMentor?: boolean;
}

const SessionCard = ({ session, isMentor = false }: SessionCardProps) => {
  const { user } = useAuth();
  const updateSession = useUpdateSessionStatus();
  const submitReview = useSubmitReview();
  
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState(session.meeting_link || "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const isSessionPast = isPast(parseISO(`${session.session_date}T${session.end_time}`));
  const sessionDate = parseISO(session.session_date);
  
  const statusColors: Record<SessionStatus, string> = {
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    rescheduled: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
  };

  const statusIcons: Record<SessionStatus, any> = {
    scheduled: CalendarClock,
    completed: CheckCircle,
    cancelled: XCircle,
    rescheduled: RefreshCw
  };
  
  const StatusIcon = statusIcons[session.status];

  const handleCancel = () => {
    updateSession.mutate({
      sessionId: session.id,
      status: 'cancelled'
    }, {
      onSuccess: () => {
        setIsCancelOpen(false);
      }
    });
  };

  const handleComplete = () => {
    updateSession.mutate({
      sessionId: session.id,
      status: 'completed',
      meetingLink
    }, {
      onSuccess: () => {
        setIsCompleteOpen(false);
      }
    });
  };

  const handleSubmitReview = () => {
    submitReview.mutate({
      sessionId: session.id,
      rating,
      comment: comment.trim() === "" ? undefined : comment,
      isPublic
    }, {
      onSuccess: () => {
        setIsReviewOpen(false);
      }
    });
  };

  // Extract the partner's info (either mentee or mentor)
  const partner = isMentor 
    ? session.mentee 
    : session.mentor;

  // Safely extract profile information
  let name, avatar, username;
  
  if (partner) {
    if ('profile' in partner) {
      // It's MentorWithProfile
      name = partner.profile.full_name || partner.profile.username;
      avatar = partner.profile.avatar_url;
      username = partner.profile.username;
    } else {
      // It's ExtendedProfile
      name = partner.full_name || partner.username;
      avatar = partner.avatar_url;
      username = partner.username;
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      layoutId={`session-${session.id}`}
    >
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Session Status Badge */}
            <div className={cn("p-4 text-center md:w-1/4", statusColors[session.status])}>
              <StatusIcon className="h-10 w-10 mx-auto mb-2" />
              <h3 className="font-semibold capitalize">{session.status}</h3>
              <p className="text-sm opacity-75">
                {session.status === 'scheduled' ? 'Ready to go!' : 
                 session.status === 'completed' ? 'Session ended' : 
                 session.status === 'cancelled' ? 'Session cancelled' : 
                 'Time updated'}
              </p>
            </div>
            
            {/* Session Details */}
            <div className="p-4 flex-1">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <h3 className="text-xl font-bold">{session.title}</h3>
                <div className="mt-2 md:mt-0 text-right">
                  <Badge variant="outline" className="font-mono">
                    ${session.price.toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              {partner && (
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="bg-purple-100 text-purple-800">
                      {name?.slice(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{name || "User"}</p>
                    <p className="text-xs text-gray-500">
                      {isMentor ? 'Mentee' : 'Mentor'} • @{username || "user"}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(sessionDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {format(parseISO(`1970-01-01T${session.start_time}`), 'h:mm a')} - 
                    {format(parseISO(`1970-01-01T${session.end_time}`), 'h:mm a')}
                  </span>
                </div>
                {session.meeting_link && (
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                    <Video className="h-4 w-4 mr-2" />
                    <a 
                      href={session.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center"
                    >
                      Join Meeting <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
              
              {session.description && (
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                  <p className="text-sm">{session.description}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Action Buttons */}
        <CardFooter className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-2">
          {/* Mentor Actions */}
          {isMentor && session.status === 'scheduled' && !isSessionPast && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCompleteOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCancelOpen(true)}
                className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          
          {/* Mentee Actions */}
          {!isMentor && session.status === 'scheduled' && !isSessionPast && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCancelOpen(true)}
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          
          {/* Review Action (for mentees) */}
          {!isMentor && session.status === 'completed' && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsReviewOpen(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Star className="h-4 w-4 mr-2" />
              Leave Review
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Session Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to cancel this session? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              No, Keep Session
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={updateSession.isPending}
            >
              {updateSession.isPending ? "Cancelling..." : "Yes, Cancel Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Session Dialog */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
          </DialogHeader>
          <p>Mark this session as completed? This will allow the mentee to leave a review.</p>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/meeting-link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a recording link if available.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleComplete}
              disabled={updateSession.isPending}
            >
              {updateSession.isPending ? "Updating..." : "Mark as Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-8 w-8 cursor-pointer transition-colors",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this mentor..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make this review public
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSubmitReview}
              disabled={submitReview.isPending}
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SessionCard;
