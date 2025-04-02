
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import { ProfileUpdatePayload } from "@/types/profile";
import { updateProfile } from "@/api/profile";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, ArrowLeft, Camera, Loader2, Save, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fadeInUp, scaleAnimation } from "@/lib/animations";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileEdit = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm<ProfileUpdatePayload>({
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      professional_details: profile?.professional_details || "",
      portfolio_url: profile?.portfolio_url || "",
    },
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);
  
  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  // Remove selected avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    
    // Reset file input
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  
  // Upload avatar to storage
  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return profile?.avatar_url || null;
    
    try {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from("profiles")
        .upload(filePath, avatarFile, {
          upsert: true,
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percentage));
          }
        });
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrl } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);
        
      return publicUrl.publicUrl;
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast({
        variant: "destructive",
        title: "Avatar upload failed",
        description: error.message,
      });
      return null;
    }
  };
  
  // Submit form
  const onSubmit = async (data: ProfileUpdatePayload) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload avatar if selected
      let avatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id);
      }
      
      // Update profile
      const success = await updateProfile(user.id, {
        ...data,
        avatar_url: avatarUrl || undefined,
      });
      
      if (success) {
        await refreshProfile();
        navigate(`/profile/${user.id}`);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-10">
        <motion.div 
          className="flex items-center mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold ml-2">Edit Profile</h1>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={avatarPreview || profile?.avatar_url || ""} 
                      alt={profile?.username || "User"} 
                    />
                    <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple text-2xl">
                      {profile?.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6" />
                  </label>
                  
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-lg font-medium mb-2">Profile Picture</h2>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload a new profile picture. JPG, PNG or GIF, max 5MB.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {avatarPreview ? "Change Image" : "Upload Image"}
                    </Button>
                    
                    {(avatarPreview || profile?.avatar_url) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemoveAvatar}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Bio */}
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
                        placeholder="Tell others about yourself (max 200 chars)" 
                        className="resize-none"
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Professional Details */}
              <FormField
                control={form.control}
                name="professional_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your LinkedIn username" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Portfolio URL */}
              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://your-portfolio.com" 
                        type="url"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Social links can be added in the settings section.
                </AlertDescription>
              </Alert>
              
              <div className="pt-4 flex justify-end">
                <motion.div
                  variants={scaleAnimation}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    type="submit" 
                    className="gradient-bg hover-scale"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {avatarFile && uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfileEdit;
