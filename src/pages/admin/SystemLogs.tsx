
import React, { useState } from "react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/hooks/use-admin";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const SystemLogs = () => {
  const [logType, setLogType] = useState<string>("");
  const [component, setComponent] = useState<string>("");
  const [limit, setLimit] = useState<number>(100);
  
  const { useSystemLogs } = useAdmin();
  
  const { data: logs, isLoading } = useSystemLogs(
    logType || undefined,
    component || undefined,
    limit
  );

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case "info":
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
    }
  };

  return (
    <AdminLayout activeTab="logs">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">System Logs</h2>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={logType}
              onValueChange={setLogType}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Log Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Component Filter"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              className="w-[180px]"
            />
            
            <Select
              value={limit.toString()}
              onValueChange={(val) => setLimit(Number(val))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">Last 20</SelectItem>
                <SelectItem value="50">Last 50</SelectItem>
                <SelectItem value="100">Last 100</SelectItem>
                <SelectItem value="500">Last 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 animate-pulse h-24 rounded-lg"
              />
            ))}
          </div>
        ) : logs && logs.length > 0 ? (
          <div className="grid gap-4">
            {logs.map((log) => (
              <Card key={log.id} className={`border-l-4 ${
                log.log_type === 'error' 
                  ? 'border-l-red-500' 
                  : log.log_type === 'warning' 
                  ? 'border-l-yellow-500' 
                  : 'border-l-blue-500'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getLogIcon(log.log_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                          {getLogTypeBadge(log.log_type)}
                          <span className="font-medium text-sm">{log.component}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, yyyy - HH:mm:ss")}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{log.message}</p>
                      {log.metadata && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Info className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No logs found</h3>
            <p className="text-muted-foreground">
              {logType || component
                ? "Try changing your filters"
                : "There are no system logs to display"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SystemLogs;
