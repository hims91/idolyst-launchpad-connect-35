import React from 'react';
import { UserPlus, Users, GitPullRequest, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedProfile } from "@/types/profile";
import AscendStats from "./AscendStats";

interface ProfileStatsProps {
  profile: ExtendedProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const stats = [
    {
      name: "Following",
      value: profile.followingCount || 0,
      icon: UserPlus
    },
    {
      name: "Followers",
      value: profile.followersCount || 0,
      icon: Users 
    },
    {
      name: "Pitches",
      value: profile.pitchesCount || 0,
      icon: GitPullRequest
    },
    {
      name: "Comments",
      value: profile.commentsCount || 0,
      icon: MessageSquare
    }
  ];
  
  return (
    <div className="space-y-6 my-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.name}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Add Ascend Stats section */}
      <AscendStats userId={profile.id} />
    </div>
  );
};

export default ProfileStats;
