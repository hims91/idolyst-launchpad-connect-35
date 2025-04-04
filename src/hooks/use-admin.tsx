import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  checkAdminAccess,
  fetchAdminSettings,
  updateAdminSetting,
  fetchModerationQueue,
  updateModerationStatus,
  reportContent,
  fetchSystemLogs
} from "@/api/admin";
import { AdminSetting, ModerationItem, SystemLog, SiteSettings, ModerationSettings, NotificationSettings } from "@/types/admin";

export const useAdmin = () => {
  const { isAuthenticated, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        const hasAccess = await checkAdminAccess();
        setIsAdmin(hasAccess);
        setIsLoading(false);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    verifyAdminAccess();
  }, [isAuthenticated, profile]);

  // Fetch admin settings
  const useAdminSettings = (key?: string) => {
    return useQuery({
      queryKey: ["admin", "settings", key],
      queryFn: () => fetchAdminSettings(key),
      enabled: isAdmin && !isLoading,
    });
  };

  // Update admin settings
  const useUpdateAdminSetting = () => {
    return useMutation({
      mutationFn: ({ key, value }: { key: string; value: any }) => 
        updateAdminSetting(key, value),
      onSuccess: (_, variables) => {
        toast({
          title: "Settings updated",
          description: `${variables.key} settings have been updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      },
      onError: (error) => {
        toast({
          title: "Error updating settings",
          description: "There was an error updating the settings. Please try again.",
          variant: "destructive",
        });
        console.error("Error updating settings:", error);
      },
    });
  };

  // Fetch moderation queue
  const useModerationQueue = (status?: string, contentType?: string) => {
    return useQuery({
      queryKey: ["admin", "moderation", status, contentType],
      queryFn: () => fetchModerationQueue(status, contentType),
      enabled: isAdmin && !isLoading,
    });
  };

  // Update moderation status
  const useUpdateModerationStatus = () => {
    return useMutation({
      mutationFn: ({
        itemId,
        status,
        notes,
      }: {
        itemId: string;
        status: "pending" | "approved" | "rejected";
        notes?: string;
      }) => updateModerationStatus(itemId, status, notes),
      onSuccess: (_, variables) => {
        toast({
          title: "Moderation status updated",
          description: `Item has been ${variables.status}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["admin", "moderation"] });
      },
      onError: (error) => {
        toast({
          title: "Error updating status",
          description: "There was an error updating the moderation status.",
          variant: "destructive",
        });
        console.error("Error updating moderation status:", error);
      },
    });
  };

  // Report content
  const useReportContent = () => {
    return useMutation({
      mutationFn: ({
        contentType,
        contentId,
        reason,
      }: {
        contentType: string;
        contentId: string;
        reason: string;
      }) => reportContent(contentType, contentId, reason),
      onSuccess: () => {
        toast({
          title: "Content reported",
          description: "Your report has been submitted for review.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error reporting content",
          description: "There was an error reporting the content.",
          variant: "destructive",
        });
        console.error("Error reporting content:", error);
      },
    });
  };

  // Fetch system logs
  const useSystemLogs = (logType?: string, component?: string, limit?: number) => {
    return useQuery({
      queryKey: ["admin", "logs", logType, component, limit],
      queryFn: () => fetchSystemLogs(logType, component, limit),
      enabled: isAdmin && !isLoading,
    });
  };

  // Get specific setting types with proper typing
  const getSiteSettings = (settings: AdminSetting[]): SiteSettings | null => {
    const siteSettings = settings.find(
      (setting) => setting.setting_key === "site_settings"
    );
    return siteSettings ? (siteSettings.setting_value as SiteSettings) : null;
  };

  const getModerationSettings = (settings: AdminSetting[]): ModerationSettings | null => {
    const moderationSettings = settings.find(
      (setting) => setting.setting_key === "moderation_settings"
    );
    return moderationSettings ? (moderationSettings.setting_value as ModerationSettings) : null;
  };

  const getNotificationSettings = (settings: AdminSetting[]): NotificationSettings | null => {
    const notificationSettings = settings.find(
      (setting) => setting.setting_key === "notification_settings"
    );
    return notificationSettings ? (notificationSettings.setting_value as NotificationSettings) : null;
  };

  return {
    isAdmin,
    isLoading,
    useAdminSettings,
    useUpdateAdminSetting,
    useModerationQueue,
    useUpdateModerationStatus,
    useReportContent,
    useSystemLogs,
    getSiteSettings,
    getModerationSettings,
    getNotificationSettings,
  };
};
