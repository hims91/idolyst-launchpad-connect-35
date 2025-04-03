
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Linkedin, Mail, Link, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { sharePost } from '@/api/launchpad';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  if (!isOpen) return null;
  
  // Create share URL
  const shareUrl = `${window.location.origin}/launchpad/post/${postId}`;
  
  // Handle share
  const handleShare = async (platform: string) => {
    let shareLink = '';
    const text = 'Check out this post on Idolyst';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Post link has been copied to your clipboard",
        });
        onClose();
        // Record share
        await sharePost(postId, 'copy');
        return;
    }
    
    // Open share window
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      onClose();
      // Record share
      await sharePost(postId, platform);
    }
  };
  
  // Share options
  const shareOptions = [
    { 
      platform: 'twitter', 
      icon: <Twitter className="h-5 w-5" />, 
      label: 'Twitter',
      bgColor: 'bg-[#1DA1F2] hover:bg-[#1a94e0]',
      description: 'Share on Twitter/X'
    },
    { 
      platform: 'facebook', 
      icon: <Facebook className="h-5 w-5" />, 
      label: 'Facebook',
      bgColor: 'bg-[#4267B2] hover:bg-[#3b5da0]',
      description: 'Share on Facebook'
    },
    { 
      platform: 'linkedin', 
      icon: <Linkedin className="h-5 w-5" />, 
      label: 'LinkedIn',
      bgColor: 'bg-[#0077B5] hover:bg-[#00669c]',
      description: 'Share on LinkedIn'
    },
    { 
      platform: 'email', 
      icon: <Mail className="h-5 w-5" />, 
      label: 'Email',
      bgColor: 'bg-gray-600 hover:bg-gray-700',
      description: 'Share via email'
    },
    { 
      platform: 'copy', 
      icon: <Copy className="h-5 w-5" />, 
      label: 'Copy Link',
      bgColor: 'bg-gray-800 hover:bg-gray-900',
      description: 'Copy link to clipboard'
    },
  ];
  
  // Animation variants
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
    visible: { opacity: 1, scale: 1 }
  };
  
  return (
    <motion.div
      ref={menuRef}
      className="absolute right-0 bottom-full mb-2 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="grid grid-cols-5 gap-2">
        {shareOptions.map((option) => (
          <TooltipProvider key={option.platform} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className={`flex flex-col items-center p-2 rounded-md text-white ${option.bgColor}`}
                  onClick={() => handleShare(option.platform)}
                  variants={buttonVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.icon}
                  <span className="text-xs mt-1">{option.label}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {option.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </motion.div>
  );
};

export default ShareMenu;
