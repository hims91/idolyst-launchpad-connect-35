
import React from "react";
import { motion } from "framer-motion";
import { Twitter, Facebook, Linkedin, Link, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { sharePost } from "@/api/launchpad";
import { toast } from "@/components/ui/use-toast";

interface ShareMenuProps {
  postId: string;
  postUrl: string;
  children: React.ReactNode;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ postId, postUrl, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const shareUrl = `${window.location.origin}${postUrl}`;
  
  const handleShare = async (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=Check out this post&body=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard",
        });
        setIsOpen(false);
        await sharePost(postId, 'clipboard');
        return;
    }
    
    await sharePost(postId, platform);
    window.open(shareLink, '_blank');
    setIsOpen(false);
  };
  
  const shareOptions = [
    { platform: 'twitter', icon: <Twitter className="h-4 w-4 mr-2" />, label: 'Share on Twitter' },
    { platform: 'facebook', icon: <Facebook className="h-4 w-4 mr-2" />, label: 'Share on Facebook' },
    { platform: 'linkedin', icon: <Linkedin className="h-4 w-4 mr-2" />, label: 'Share on LinkedIn' },
    { platform: 'email', icon: <Mail className="h-4 w-4 mr-2" />, label: 'Share via email' },
    { platform: 'clipboard', icon: <Link className="h-4 w-4 mr-2" />, label: 'Copy link' },
  ];
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1">
          {shareOptions.map((option) => (
            <motion.div
              key={option.platform}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(0,0,0,0.05)' }}
              whileTap={{ scale: 0.99 }}
              className="rounded"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleShare(option.platform)}
              >
                {option.icon}
                {option.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareMenu;
