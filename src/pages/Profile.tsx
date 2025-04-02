
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExtendedProfile } from "@/types/profile";
import { fetchExtendedProfile } from "@/api/profile";
import { useAuth } from "@/providers/AuthProvider";
import Layout from "../components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActivity from "@/components/profile/ProfileActivity";
import SocialLinks from "@/components/profile/SocialLinks";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FollowersDialog from "@/components/profile/FollowersDialog";
import { fadeInUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, Settings, User, UserPlus } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<"followers" | "following">("followers");
  
  useEffect(() => {
    if (authLoading) return;
    
    if (isAuthenticated && user) {
      loadProfile(user.id);
    }
  }, [user, isAuthenticated, authLoading]);
  
  const loadProfile = async (userId: string) => {
    setLoading(true);
    const profileData = await fetchExtendedProfile(userId);
    setProfile(profileData);
    setLoading(false);
  };
  
  const handleFollowersClick = () => {
    if (!profile) return;
    setActiveDialog("followers");
    setFollowersDialogOpen(true);
  };
  
  const handleFollowingClick = () => {
    if (!profile) return;
    setActiveDialog("following");
    setFollowersDialogOpen(true);
  };
  
  // Authenticated user view with profile data
  if (isAuthenticated && profile) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto pb-20 md:pb-10">
          <div className="flex justify-between items-center mb-6">
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              My Profile
            </motion.h1>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Button variant="outline" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <ProfileHeader profile={profile} onRefresh={() => loadProfile(user!.id)} />
          <ProfileStats profile={profile} />
          <ProfileActivity profile={profile} />
          <SocialLinks profile={profile} />
          <ProfileTabs 
            profile={profile} 
            onFollowersClick={handleFollowersClick} 
            onFollowingClick={handleFollowingClick}
          />
          
          <FollowersDialog
            userId={profile.id}
            isOpen={followersDialogOpen}
            onOpenChange={setFollowersDialogOpen}
            initialTab={activeDialog}
          />
        </div>
      </Layout>
    );
  }
  
  // Loading state
  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idolyst-purple"></div>
        </div>
      </Layout>
    );
  }
  
  // Not authenticated view
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <motion.div 
          className="flex flex-col items-center justify-center py-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <User className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Profile</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Manage your profile, track your activity, and connect with other entrepreneurs and mentors.
          </p>
          
          <div className="flex gap-4">
            <Button 
              className="gradient-bg hover-scale"
              asChild
            >
              <Link to="/auth/login">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="hover-scale"
              asChild
            >
              <Link to="/auth/signup">
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
