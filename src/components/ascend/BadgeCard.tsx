
import React from 'react';
import { motion } from "framer-motion";
import { useIconByName } from "@/hooks/use-icon-by-name";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  isEarned: boolean;
  earnedAt?: string;
  progress?: number;
  target?: number;
  progressPercent?: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  icon,
  isEarned,
  earnedAt,
  progress,
  target,
  progressPercent = 0
}) => {
  const Icon = useIconByName(icon);
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Card 
            className={cn(
              "overflow-hidden transition-all duration-300 h-full",
              isEarned 
                ? "border-amber-200 dark:border-amber-800" 
                : "border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100"
            )}
          >
            <CardContent className="p-4 flex flex-col items-center text-center h-full">
              <div className="relative">
                <motion.div
                  className={cn(
                    "w-16 h-16 flex items-center justify-center rounded-full mb-3 mt-2",
                    isEarned 
                      ? "bg-amber-100 dark:bg-amber-900/30" 
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                  whileHover={isEarned ? { rotate: 360, scale: 1.1 } : { scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  {Icon && <Icon className={cn(
                    "h-8 w-8",
                    isEarned ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"
                  )} />}
                </motion.div>
                
                {!isEarned && (
                  <div className="absolute -top-1 -right-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                    <Lock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              
              <h3 className={cn(
                "text-sm font-medium mb-1",
                isEarned ? "text-amber-800 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
              )}>
                {name}
              </h3>
              
              {isEarned && earnedAt && (
                <div className="text-xs text-muted-foreground mb-2">
                  Earned {format(new Date(earnedAt), 'MMM d, yyyy')}
                </div>
              )}
              
              {!isEarned && typeof progressPercent !== 'undefined' && (
                <div className="w-full mt-2">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {progress}/{target} ({progressPercent}%)
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-[200px] text-center">
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          {!isEarned && progress !== undefined && target !== undefined && (
            <p className="text-xs mt-1">{progress}/{target} progress</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeCard;
