
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus, Search, User } from "lucide-react";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "@/api/profile";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface FollowersDialogProps {
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "followers" | "following";
}

const FollowersDialog = ({ userId, isOpen, onOpenChange, initialTab = "followers" }: FollowersDialogProps) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<"followers" | "following">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, userId, currentTab]);
  
  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);
  
  const loadData = async () => {
    setLoading(true);
    
    if (currentTab === "followers") {
      const { followers } = await fetchFollowers(userId);
      setFollowers(followers);
    } else {
      const { following } = await fetchFollowing(userId);
      setFollowing(following);
    }
    
    setLoading(false);
  };
  
  const handleFollow = async (targetUserId: string) => {
    if (!user) return;
    
    setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
    
    const success = await followUser(user.id, targetUserId);
    if (success) {
      loadData();
    }
    
    setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
  };
  
  const handleUnfollow = async (targetUserId: string) => {
    if (!user) return;
    
    setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
    
    const success = await unfollowUser(user.id, targetUserId);
    if (success) {
      loadData();
    }
    
    setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
  };
  
  const filteredData = (currentTab === "followers" ? followers : following).filter(
    profile => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        (profile.username?.toLowerCase().includes(query)) || 
        (profile.full_name?.toLowerCase().includes(query))
      );
    }
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentTab === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={currentTab} value={currentTab} onValueChange={(v) => setCurrentTab(v as "followers" | "following")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TabsContent value={currentTab} className="mt-0 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-idolyst-purple"></div>
              </div>
            ) : filteredData.length > 0 ? (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {filteredData.map((profile) => (
                  <motion.div 
                    key={profile.id}
                    variants={staggerItem}
                    className="flex items-center justify-between"
                  >
                    <Link 
                      to={`/profile/${profile.id}`}
                      className="flex items-center space-x-3 flex-1 min-w-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User"} />
                        <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple">
                          {profile.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="font-medium text-sm">
                          {profile.username || "User"}
                        </p>
                        {profile.full_name && (
                          <p className="text-gray-500 text-xs truncate">{profile.full_name}</p>
                        )}
                      </div>
                    </Link>
                    
                    {user && user.id !== profile.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => profile.is_following ? 
                          handleUnfollow(profile.id) : 
                          handleFollow(profile.id)
                        }
                        disabled={followLoading[profile.id]}
                        className={profile.is_following ? "text-gray-600" : "text-idolyst-purple"}
                      >
                        {profile.is_following ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-1" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-10">
                <User className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  {currentTab === "followers" ? "No followers yet" : "Not following anyone yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
