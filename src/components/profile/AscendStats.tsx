
import React from 'react';
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { UserProfile } from "@/types/auth";
import { useUserStats, useUserBadges } from "@/hooks/useAscend";
import { cn } from "@/lib/utils";

interface AscendStatsProps {
  userId: string;
  showDetails?: boolean;
}

const AscendStats: React.FC<AscendStatsProps> = ({ userId, showDetails = true }) => {
  const { data: userStats, isLoading: isStatsLoading } = useUserStats();
  const { data: badges, isLoading: isBadgesLoading } = useUserBadges();
  
  const earnedBadgesCount = badges?.filter(b => b.isEarned).length || 0;
  
  if (isStatsLoading) {
    return <Skeleton className="h-28 w-full" />;
  }
  
  if (!userStats) {
    return null;
  }
  
  const { xp, level, nextLevelXp, progressToNextLevel } = userStats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/30"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="font-medium">Ascend Stats</h3>
        </div>
        {showDetails && (
          <Link 
            to="/ascend"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Full Details →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-white dark:bg-gray-800/50 rounded-md p-2 text-center">
          <div className="text-lg font-bold">{level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-md p-2 text-center">
          <div className="text-lg font-bold">{xp}</div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-md p-2 text-center">
          <div className="text-lg font-bold">{earnedBadgesCount}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center">
            <Zap className="h-3 w-3 mr-1 text-indigo-600 dark:text-indigo-400" />
            <span>Level Progress</span>
          </div>
          <div className="text-muted-foreground">
            {nextLevelXp - xp} XP to Level {level + 1}
          </div>
        </div>
        <Progress value={progressToNextLevel} className="h-1.5" />
      </div>
      
      {showDetails && badges && badges.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-2 text-xs">
            <Award className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
            <span>Recent Badges</span>
          </div>
          <div className="flex space-x-2">
            {badges
              .filter(badge => badge.isEarned)
              .slice(0, 4)
              .map((badge) => (
                <div 
                  key={badge.id} 
                  className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
                  title={badge.name}
                >
                  {badge.icon && (
                    <img src={badge.icon} alt={badge.name} className="w-4 h-4" />
                  )}
                </div>
              ))}
            {earnedBadgesCount > 4 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-muted-foreground">
                +{earnedBadgesCount - 4}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AscendStats;
