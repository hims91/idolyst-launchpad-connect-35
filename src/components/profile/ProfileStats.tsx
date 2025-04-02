
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ExtendedProfile, Badge } from "@/types/profile";
import { fadeInUp } from "@/lib/animations";

interface ProfileStatsProps {
  profile: ExtendedProfile;
}

const ProfileStats = ({ profile }: ProfileStatsProps) => {
  // Calculate level based on XP
  const calculateLevel = (xp: number) => {
    return Math.floor(Math.sqrt(xp / 10)) + 1;
  };
  
  // Calculate XP needed for next level
  const calculateNextLevelXp = (currentLevel: number) => {
    const nextLevel = currentLevel + 1;
    return nextLevel * nextLevel * 10;
  };
  
  const currentLevel = calculateLevel(profile.xp);
  const nextLevelXp = calculateNextLevelXp(currentLevel);
  const previousLevelXp = calculateNextLevelXp(currentLevel - 1);
  const levelProgress = ((profile.xp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100;
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Stats & Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">Level {currentLevel}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profile.xp} / {nextLevelXp} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-gray-200" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Top Skills</h3>
            {/* This would be dynamic based on user skills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Leadership</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Marketing</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pitch Strategy</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Innovation</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Startup Growth</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Earned Badges</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {profile.badges.length > 0 ? (
              profile.badges.map((badge: Badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-idolyst-purple/10 flex items-center justify-center mb-1">
                    <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-medium">{badge.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-4">No badges earned yet</p>
            )}
            {/* Placeholder badges for visual balance */}
            {profile.badges.length > 0 && profile.badges.length < 8 && (
              Array.from({ length: Math.min(8 - profile.badges.length, 8) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="flex flex-col items-center text-center opacity-40">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                    <span className="text-gray-400">?</span>
                  </div>
                  <span className="text-xs text-gray-400">Locked</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStats;
