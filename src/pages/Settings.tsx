
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ShieldCheck, Bell, User } from "lucide-react";

enum SettingsTabs {
  PROFILE = "profile",
  NOTIFICATIONS = "notifications",
  PRIVACY = "privacy"
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>(SettingsTabs.PROFILE);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have a hash in the URL to set the initial tab
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && Object.values(SettingsTabs).includes(hash as SettingsTabs)) {
      setActiveTab(hash);
    }
  }, [location.hash]);
  
  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-0 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-6">Settings</h1>
        
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value={SettingsTabs.PROFILE} className="flex items-center gap-1 data-[state=active]:bg-idolyst-purple/10 data-[state=active]:text-idolyst-purple">
                  <User className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value={SettingsTabs.NOTIFICATIONS} className="flex items-center gap-1 data-[state=active]:bg-idolyst-purple/10 data-[state=active]:text-idolyst-purple">
                  <Bell className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value={SettingsTabs.PRIVACY} className="flex items-center gap-1 data-[state=active]:bg-idolyst-purple/10 data-[state=active]:text-idolyst-purple">
                  <ShieldCheck className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={SettingsTabs.PROFILE} className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold gradient-text mb-4">Profile Settings</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Manage your profile information and account settings.
                    </p>
                    
                    <div className="flex justify-center md:justify-start">
                      <Button asChild>
                        <a href="/profile/edit" className="inline-flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Edit Profile
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value={SettingsTabs.NOTIFICATIONS} className="mt-0">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value={SettingsTabs.PRIVACY} className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold gradient-text mb-4">Privacy Settings</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Control your privacy settings and what information is visible to others.
                    </p>
                    
                    {/* Privacy settings content will go here in future iterations */}
                    <div className="text-center md:text-left">
                      <p className="text-gray-500 dark:text-gray-400">
                        Privacy settings coming soon...
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
