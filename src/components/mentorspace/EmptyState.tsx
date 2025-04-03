
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, SearchX, UserPlus } from "lucide-react";

interface EmptyStateProps {
  type: "search" | "sessions" | "profile";
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

const EmptyState = ({ type, title, description, actionText, actionLink }: EmptyStateProps) => {
  // Choose icon based on type
  const Icon = type === "search" 
    ? SearchX 
    : type === "sessions" 
      ? Calendar 
      : UserPlus;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
          <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionText && actionLink && (
        <Button asChild>
          <Link to={actionLink}>{actionText}</Link>
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
