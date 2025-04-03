
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/shared/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";

interface MobileHeaderProps {
  onNewMessage: () => void;
  showBackButton: boolean;
  onBackClick: () => void;
  conversationTitle: string;
}

const MobileHeader = ({ onNewMessage, showBackButton, onBackClick, conversationTitle }: MobileHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <AnimatePresence mode="wait">
        {showBackButton ? (
          <motion.div 
            key="conversation-header"
            className="flex items-center flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center">
              <UserAvatar
                fallbackText={conversationTitle?.[0]?.toUpperCase() || "?"}
                size="sm"
                className="mr-2"
              />
              <span className="font-medium truncate max-w-[180px]">
                {conversationTitle || "Chat"}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.h1 
            key="messages-title"
            className="text-lg font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            Messages
          </motion.h1>
        )}
      </AnimatePresence>
      
      <div className="flex items-center">
        {!showBackButton && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400 mr-1"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost" 
              size="icon"
              className="text-purple-600 dark:text-purple-400"
              onClick={onNewMessage}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
