
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/hooks/use-admin";
import { ModerationItem } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ModerationQueue = () => {
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterType, setFilterType] = useState<string>("");
  const [moderatorNotes, setModeratorNotes] = useState<string>("");
  const navigate = useNavigate();
  
  const { useModerationQueue, useUpdateModerationStatus } = useAdmin();
  
  const {
    data: moderationItems,
    isLoading,
  } = useModerationQueue(filterStatus || undefined, filterType || undefined);
  
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateModerationStatus();

  const handleApproveReject = (status: "approved" | "rejected") => {
    if (!selectedItem) return;
    
    updateStatus({
      itemId: selectedItem.id,
      status,
      notes: moderatorNotes,
    }, {
      onSuccess: () => {
        setSelectedItem(null);
        setModeratorNotes("");
      }
    });
  };

  const viewRelatedContent = (item: ModerationItem) => {
    // Placeholder for navigating to the related content
    // This will be replaced with actual navigation based on content type
    console.log(`View content: ${item.content_type} - ${item.content_id}`);
    
    switch (item.content_type) {
      case "post":
        navigate(`/launchpad/post/${item.content_id}`);
        break;
      case "pitch":
        navigate(`/pitch-hub/${item.content_id}`);
        break;
      case "comment":
        // For comments we might need to navigate to the parent post/pitch
        // Would need additional data for this
        break;
      default:
        // Default fallback
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case "post":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Post</Badge>;
      case "pitch":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Pitch</Badge>;
      case "comment":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Comment</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <AdminLayout activeTab="moderation">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Moderation Queue</h2>
          
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="pitch">Pitches</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : moderationItems?.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
            <h3 className="text-lg font-medium">No reported content</h3>
            <p className="text-muted-foreground">
              {filterStatus || filterType
                ? "Try changing your filters"
                : "There are no reports in the moderation queue"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moderationItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getContentTypeBadge(item.content_type)}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.reason}</TableCell>
                  <TableCell>
                    {item.reported_by?.username || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewRelatedContent(item)}
                        title="View Content"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {item.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedItem(item)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Review"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Review Dialog */}
      <Dialog open={Boolean(selectedItem)} onOpenChange={() => selectedItem && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Reported Content</DialogTitle>
            <DialogDescription>
              Review this report and take appropriate action.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-1">Content Type</p>
              <p>{selectedItem?.content_type}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Report Reason</p>
              <p>{selectedItem?.reason}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Moderator Notes</p>
              <Textarea
                value={moderatorNotes}
                onChange={(e) => setModeratorNotes(e.target.value)}
                placeholder="Add notes about your decision (optional)"
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => viewRelatedContent(selectedItem as ModerationItem)}
            >
              View Content
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleApproveReject("rejected")}
                disabled={isUpdating}
                className="flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                type="button"
                onClick={() => handleApproveReject("approved")}
                disabled={isUpdating}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ModerationQueue;
