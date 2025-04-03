
import React from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// XP required for each level
const XP_PER_LEVEL = [
  0,      // Level 1 (starts at 0 XP)
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5500,   // Level 8
  8000,   // Level 9
  11000,  // Level 10
  // Add more levels as needed
];

interface XpProgressProps {
  xp: number;
  level: number;
  variant?: 'default' | 'small' | 'minimal';
  className?: string;
  showLabel?: boolean;
}

// Variants for different sizes/styles
const progressBarVariants = cva(
  "h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500",
  {
    variants: {
      variant: {
        default: "h-2",
        small: "h-1.5",
        minimal: "h-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const XpProgress: React.FC<XpProgressProps> = ({
  xp,
  level,
  variant = 'default',
  className,
  showLabel = true,
}) => {
  // Calculate XP for the next level
  const currentLevelXp = XP_PER_LEVEL[level - 1] || 0;
  const nextLevelXp = XP_PER_LEVEL[level] || (currentLevelXp * 1.5);
  
  // Calculate progress percentage
  const xpForCurrentLevel = xp - currentLevelXp;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = Math.min(100, (xpForCurrentLevel / xpRequiredForNextLevel) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Level {level}</span>
            <span className="text-gray-500">({xp} XP)</span>
          </div>
          <span>{xpForCurrentLevel}/{xpRequiredForNextLevel} XP to Level {level + 1}</span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={progressBarVariants({ variant })}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      {variant === 'default' && (
        <div className="relative w-full mt-1">
          <div 
            className="absolute left-0 w-2 h-2 rounded-full bg-purple-500"
            style={{ left: '0%' }}
          />
          <div 
            className="absolute right-0 w-2 h-2 rounded-full bg-pink-500"
            style={{ right: '0%' }}
          />
        </div>
      )}
    </div>
  );
};

export default XpProgress;
