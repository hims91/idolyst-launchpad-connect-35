
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Users } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface EmptyStateProps {
  onNewMessage: () => void;
}

const EmptyState = ({ onNewMessage }: EmptyStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full p-6 text-center"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 dark:bg-purple-900/30">
        <MessageSquarePlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">
        Start a conversation
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Connect with your network through direct messages. 
        Send texts, images, and documents to collaborate effectively.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={onNewMessage}
          className="gradient-bg hover-scale w-full sm:w-auto"
        >
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          New message
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>Chat with people you follow or who follow you</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
