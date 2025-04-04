
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/hooks/use-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save } from "lucide-react";

const AdminSettings = () => {
  const { useAdminSettings, useUpdateAdminSetting, getSiteSettings, getModerationSettings, getNotificationSettings } = useAdmin();
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: updateSetting, isPending: isUpdating } = useUpdateAdminSetting();
  
  // Extract settings with proper typing
  const siteSettings = settings ? getSiteSettings(settings) : null;
  const moderationSettings = settings ? getModerationSettings(settings) : null;
  const notificationSettings = settings ? getNotificationSettings(settings) : null;
  
  // Local state for form values
  const [siteName, setSiteName] = useState(siteSettings?.site_name || "");
  const [maintenanceMode, setMaintenanceMode] = useState(siteSettings?.maintenance_mode || false);
  const [requireApproval, setRequireApproval] = useState(moderationSettings?.require_approval_for_new_users || false);
  const [adminEmail, setAdminEmail] = useState(notificationSettings?.admin_email || "");
  const [alertOnReports, setAlertOnReports] = useState(notificationSettings?.alert_on_reports || true);
  
  // Update local state when settings are loaded
  React.useEffect(() => {
    if (siteSettings) {
      setSiteName(siteSettings.site_name);
      setMaintenanceMode(siteSettings.maintenance_mode);
    }
    
    if (moderationSettings) {
      setRequireApproval(moderationSettings.require_approval_for_new_users);
    }
    
    if (notificationSettings) {
      setAdminEmail(notificationSettings.admin_email);
      setAlertOnReports(notificationSettings.alert_on_reports);
    }
  }, [siteSettings, moderationSettings, notificationSettings]);
  
  const handleUpdateSiteSettings = () => {
    updateSetting({
      key: "site_settings",
      value: {
        ...siteSettings,
        site_name: siteName,
        maintenance_mode: maintenanceMode
      }
    });
  };
  
  const handleUpdateModerationSettings = () => {
    updateSetting({
      key: "moderation_settings",
      value: {
        ...moderationSettings,
        require_approval_for_new_users: requireApproval
      }
    });
  };
  
  const handleUpdateNotificationSettings = () => {
    updateSetting({
      key: "notification_settings",
      value: {
        ...notificationSettings,
        admin_email: adminEmail,
        alert_on_reports: alertOnReports
      }
    });
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Admin Settings</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Settings</CardTitle>
                  <CardDescription>
                    Configure general site settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, the site will show a maintenance page
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                  
                  <Button
                    onClick={handleUpdateSiteSettings}
                    disabled={isUpdating}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
              
              {maintenanceMode && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-yellow-700">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Warning</p>
                      <p className="text-sm">
                        Maintenance mode is currently enabled. The site will not be accessible to regular users.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="moderation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Settings</CardTitle>
                  <CardDescription>
                    Configure content moderation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-approval">
                        Require Approval for New Users
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, new users must be approved before they can post content
                      </p>
                    </div>
                    <Switch
                      id="require-approval"
                      checked={requireApproval}
                      onCheckedChange={setRequireApproval}
                    />
                  </div>
                  
                  <Button
                    onClick={handleUpdateModerationSettings}
                    disabled={isUpdating}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure system notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-reports">
                        Alert on Reports
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, admins will receive notifications for new reports
                      </p>
                    </div>
                    <Switch
                      id="alert-reports"
                      checked={alertOnReports}
                      onCheckedChange={setAlertOnReports}
                    />
                  </div>
                  
                  <Button
                    onClick={handleUpdateNotificationSettings}
                    disabled={isUpdating}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
