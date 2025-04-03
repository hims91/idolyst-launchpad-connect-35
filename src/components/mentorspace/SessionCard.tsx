
import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { MentorshipSession, SessionStatus } from "@/types/mentor";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Video, 
  Star, 
  MoreVertical,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { staggerItem } from "@/lib/animations";

interface SessionCardProps {
  session: MentorshipSession;
  isMentor?: boolean;
  onStatusChange?: (sessionId: string, status: SessionStatus, meetingLink?: string) => void;
  onReview?: (sessionId: string) => void;
}

const SessionStatusBadge = ({ status }: { status: SessionStatus }) => {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
    case 'rescheduled':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Rescheduled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const SessionCard = ({ session, isMentor, onStatusChange, onReview }: SessionCardProps) => {
  const [meetingLinkInput, setMeetingLinkInput] = useState(session.meeting_link || '');
  const [showMeetingLinkDialog, setShowMeetingLinkDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  
  const sessionDate = parseISO(session.session_date);
  const formattedDate = format(sessionDate, "MMMM d, yyyy");
  
  const handleSetMeetingLink = () => {
    if (onStatusChange) {
      onStatusChange(session.id, 'scheduled', meetingLinkInput);
      setShowMeetingLinkDialog(false);
    }
  };
  
  const handleCancelSession = () => {
    if (onStatusChange) {
      onStatusChange(session.id, 'cancelled');
      setShowCancelDialog(false);
    }
  };
  
  const handleCompleteSession = () => {
    if (onStatusChange) {
      onStatusChange(session.id, 'completed');
      setShowCompleteDialog(false);
    }
  };
  
  const handleLeaveReview = () => {
    if (onReview) {
      onReview(session.id);
    }
  };
  
  const profileToShow = isMentor ? session.mentee : session.mentor?.profile;
  
  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex items-center mb-4 md:mb-0 md:flex-1">
          <Link to={`/profile/${profileToShow?.id}`} className="flex-shrink-0 mr-4">
            <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-offset-2 ring-offset-background ring-purple-200 dark:ring-purple-800">
              <AvatarImage src={profileToShow?.avatar_url || ''} alt={profileToShow?.full_name || profileToShow?.username || ''} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                {getInitials(profileToShow?.full_name || profileToShow?.username || '')}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <Link to={`/profile/${profileToShow?.id}`} className="font-semibold text-lg hover:underline">
                {profileToShow?.full_name || profileToShow?.username}
              </Link>
              <SessionStatusBadge status={session.status} />
            </div>
            
            <h3 className="font-medium line-clamp-1">{session.title}</h3>
            
            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-3">{formattedDate}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{session.start_time} - {session.end_time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex flex-row md:flex-col items-center justify-between mt-4 md:mt-0 gap-2 md:gap-3">
          <div className="text-lg font-semibold text-purple-700 dark:text-purple-400">
            ${session.price}
          </div>
          
          {session.status === 'scheduled' && session.meeting_link && (
            <Button variant="outline" size="sm" className="flex gap-2" asChild>
              <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4" />
                <span className="hidden md:inline">Join Meeting</span>
              </a>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isMentor && session.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => setShowMeetingLinkDialog(true)}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Set Meeting Link
                </DropdownMenuItem>
              )}
              
              {(isMentor || !isMentor) && session.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Session
                </DropdownMenuItem>
              )}
              
              {isMentor && session.status === 'scheduled' && (
                <DropdownMenuItem onClick={() => setShowCompleteDialog(true)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              
              {!isMentor && session.status === 'completed' && (
                <DropdownMenuItem onClick={handleLeaveReview}>
                  <Star className="h-4 w-4 mr-2" />
                  Leave a Review
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Meeting Link Dialog */}
      <Dialog open={showMeetingLinkDialog} onOpenChange={setShowMeetingLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Meeting Link</DialogTitle>
            <DialogDescription>
              Provide the video call link for this mentorship session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              value={meetingLinkInput}
              onChange={(e) => setMeetingLinkInput(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSetMeetingLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this mentorship session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">No, Keep It</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleCancelSession}>
              Yes, Cancel Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this session as completed? This will allow the mentee to leave a review.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCompleteSession}>
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SessionCard;
