
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Settings } from "lucide-react";

interface MobileHeaderProps {
  onNewMessage: () => void;
  showBackButton: boolean;
  onBackClick: () => void;
  conversationTitle: string;
}

const MobileHeader = ({
  onNewMessage,
  showBackButton,
  onBackClick,
  conversationTitle
}: MobileHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between mb-4 rounded-lg"
    >
      <div className="flex items-center">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : null}
        
        <h1 className="text-lg font-bold">
          {showBackButton ? conversationTitle : "Messages"}
        </h1>
      </div>
      
      {!showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="text-purple-600 dark:text-purple-400"
          onClick={onNewMessage}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      )}
    </motion.div>
  );
};

export default MobileHeader;
