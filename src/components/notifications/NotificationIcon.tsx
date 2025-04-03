
import { NotificationType } from "@/types/notifications";
import { 
  MessageSquare, Bell, Calendar, Award, Trophy, 
  ThumbsUp, MessageCircle, Users, Star, TrendingUp,
  BadgeCheck, AlertCircle, FileText, Heart, Repeat 
} from "lucide-react";

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
  size?: number;
}

export const NotificationIcon = ({ type, className, size = 18 }: NotificationIconProps) => {
  switch (type) {
    case 'new_follower':
      return <Users className={className} size={size} />;
    case 'new_message':
      return <MessageSquare className={className} size={size} />;
    case 'mentorship_booking':
      return <Calendar className={className} size={size} />;
    case 'mentorship_cancellation':
      return <Calendar className={className} size={size} />;
    case 'mentorship_reminder':
      return <Bell className={className} size={size} />;
    case 'pitch_vote':
      return <ThumbsUp className={className} size={size} />;
    case 'pitch_comment':
      return <MessageCircle className={className} size={size} />;
    case 'pitch_feedback':
      return <Star className={className} size={size} />;
    case 'level_up':
      return <TrendingUp className={className} size={size} />;
    case 'badge_unlock':
      return <Award className={className} size={size} />;
    case 'leaderboard_shift':
      return <Trophy className={className} size={size} />;
    case 'launchpad_comment':
      return <MessageCircle className={className} size={size} />;
    case 'launchpad_reaction':
      return <Heart className={className} size={size} />;
    case 'launchpad_repost':
      return <Repeat className={className} size={size} />;
    default:
      return <AlertCircle className={className} size={size} />;
  }
};

export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'new_follower':
      return 'bg-blue-500';
    case 'new_message':
      return 'bg-indigo-500';
    case 'mentorship_booking':
    case 'mentorship_cancellation':
    case 'mentorship_reminder':
      return 'bg-green-500';
    case 'pitch_vote':
    case 'pitch_comment':
    case 'pitch_feedback':
      return 'bg-amber-500';
    case 'level_up':
    case 'badge_unlock':
    case 'leaderboard_shift':
      return 'bg-purple-500';
    case 'launchpad_comment':
    case 'launchpad_reaction':
    case 'launchpad_repost':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
};
