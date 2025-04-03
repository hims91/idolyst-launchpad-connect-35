
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { useIconByName } from "@/hooks/use-icon-by-name";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  isEarned?: boolean;
  earnedAt?: string;
  progress?: number;
  target?: number;
  progressPercent?: number;
  onClick?: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  icon,
  isEarned = false,
  earnedAt,
  progress = 0,
  target = 100,
  progressPercent = 0,
  onClick
}) => {
  const IconComponent = useIconByName(icon);
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: isEarned ? 1 : 0.97 }}
      animate={isEarned ? { rotate: [0, 5, -5, 0] } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 15,
        duration: 0.5
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 h-full",
        isEarned ? "border-2 border-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20" : "opacity-80"
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center gap-3">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mt-2",
              isEarned 
                ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30" 
                : "bg-gray-100 dark:bg-gray-800"
            )}>
              {IconComponent && (
                <IconComponent 
                  className={cn(
                    "w-8 h-8",
                    isEarned ? "text-indigo-500" : "text-gray-400"
                  )} 
                />
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1">{name}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            
            {isEarned ? (
              <Badge 
                variant="outline" 
                className="bg-green-50 text-green-700 border-green-200 text-xs dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              >
                Earned {earnedAt ? format(new Date(earnedAt), 'MMM d, yyyy') : ''}
              </Badge>
            ) : (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{progress} / {target}</span>
                  <span className="text-muted-foreground">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeCard;
