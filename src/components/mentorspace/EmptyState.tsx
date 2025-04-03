
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UsersRound, Search, Calendar, User } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: 'mentors' | 'sessions' | 'profile';
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}

const EmptyState = ({ type, title, description, actionText, actionLink }: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'mentors':
        return <UsersRound className="h-12 w-12 text-purple-600 dark:text-purple-400" />;
      case 'sessions':
        return <Calendar className="h-12 w-12 text-purple-600 dark:text-purple-400" />;
      case 'profile':
        return <User className="h-12 w-12 text-purple-600 dark:text-purple-400" />;
      default:
        return <Search className="h-12 w-12 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-4 mb-6">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      
      <Button 
        asChild
        className="gradient-bg hover-scale"
      >
        <Link to={actionLink}>
          {actionText}
        </Link>
      </Button>
    </motion.div>
  );
};

export default EmptyState;
