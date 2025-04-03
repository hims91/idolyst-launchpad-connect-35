
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon, Calendar, Clock } from "lucide-react";
import { MentorWithProfile } from "@/types/mentor";
import { Link } from "react-router-dom";
import { staggerItem } from "@/lib/animations";
import { getInitials } from "@/lib/utils";

interface MentorCardProps {
  mentor: MentorWithProfile;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const { profile, expertise, hourly_rate, avg_rating, total_sessions, total_reviews } = mentor;
  
  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-4"
    >
      <Link to={`/mentor-space/${mentor.id}`} className="flex-shrink-0">
        <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-offset-2 ring-offset-background ring-purple-200 dark:ring-purple-800">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || profile.username || ''} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
            {getInitials(profile.full_name || profile.username || '')}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 text-center md:text-left">
        <Link to={`/mentor-space/${mentor.id}`} className="block hover:underline">
          <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
            {profile.full_name || profile.username}
            {mentor.is_featured && (
              <Badge className="ml-2 bg-amber-500 hover:bg-amber-600">Featured</Badge>
            )}
          </h3>
        </Link>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-1 mb-2">
          {expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              {skill}
            </Badge>
          ))}
          {expertise.length > 3 && (
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              +{expertise.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {mentor.bio}
        </div>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-sm">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-amber-500 mr-1" />
            <span className="font-medium">{avg_rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({total_reviews})</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-blue-500 mr-1" />
            <span>{total_sessions} sessions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-green-500 mr-1" />
            <span>{mentor.years_experience} years exp.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-end gap-3 mt-4 md:mt-0">
        <div className="font-semibold text-lg text-purple-700 dark:text-purple-400">
          ${hourly_rate}/hour
        </div>
        
        <Button asChild>
          <Link to={`/mentor-space/${mentor.id}`}>View Profile</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default MentorCard;
