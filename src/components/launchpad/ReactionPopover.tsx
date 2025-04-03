
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Lightbulb, DollarSign, Sparkles, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactionType } from "@/api/launchpad";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface ReactionPopoverProps {
  postId: string;
  children: React.ReactNode;
  currentReaction: ReactionType | null;
  onReaction: (type: ReactionType) => void;
}

const REACTIONS: { type: ReactionType; icon: React.ReactNode; label: string; color: string }[] = [
  { 
    type: 'like', 
    icon: <ThumbsUp className="h-4 w-4" />,
    label: 'Like',
    color: 'bg-idolyst-purple text-white hover:bg-idolyst-purple-dark'
  },
  { 
    type: 'insightful', 
    icon: <Lightbulb className="h-4 w-4" />,
    label: 'Insightful',
    color: 'bg-blue-500 text-white hover:bg-blue-600' 
  },
  { 
    type: 'fundable', 
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Fundable', 
    color: 'bg-green-500 text-white hover:bg-green-600'
  },
  { 
    type: 'innovative', 
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Innovative',
    color: 'bg-purple-500 text-white hover:bg-purple-600' 
  },
  { 
    type: 'collab_worthy', 
    icon: <Users className="h-4 w-4" />,
    label: 'Collab Worthy',
    color: 'bg-amber-500 text-white hover:bg-amber-600' 
  }
];

const ReactionPopover: React.FC<ReactionPopoverProps> = ({ 
  postId, 
  children, 
  currentReaction, 
  onReaction 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleReaction = (type: ReactionType) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsOpen(false);
    onReaction(type);
  };
  
  // Special handling for direct click on the button
  const handleDirectClick = () => {
    if (user) {
      onReaction('like');
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to posts",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          {React.cloneElement(React.Children.only(children) as React.ReactElement, {
            onClick: handleDirectClick,
            onMouseEnter: () => setIsOpen(true)
          })}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-1 flex items-center space-x-1"
        sideOffset={5}
        onMouseLeave={() => setIsOpen(false)}
      >
        <AnimatePresence>
          {REACTIONS.map((reaction) => (
            <motion.button
              key={reaction.type}
              className={`rounded-full p-2 ${reaction.color} transition-all duration-300`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleReaction(reaction.type)}
              title={reaction.label}
            >
              {reaction.icon}
            </motion.button>
          ))}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
};

export default ReactionPopover;
