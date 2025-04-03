
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface EmptyStateProps {
  onNewMessage: () => void;
}

const EmptyState = ({ onNewMessage }: EmptyStateProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col items-center justify-center p-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-purple-500 dark:text-purple-400" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">No conversation selected</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Select a conversation from the list or start a new message to connect with mentors and entrepreneurs.
      </p>
      
      <Button
        onClick={onNewMessage}
        className="gradient-bg hover-scale"
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        Start New Conversation
      </Button>
    </motion.div>
  );
};

export default EmptyState;
