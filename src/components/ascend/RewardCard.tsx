
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIconByName } from "@/hooks/use-icon-by-name";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  name: string;
  description: string;
  xpCost: number;
  icon: string;
  currentXp: number;
  onClaim: () => void;
  isLoading?: boolean;
}

const RewardCard: React.FC<RewardCardProps> = ({
  name,
  description,
  xpCost,
  icon,
  currentXp,
  onClaim,
  isLoading = false
}) => {
  const IconComponent = useIconByName(icon);
  const canClaim = currentXp >= xpCost;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden",
        canClaim && "border-indigo-200 dark:border-indigo-800"
      )}>
        <CardContent className="pt-6 px-6">
          <div className="flex items-start mb-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mr-4",
              canClaim 
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start pt-0 px-6 pb-6 gap-3">
          <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-md p-2 flex justify-between items-center">
            <span className="text-sm font-medium">Cost:</span>
            <span className={cn(
              "font-bold",
              canClaim ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"
            )}>
              {xpCost} XP
            </span>
          </div>
          
          {!canClaim && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              You need {xpCost - currentXp} more XP to claim this reward.
            </p>
          )}
          
          <Button 
            onClick={onClaim} 
            variant={canClaim ? "default" : "outline"}
            className={cn(
              "w-full",
              canClaim 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" 
                : "text-gray-500"
            )}
            disabled={!canClaim || isLoading}
          >
            {isLoading ? "Claiming..." : canClaim ? "Claim Reward" : "Not Enough XP"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RewardCard;
