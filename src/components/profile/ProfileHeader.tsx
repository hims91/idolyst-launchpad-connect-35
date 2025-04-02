
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { ExtendedProfile } from "@/types/profile";
import { followUser, unfollowUser } from "@/api/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Edit, UserPlus, UserMinus, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, scaleAnimation } from "@/lib/animations";

interface ProfileHeaderProps {
  profile: ExtendedProfile;
  onRefresh: () => void;
}

const ProfileHeader = ({ profile, onRefresh }: ProfileHeaderProps) => {
  const { user } = useAuth();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const isOwnProfile = user?.id === profile.id;
  
  const handleFollowToggle = async () => {
    if (!user) return;
    
    setFollowLoading(true);
    
    if (isFollowing) {
      const success = await unfollowUser(user.id, profile.id);
      if (success) {
        setIsFollowing(false);
        onRefresh();
      }
    } else {
      const success = await followUser(user.id, profile.id);
      if (success) {
        setIsFollowing(true);
        onRefresh();
      }
    }
    
    setFollowLoading(false);
  };
  
  return (
    <>
      <motion.div 
        className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="relative">
          <Avatar 
            className="h-32 w-32 cursor-pointer transition-transform hover:scale-105"
            onClick={() => profile.avatar_url && setIsImageOpen(true)}
          >
            <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User"} />
            <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple text-4xl">
              {profile.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          
          <motion.div 
            className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-green-500 h-4 w-4 rounded-full"></div>
          </motion.div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold gradient-text">{profile.username}</h1>
          
          {profile.full_name && (
            <p className="text-idolyst-gray-dark text-lg">{profile.full_name}</p>
          )}
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            {profile.roles.map((role) => (
              <Badge 
                key={role.id}
                className={`${
                  role.role === "entrepreneur" 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                {role.is_verified && " ✓"}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-idolyst-gray-dark">
            <div className="text-center">
              <p className="font-bold text-lg">{profile.followers_count}</p>
              <p className="text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{profile.following_count}</p>
              <p className="text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{profile.xp}</p>
              <p className="text-sm">XP</p>
            </div>
          </div>
          
          {profile.bio && (
            <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">{profile.bio}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          {isOwnProfile ? (
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button asChild className="hover-scale gradient-bg w-full">
                <Link to="/profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={scaleAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`hover-scale w-full ${
                    isFollowing 
                      ? "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100" 
                      : "gradient-bg"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div
                variants={scaleAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="outline"
                  className="hover-scale w-full"
                  asChild
                >
                  <Link to={`/messages?user=${profile.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
          
          {profile.portfolio_url && (
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="outline"
                className="hover-scale w-full"
                onClick={() => window.open(profile.portfolio_url!, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Portfolio
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isImageOpen && profile.avatar_url && (
          <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
            <DialogContent className="sm:max-w-md p-1 bg-transparent border-none shadow-none">
              <motion.img
                src={profile.avatar_url}
                alt={profile.username || "Profile"}
                className="w-full h-auto rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileHeader;
