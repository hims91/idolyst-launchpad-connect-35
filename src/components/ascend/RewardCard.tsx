
import React from 'react';
import { motion } from "framer-motion";
import { useIconByName } from "@/hooks/use-icon-by-name";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const Icon = useIconByName(icon);
  const canClaim = currentXp >= xpCost;
  
  return (
    <TooltipProvider>
      <Card className={cn(
        "overflow-hidden h-full border transition-all",
        canClaim ? "border-purple-200 dark:border-purple-800" : "border-gray-200 dark:border-gray-800"
      )}>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col items-center text-center mb-4">
            <motion.div
              className={cn(
                "w-14 h-14 flex items-center justify-center rounded-full mb-3",
                canClaim ? "bg-purple-100 dark:bg-purple-900/30" : "bg-gray-100 dark:bg-gray-800"
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {Icon && <Icon className={cn(
                "h-7 w-7",
                canClaim ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
              )} />}
            </motion.div>
            
            <h3 className="text-base font-medium mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase">Cost</div>
                <div className="font-bold text-lg">
                  {xpCost} <span className="text-sm font-normal">XP</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase">Your XP</div>
                <div className={cn(
                  "font-medium",
                  canClaim ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}>
                  {currentXp} XP
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {canClaim ? (
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              onClick={onClaim}
              disabled={isLoading}
            >
              {isLoading ? "Claiming..." : "Claim Reward"}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="w-full"
                  variant="outline"
                  disabled
                >
                  Need {xpCost - currentXp} more XP
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You need {xpCost - currentXp} more XP to claim this reward</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default RewardCard;
