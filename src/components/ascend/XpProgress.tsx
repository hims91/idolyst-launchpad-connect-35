
import React from 'react';
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { LevelUp } from "lucide-react";

interface XpProgressProps {
  currentXp: number;
  level: number;
  nextLevelXp: number;
  progress: number;
  className?: string;
}

const XpProgress: React.FC<XpProgressProps> = ({
  currentXp,
  level,
  nextLevelXp,
  progress,
  className
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md"
          >
            {level}
          </motion.div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Level {level}</h3>
            <p className="text-xs text-muted-foreground">Next Level at {nextLevelXp} XP</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{currentXp} XP</span>
          <div className="text-xs text-muted-foreground">
            {nextLevelXp - currentXp} XP to Level {level + 1}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <Progress
          value={progress}
          className="h-2 bg-indigo-100 dark:bg-indigo-950"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute right-0 -bottom-3"
          style={{
            right: `${100 - Math.min(100, progress)}%`,
            transform: 'translateX(50%)'
          }}
        >
          <LevelUp className="w-4 h-4 text-indigo-500" />
        </motion.div>
      </div>
    </div>
  );
};

export default XpProgress;
