
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MentorshipSession, SessionStatus } from "@/types/mentor";
import { format, parseISO, isValid, isPast } from "date-fns";
import { staggerItem } from "@/lib/animations";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star,
  MessageSquare
} from "lucide-react";
import { getInitials } from "@/lib/utils";

interface SessionCardProps {
  session: MentorshipSession;
  viewType: 'mentor' | 'mentee';
  onStatusChange?: (sessionId: string, status: SessionStatus) => void;
  onReview?: (sessionId: string) => void;
}

const SessionCard = ({ 
  session, 
  viewType, 
  onStatusChange,
  onReview
}: SessionCardProps) => {
  const { 
    id, title, description, session_date, start_time, end_time, 
    status, meeting_link, price, mentor, mentee 
  } = session;
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : '';
  };
  
  const formatTime = (timeString: string) => {
    // Parse the time string (assuming format like "14:30:00")
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return format(date, 'h:mm a');
  };
  
  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'rescheduled':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rescheduled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const isSessionPast = () => {
    const sessionDate = parseISO(session_date);
    const [hours, minutes] = end_time.split(':');
    sessionDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return isPast(sessionDate);
  };
  
  const canCancel = status === 'scheduled' && !isSessionPast();
  const canComplete = status === 'scheduled' && isSessionPast();
  const canReview = status === 'completed' && viewType === 'mentee';
  const isPending = status === 'scheduled' && !isSessionPast();
  const profileToShow = viewType === 'mentor' ? mentee : mentor;

  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={profileToShow?.profile.avatar_url || ''} 
              alt={profileToShow?.profile.full_name || profileToShow?.profile.username || ''} 
            />
            <AvatarFallback className="bg-purple-500 text-white">
              {getInitials(profileToShow?.profile.full_name || profileToShow?.profile.username || '')}
            </AvatarFallback>
          </Avatar>
          
          {viewType === 'mentor' ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              asChild
            >
              <Link to={`/messages/${mentee?.id}`}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Message</span>
              </Link>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              asChild
            >
              <Link to={`/mentor-space/${mentor?.id}`}>
                <Star className="h-4 w-4" />
                <span className="sr-only">View Profile</span>
              </Link>
            </Button>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                with {profileToShow?.profile.full_name || profileToShow?.profile.username}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(status)}
              {isPending && (
                <Badge variant="outline" className="border-purple-500 text-purple-700 dark:text-purple-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Upcoming
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
            {description}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(session_date)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(start_time)} - {formatTime(end_time)}</span>
            </div>
            
            <div className="font-medium text-purple-700 dark:text-purple-400">
              ${price}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-between gap-2">
        {meeting_link && status === 'scheduled' && (
          <Button variant="outline" className="gap-2" asChild>
            <a href={meeting_link} target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4" />
              Join Meeting
            </a>
          </Button>
        )}
        
        <div className="flex gap-2 ml-auto">
          {canCancel && onStatusChange && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onStatusChange(id, 'cancelled')}
            >
              Cancel
            </Button>
          )}
          
          {canComplete && viewType === 'mentor' && onStatusChange && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onStatusChange(id, 'completed')}
            >
              Mark as Completed
            </Button>
          )}
          
          {canReview && onReview && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onReview(id)}
              className="gap-1"
            >
              <Star className="h-4 w-4" />
              Leave Review
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;
