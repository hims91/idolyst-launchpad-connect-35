
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Sparkles, Link, Heart } from 'lucide-react';
import { ReactionType } from '@/api/launchpad';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReactionPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onReaction: (type: ReactionType) => void;
  currentReaction: ReactionType | null;
}

const ReactionPopover: React.FC<ReactionPopoverProps> = ({
  isOpen,
  onClose,
  onReaction,
  currentReaction,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Reaction options
  const reactions = [
    { 
      type: 'insightful' as ReactionType, 
      icon: <Lightbulb className="h-5 w-5" />, 
      label: 'Insightful',
      gradient: 'from-yellow-400 to-yellow-600',
      description: 'This post provides valuable insights'
    },
    { 
      type: 'fundable' as ReactionType, 
      icon: <Rocket className="h-5 w-5" />, 
      label: 'Fundable',
      gradient: 'from-green-400 to-green-600',
      description: 'This idea has funding potential'
    },
    { 
      type: 'innovative' as ReactionType, 
      icon: <Sparkles className="h-5 w-5" />, 
      label: 'Innovative',
      gradient: 'from-blue-400 to-blue-600',
      description: 'A truly innovative approach'
    },
    { 
      type: 'collab_worthy' as ReactionType, 
      icon: <Link className="h-5 w-5" />, 
      label: 'Collab Worthy',
      gradient: 'from-purple-400 to-purple-600',
      description: 'Great opportunity for collaboration'
    },
    { 
      type: 'like' as ReactionType, 
      icon: <Heart className="h-5 w-5" />, 
      label: 'Like',
      gradient: 'from-pink-400 to-pink-600',
      description: 'Show appreciation for this post'
    }
  ];
  
  if (!isOpen) return null;
  
  // Animation variants for the container and buttons
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.15 } }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } }
  };
  
  return (
    <motion.div
      ref={popoverRef}
      className="absolute left-0 bottom-full mb-2 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="flex gap-2">
        {reactions.map((reaction) => (
          <TooltipProvider key={reaction.type} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className={`relative p-2 rounded-full transition-transform
                    ${currentReaction === reaction.type ? 'scale-110 ring-2 ring-offset-2 ring-idolyst-purple' : 'hover:scale-110'}
                    bg-gradient-to-r ${reaction.gradient} text-white`}
                  onClick={() => {
                    onReaction(reaction.type);
                    onClose();
                  }}
                  variants={buttonVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {reaction.icon}
                  <span className="sr-only">{reaction.label}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-medium">
                <p>{reaction.label}</p>
                <p className="text-xs opacity-75">{reaction.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </motion.div>
  );
};

export default ReactionPopover;
