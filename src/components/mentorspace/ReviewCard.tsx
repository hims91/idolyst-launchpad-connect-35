
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionReview } from "@/types/mentor";
import { format, parseISO, isValid } from "date-fns";
import { staggerItem } from "@/lib/animations";
import { getInitials } from "@/lib/utils";

interface ReviewCardProps {
  review: SessionReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { rating, comment, reviewer, created_at } = review;
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : '';
  };
  
  const renderStars = () => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < rating 
                ? "text-yellow-500 fill-yellow-500" 
                : "text-gray-300 dark:text-gray-600"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      variants={staggerItem}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={reviewer?.avatar_url || ''} alt={reviewer?.full_name || reviewer?.username || ''} />
          <AvatarFallback className="bg-purple-500 text-white">
            {getInitials(reviewer?.full_name || reviewer?.username || '')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {reviewer?.full_name || reviewer?.username || 'Anonymous'}
              </h4>
              <div className="flex items-center mt-1">
                {renderStars()}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(created_at)}
                </span>
              </div>
            </div>
          </div>
          
          {comment && (
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              {comment}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
