
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { ProfileUpdatePayload } from '@/types/profile';
import { useProfileUpdate } from '@/hooks/use-profile';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp } from '@/lib/animations';
import ProfileForm, { ProfileFormData } from '@/components/profile/ProfileForm';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ProfileEdit = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { updateUserProfile, isLoading } = useProfileUpdate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (isMounted && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, navigate, isMounted]);

  const handleSubmit = async (data: ProfileFormData, avatarFile: File | null) => {
    const profileData: ProfileUpdatePayload = {
      username: data.username,
      full_name: data.full_name || undefined,
      bio: data.bio || undefined,
      professional_details: data.professional_details || undefined,
      portfolio_url: data.portfolio_url || undefined,
      byline: data.byline || undefined,
      location: data.location || undefined,
      avatar_url: data.avatar_url || undefined,
    };
    
    const success = await updateUserProfile(profileData, avatarFile);
    
    if (success) {
      navigate('/profile');
    }
  };

  if (!user || !profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idolyst-purple"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Edit Profile | Idolyst</title>
        <meta name="description" content="Update your profile information on Idolyst" />
      </Helmet>
      
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-10 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Edit Profile</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <ProfileForm 
              profile={profile} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default ProfileEdit;
