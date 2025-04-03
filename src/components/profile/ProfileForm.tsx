
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ExtendedProfile } from '@/types/profile';
import { fadeInUp, scaleAnimation } from '@/lib/animations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Button } from '@/components/ui/button';
import { Upload, XCircle, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SocialLink } from '@/types/profile';
import { useDropzone } from 'react-dropzone';

// Form validation schema
const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  full_name: z.string().optional(),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  professional_details: z.string().optional(),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  byline: z.string().max(100, 'Byline must be less than 100 characters').optional(),
  location: z.string().optional(),
  avatar_url: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: ExtendedProfile | null;
  onSubmit: (data: ProfileFormData, avatarFile: File | null) => Promise<void>;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, isLoading }) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState<boolean>(false);
  const [bioLength, setBioLength] = useState<number>(profile?.bio?.length || 0);

  // Initialize form with profile data
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      professional_details: profile?.professional_details || '',
      portfolio_url: profile?.portfolio_url || '',
      byline: profile?.byline || '',
      location: profile?.location || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  // Watch bio field for character count
  const bioField = form.watch('bio');
  const usernameField = form.watch('username');

  // Update bio length when it changes
  useEffect(() => {
    setBioLength(bioField?.length || 0);
  }, [bioField]);

  // Check username availability with debounce
  useEffect(() => {
    if (!usernameField || usernameField.length < 3 || usernameField === profile?.username) {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setUsernameChecking(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', usernameField)
          .not('id', 'eq', profile?.id || '')
          .maybeSingle();

        setUsernameAvailable(!data);
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setUsernameChecking(false);
      }
    };

    const timer = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameField, profile?.id, profile?.username]);

  // Fetch social links
  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!profile?.id) return;
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', profile.id);
        
        if (error) throw error;
        if (data) {
          setSocialLinks(data as SocialLink[]);
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
  }, [profile?.id]);

  // Add new social link
  const handleAddSocialLink = async () => {
    if (!profile?.id) return;
    if (!newPlatform || !newUrl) {
      toast({
        variant: "destructive",
        title: "Please enter both platform name and URL",
      });
      return;
    }

    try {
      const platformIcon = getPlatformIcon(newPlatform);
      
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          user_id: profile.id,
          platform: newPlatform,
          url: newUrl,
          icon: platformIcon,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSocialLinks([...socialLinks, data as SocialLink]);
      setNewPlatform('');
      setNewUrl('');
      
      toast({
        title: "Social link added",
      });
    } catch (error: any) {
      console.error('Error adding social link:', error);
      toast({
        variant: "destructive",
        title: "Error adding social link",
        description: error.message,
      });
    }
  };

  // Remove social link
  const handleRemoveSocialLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
      
      setSocialLinks(socialLinks.filter(link => link.id !== linkId));
      
      toast({
        title: "Social link removed",
      });
    } catch (error: any) {
      console.error('Error removing social link:', error);
      toast({
        variant: "destructive",
        title: "Error removing social link",
        description: error.message,
      });
    }
  };

  // Dropzone for avatar upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Avatar image must be less than 5MB.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: error?.message || "The file you uploaded is not valid.",
        });
      }
    }
  });

  // Helper to get platform icon
  const getPlatformIcon = (platform: string): string => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return 'linkedin';
    if (platformLower.includes('twitter') || platformLower.includes('x')) return 'twitter';
    if (platformLower.includes('github')) return 'github';
    if (platformLower.includes('instagram')) return 'instagram';
    if (platformLower.includes('facebook')) return 'facebook';
    if (platformLower.includes('youtube')) return 'youtube';
    if (platformLower.includes('medium')) return 'medium';
    if (platformLower.includes('dev.to')) return 'dev';
    return 'link';
  };

  // Handle form submission
  const handleFormSubmit = async (data: ProfileFormData) => {
    await onSubmit(data, avatarFile);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Avatar Upload with Drag & Drop */}
          <div className="flex flex-col items-center mb-8">
            <div 
              {...getRootProps()} 
              className={`relative group cursor-pointer transition-all duration-200 ${
                isDragActive ? 'scale-105' : ''
              }`}
            >
              <Avatar className="w-24 h-24 border-2 group-hover:border-idolyst-purple transition-all">
                <AvatarImage src={avatarPreview || undefined} alt={profile?.username || 'Profile'} />
                <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple text-xl">
                  {profile?.username ? profile.username.slice(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full ${
                  isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity text-white`}
              >
                <Upload className="h-6 w-6" />
              </div>
              <input {...getInputProps()} />
              {avatarFile && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarFile(null);
                    setAvatarPreview(profile?.avatar_url || null);
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {isDragActive ? 'Drop your image here' : 'Click or drag to upload new avatar'}
            </p>
            {avatarFile && (
              <p className="text-xs text-green-600 mt-1">
                {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Username Field with Availability Check */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      placeholder="Enter username" 
                      {...field} 
                      className={usernameAvailable === false ? "border-red-500 pr-10" : ""}
                    />
                  </FormControl>
                  {usernameChecking && (
                    <div className="absolute right-3 top-2.5">
                      <div className="h-4 w-4 border-2 border-idolyst-purple border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!usernameChecking && usernameAvailable !== null && (
                    <div className="absolute right-3 top-2.5">
                      {usernameAvailable ? (
                        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
                {usernameAvailable === false && !usernameChecking && (
                  <p className="text-sm font-medium text-red-500">Username is already taken</p>
                )}
                {usernameAvailable === true && !usernameChecking && (
                  <p className="text-sm font-medium text-green-500">Username is available</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name Field */}
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

          {/* Byline Field */}
          <FormField
            control={form.control}
            name="byline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Byline</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="A short description (e.g., 'Software Engineer at Idolyst')" 
                    {...field} 
                    maxLength={100}
                  />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  A short phrase that appears under your name
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio Field with Character Counter */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Bio</FormLabel>
                  <span className={`text-xs ${bioLength > 180 ? 'text-amber-500' : bioLength > 195 ? 'text-red-500' : 'text-gray-500'}`}>
                    {bioLength}/200
                  </span>
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Tell others about yourself" 
                    className="resize-none" 
                    rows={4}
                    maxLength={200}
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      setBioLength(e.target.value.length);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Professional Details Field */}
          <FormField
            control={form.control}
            name="professional_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your professional experience, skills, etc."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portfolio URL Field */}
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

          {/* Social Links Section with Enhanced UI */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-medium">Social Links</h3>
            
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <motion.div 
                  key={link.id} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-24 flex items-center gap-2">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800`}>
                        {getPlatformIcon(link.platform) === 'linkedin' && <i className="text-blue-600 text-sm fab fa-linkedin-in" />}
                        {getPlatformIcon(link.platform) === 'twitter' && <i className="text-blue-400 text-sm fab fa-twitter" />}
                        {getPlatformIcon(link.platform) === 'github' && <i className="text-gray-900 dark:text-white text-sm fab fa-github" />}
                        {getPlatformIcon(link.platform) === 'instagram' && <i className="text-pink-600 text-sm fab fa-instagram" />}
                        {getPlatformIcon(link.platform) === 'facebook' && <i className="text-blue-700 text-sm fab fa-facebook-f" />}
                        {getPlatformIcon(link.platform) === 'youtube' && <i className="text-red-600 text-sm fab fa-youtube" />}
                        {getPlatformIcon(link.platform) === 'medium' && <i className="text-gray-900 dark:text-white text-sm fab fa-medium-m" />}
                        {getPlatformIcon(link.platform) === 'dev' && <i className="text-gray-900 dark:text-white text-sm fab fa-dev" />}
                        {getPlatformIcon(link.platform) === 'link' && <i className="text-gray-600 text-sm fas fa-link" />}
                      </div>
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
                </motion.div>
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

          {/* Save & Cancel Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                className="gradient-bg hover-scale"
                disabled={isLoading || usernameAvailable === false || usernameChecking}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileForm;
