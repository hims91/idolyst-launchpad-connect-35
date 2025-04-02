
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  LogOut, 
  Mail, 
  Settings as SettingsIcon, 
  Shield, 
  Smartphone, 
  Trash2, 
  User
} from "lucide-react";
import { updatePrivacySettings } from "@/api/profile";
import { fadeInUp } from "@/lib/animations";

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  new_follower: boolean;
  new_message: boolean;
  mention: boolean;
  comment: boolean;
  pitch_feedback: boolean;
  mentorship_request: boolean;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("account");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form for privacy settings
  const privacyForm = useForm({
    defaultValues: {
      profile_visibility: "public",
      messaging_permissions: "everyone",
      activity_visibility: "public",
    }
  });
  
  // Form for notification settings
  const notificationForm = useForm<NotificationSettings>({
    defaultValues: {
      email_notifications: true,
      push_notifications: true,
      in_app_notifications: true,
      new_follower: true,
      new_message: true,
      mention: true,
      comment: true,
      pitch_feedback: true,
      mentorship_request: true,
    }
  });
  
  // Handle privacy settings update
  const onPrivacySubmit = async (data: any) => {
    if (!user) return;
    
    setIsLoading(true);
    await updatePrivacySettings(user.id, data);
    setIsLoading(false);
  };
  
  // Handle notification settings update
  const onNotificationSubmit = async (data: NotificationSettings) => {
    setIsLoading(true);
    // Here you would update notification settings in the database
    console.log("Notification settings:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    // Here you would implement account deletion logic
    await signOut();
    navigate("/");
  };
  
  // Go back
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-10">
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
          <h1 className="text-2xl font-bold ml-2">Settings</h1>
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-1/4 border-r">
                <TabsList className="flex flex-row md:flex-col h-auto w-full p-0 bg-transparent gap-0">
                  <TabsTrigger 
                    value="account" 
                    className="justify-start px-6 py-4 w-full data-[state=active]:border-r-0 data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-idolyst-purple"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start px-6 py-4 w-full data-[state=active]:border-r-0 data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-idolyst-purple"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="privacy" 
                    className="justify-start px-6 py-4 w-full data-[state=active]:border-r-0 data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-idolyst-purple"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start px-6 py-4 w-full data-[state=active]:border-r-0 data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 data-[state=active]:border-idolyst-purple"
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <TabsContent value="account" className="mt-0">
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Address</h3>
                      <div className="flex items-center gap-4">
                        <Input
                          value={user?.email}
                          readOnly
                          className="max-w-xs"
                        />
                        <Button variant="outline">Change Email</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Permanently delete your account and all of your content.
                      </p>
                      <Button 
                        variant="destructive" 
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline"
                        className="text-gray-500"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Channels</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="email_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <FormLabel className="m-0">Email Notifications</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="push_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Smartphone className="h-5 w-5" />
                                <FormLabel className="m-0">Push Notifications</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="in_app_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <FormLabel className="m-0">In-App Notifications</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Types</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="new_follower"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">New Follower</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="new_message"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">New Message</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="mention"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">Mentions</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">Comments</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="pitch_feedback"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">Pitch Feedback</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="mentorship_request"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel className="m-0">Mentorship Requests</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="gradient-bg" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Notification Settings"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="privacy" className="mt-0">
                  <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                  
                  <Form {...privacyForm}>
                    <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                      <FormField
                        control={privacyForm.control}
                        name="profile_visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Visibility</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select who can see your profile" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">Public - Everyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private - Only Me</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="messaging_permissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Who can message you</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select who can message you" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="everyone">Everyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="none">No One</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="activity_visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Feed Visibility</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select who can see your activity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">Public - Everyone</SelectItem>
                                <SelectItem value="followers">Followers Only</SelectItem>
                                <SelectItem value="private">Private - Only Me</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="gradient-bg" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Privacy Settings"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button>Enable 2FA</Button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Session Management</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Manage your active sessions and sign out from other devices.
                      </p>
                      <Button variant="outline">Manage Sessions</Button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Login History</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Review your recent login activity.
                      </p>
                      <Button variant="outline">View Login History</Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Settings;
