import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { updateProfile, addSocialLink, removeSocialLink } from '@/api/profile';
import Layout from '@/components/layout/Layout';
import { fadeInUp } from '@/lib/animations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileUpdatePayload, SocialLink } from '@/types/profile';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long'),
  full_name: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  professional_details: z.string().optional(),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  avatar_url: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileEdit = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      professional_details: profile?.professional_details || '',
      portfolio_url: profile?.portfolio_url || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        if (data) {
          setSocialLinks(data as unknown as SocialLink[]);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
        toast({
          variant: "destructive",
          title: "Error fetching social links",
        });
      }
    };

    fetchSocialLinks();
  }, [user?.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or GIF image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Avatar image must be less than 5MB.",
      });
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Failed to upload avatar",
      });
      return null;
    }
  };

  const handleAddSocialLink = async () => {
    if (!user?.id) return;
    if (!newPlatform || !newUrl) {
      toast({
        variant: "destructive",
        title: "Please enter both platform name and URL",
      });
      return;
    }

    try {
      const socialLink = {
        platform: newPlatform,
        url: newUrl,
        icon: getPlatformIcon(newPlatform),
      };
      
      const result = await addSocialLink(user.id, socialLink);
      if (result) {
        setSocialLinks([...socialLinks, result]);
        setNewPlatform('');
        setNewUrl('');
      }
    } catch (error) {
      console.error('Error adding social link:', error);
    }
  };

  const getPlatformIcon = (platform: string): string => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return 'linkedin';
    if (platformLower.includes('twitter') || platformLower.includes('x')) return 'twitter';
    if (platformLower.includes('github')) return 'github';
    if (platformLower.includes('instagram')) return 'instagram';
    if (platformLower.includes('facebook')) return 'facebook';
    return 'link';
  };

  const handleRemoveSocialLink = async (linkId: string) => {
    try {
      const success = await removeSocialLink(linkId);
      if (success) {
        setSocialLinks(socialLinks.filter(link => link.id !== linkId));
      }
    } catch (error) {
      console.error('Error removing social link:', error);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let avatarUrl = data.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const profileData: ProfileUpdatePayload = {
        ...data,
        avatar_url: avatarUrl || undefined,
      };
      
      const success = await updateProfile(user.id, profileData);
      if (success) {
        await refreshProfile();
        toast({
          title: "Profile updated successfully",
        });
        navigate('/profile');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
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
      <motion.div 
        className="max-w-3xl mx-auto pb-20 md:pb-10 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-2xl font-bold mb-6 gradient-text">Edit Profile</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 group-hover:border-idolyst-purple transition-all">
                      <AvatarImage src={avatarPreview || undefined} alt={profile.username || 'Profile'} />
                      <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple text-xl">
                        {profile.username ? profile.username.slice(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white"
                    >
                      <Upload className="h-6 w-6" />
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                        if (!validTypes.includes(file.type)) {
                          toast({
                            variant: "destructive",
                            title: "Invalid file type",
                            description: "Please upload a JPG, PNG, or GIF image.",
                          });
                          return;
                        }
                        
                        if (file.size > 5 * 1024 * 1024) { // 5MB
                          toast({
                            variant: "destructive",
                            title: "File too large",
                            description: "Avatar image must be less than 5MB.",
                          });
                          return;
                        }
                        
                        setAvatarFile(file);
                        const previewUrl = URL.createObjectURL(file);
                        setAvatarPreview(previewUrl);
                      }}
                      className="hidden" 
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click to upload new avatar</p>
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Bio</FormLabel>
                        <span className="text-xs text-gray-500">
                          {field.value?.length || 0}/200
                        </span>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell others about yourself" 
                          className="resize-none" 
                          rows={4}
                          maxLength={200}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professional_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Details</FormLabel>
                      <FormControl>
                        <Input placeholder="LinkedIn username or professional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio or Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-website.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  
                  <div className="space-y-3">
                    {socialLinks.map((link) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-24">
                            <p className="text-sm font-medium capitalize">{link.platform}</p>
                          </div>
                          <Input
                            value={link.url}
                            readOnly
                            className="flex-1"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSocialLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Input
                      placeholder="Platform (e.g. Twitter)"
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value)}
                      className="w-full max-w-[180px]"
                    />
                    <Input
                      placeholder="URL"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSocialLink}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-bg hover-scale"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default ProfileEdit;
