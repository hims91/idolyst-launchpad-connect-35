
import React from 'react';
import { motion } from 'framer-motion';
import { Badge as BadgeType } from '@/types/profile';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Award, Shield, Zap, Target, Star, Trophy, Crown } from 'lucide-react';

interface BadgeDisplayProps {
  badges: BadgeType[];
  limit?: number;
  showAll?: boolean;
}

// Map of badge names to icon components
const badgeIcons: Record<string, React.ReactNode> = {
  'Top Mentor': <Trophy className="h-5 w-5 text-yellow-500" />,
  'Idea Influencer': <Zap className="h-5 w-5 text-blue-500" />,
  'Connection Master': <Shield className="h-5 w-5 text-green-500" />,
  'Pitch Pro': <Target className="h-5 w-5 text-red-500" />,
  'Rising Star': <Star className="h-5 w-5 text-purple-500" />,
  'Community Leader': <Crown className="h-5 w-5 text-amber-500" />,
};

// Default badge icon
const DefaultBadgeIcon = <Award className="h-5 w-5 text-gray-500" />;

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  limit = 4, 
  showAll = false 
}) => {
  const [selectedBadge, setSelectedBadge] = React.useState<BadgeType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const displayBadges = showAll ? badges : badges.slice(0, limit);
  const hasMoreBadges = !showAll && badges.length > limit;
  
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {displayBadges.map((badge, index) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm border border-gray-100 dark:border-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedBadge(badge);
                    setIsDialogOpen(true);
                  }}
                >
                  {badgeIcons[badge.name] || DefaultBadgeIcon}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-gray-500">Earned: {new Date(badge.earned_at).toLocaleDateString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        
        {hasMoreBadges && (
          <motion.div
            className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-full p-2 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs font-medium">+{badges.length - limit}</span>
          </motion.div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">{selectedBadge.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  {badgeIcons[selectedBadge.name] || DefaultBadgeIcon}
                </div>
                <p className="text-center mb-2">{selectedBadge.description}</p>
                <p className="text-sm text-gray-500">
                  Earned on {new Date(selectedBadge.earned_at).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeDisplay;
