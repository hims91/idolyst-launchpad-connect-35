
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { fetchExtendedProfile } from "@/api/profile";
import { ExtendedProfile } from "@/types/profile";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActivity from "@/components/profile/ProfileActivity";
import SocialLinks from "@/components/profile/SocialLinks";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FollowersDialog from "@/components/profile/FollowersDialog";
import { User } from "lucide-react";

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<"followers" | "following">("followers");
  
  useEffect(() => {
    loadProfile();
  }, [id, user]);
  
  const loadProfile = async () => {
    if (!id) {
      // If no ID provided, redirect to the current user's profile
      if (user) {
        navigate(`/profile/${user.id}`);
      } else {
        navigate("/profile");
      }
      return;
    }
    
    setLoading(true);
    const profileData = await fetchExtendedProfile(id, user?.id);
    setProfile(profileData);
    setLoading(false);
  };
  
  const handleFollowersClick = () => {
    setActiveDialog("followers");
    setFollowersDialogOpen(true);
  };
  
  const handleFollowingClick = () => {
    setActiveDialog("following");
    setFollowersDialogOpen(true);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idolyst-purple"></div>
        </div>
      </Layout>
    );
  }
  
  if (!profile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-gray-500 mb-6">
            The profile you're looking for doesn't exist or you may not have permission to view it.
          </p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-10">
        <ProfileHeader profile={profile} onRefresh={loadProfile} />
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
};

export default ProfileDetail;
