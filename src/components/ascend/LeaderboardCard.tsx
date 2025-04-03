
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/shared/UserAvatar";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/api/ascend";
import { motion } from "framer-motion";

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entry,
  isCurrentUser = false
}) => {
  const { weekly_rank, weekly_change, profile, xp } = entry;
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="w-full"
    >
      <Card className={cn(
        "hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors",
        isCurrentUser && "border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/20"
      )}>
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Rank indicator */}
            <div className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm mr-3",
              weekly_rank === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" :
              weekly_rank === 2 ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" :
              weekly_rank === 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" :
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            )}>
              {weekly_rank}
            </div>
          
            {/* User info */}
            <div className="flex items-center">
              <UserAvatar
                user={{
                  id: entry.user_id,
                  name: profile?.full_name || 'Unknown',
                  image: profile?.avatar_url
                }}
                showStatus={false}
                size="sm"
              />
              
              <div className="ml-3">
                <div className="font-medium text-sm">
                  {profile?.full_name || 'Unknown'}
                  {isCurrentUser && (
                    <Badge className="ml-2 bg-indigo-100 text-indigo-800 border-indigo-200 text-xs dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{profile?.username || 'unknown'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Rank change indicator */}
            <div className="flex items-center">
              {weekly_change > 0 ? (
                <div className="flex items-center text-emerald-600 text-xs font-medium dark:text-emerald-400">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {weekly_change}
                </div>
              ) : weekly_change < 0 ? (
                <div className="flex items-center text-red-600 text-xs font-medium dark:text-red-400">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(weekly_change)}
                </div>
              ) : (
                <div className="flex items-center text-gray-500 text-xs font-medium">
                  <Minus className="h-3 w-3 mr-1" />
                </div>
              )}
            </div>
            
            {/* XP */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
              <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300">{xp} XP</span>
            </div>
            
            {/* Level */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="text-xs font-medium">{profile?.level || 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeaderboardCard;
