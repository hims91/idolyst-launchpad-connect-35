
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Users, Lightbulb, UserCheck, AlertTriangle } from "lucide-react";

const AdminDashboard = () => {
  const { data: userCount, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "stats", "users"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
        
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: pitchCount, isLoading: loadingPitches } = useQuery({
    queryKey: ["admin", "stats", "pitches"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("pitch_ideas")
        .select("*", { count: "exact", head: true });
        
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: mentorCount, isLoading: loadingMentors } = useQuery({
    queryKey: ["admin", "stats", "mentors"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("mentors")
        .select("*", { count: "exact", head: true });
        
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: reportCount, isLoading: loadingReports } = useQuery({
    queryKey: ["admin", "stats", "reports"],
    queryFn: async () => {
      try {
        // Use a direct query to count the pending reports
        const { count, error } = await supabase
          .from("moderation_queue")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching report count:", error);
        return 0;
      }
    },
  });

  const isLoading = loadingUsers || loadingPitches || loadingMentors || loadingReports;

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Platform Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={isLoading ? undefined : userCount || 0}
            icon={<Users className="h-5 w-5" />}
            trend={{
              value: 5.2,
              isPositive: true,
              label: "from last month"
            }}
          />
          
          <StatCard
            title="Pitch Ideas"
            value={isLoading ? undefined : pitchCount || 0}
            icon={<Lightbulb className="h-5 w-5" />}
            trend={{
              value: 12.5,
              isPositive: true,
              label: "from last month"
            }}
          />
          
          <StatCard
            title="Active Mentors"
            value={isLoading ? undefined : mentorCount || 0}
            icon={<UserCheck className="h-5 w-5" />}
            trend={{
              value: 3.1,
              isPositive: true,
              label: "from last month"
            }}
          />
          
          <StatCard
            title="Pending Reports"
            value={isLoading ? undefined : reportCount || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
            highlight={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Placeholder for user registration chart
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Placeholder for activity chart
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value?: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, highlight }) => {
  return (
    <Card className={highlight ? "border-yellow-400 dark:border-yellow-600" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            {value === undefined ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <h4 className="text-2xl font-bold">{value.toLocaleString()}</h4>
            )}
          </div>
          <div className={`p-2 rounded-lg ${
            highlight 
              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}>
            {icon}
          </div>
        </div>

        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={`flex items-center gap-0.5 ${
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
