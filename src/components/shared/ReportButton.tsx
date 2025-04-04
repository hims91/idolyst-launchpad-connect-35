
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";

interface ReportButtonProps {
  contentType: string; // 'post', 'pitch', 'comment', etc.
  contentId: string;
  variant?: 'default' | 'subtle' | 'icon';
  className?: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  contentType,
  contentId,
  variant = 'default',
  className,
}) => {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { useReportContent } = useAdmin();
  const { mutate: reportContent, isPending } = useReportContent();

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Report reason required",
        description: "Please provide a reason for your report.",
        variant: "destructive",
      });
      return;
    }

    reportContent({
      contentType,
      contentId,
      reason,
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setReason("");
      }
    });
  };

  if (variant === 'icon') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={className}
            title="Report"
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <ReportDialogContent
          reason={reason}
          setReason={setReason}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Dialog>
    );
  }

  if (variant === 'subtle') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-foreground ${className || ''}`}
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Report
          </Button>
        </DialogTrigger>
        <ReportDialogContent
          reason={reason}
          setReason={setReason}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 ${className || ''}`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <ReportDialogContent
        reason={reason}
        setReason={setReason}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
    </Dialog>
  );
};

interface ReportDialogContentProps {
  reason: string;
  setReason: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  isPending: boolean;
}

const ReportDialogContent: React.FC<ReportDialogContentProps> = ({
  reason,
  setReason,
  handleSubmit,
  isPending,
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Report Content</DialogTitle>
        <DialogDescription>
          Please provide a reason for reporting this content.
          Our moderators will review your report promptly.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for reporting</Label>
          <Textarea
            id="reason"
            placeholder="Please explain why you're reporting this content..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none"
            rows={4}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setReason("")}
        >
          Cancel
        </Button>
        <Button 
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !reason.trim()}
          className="bg-red-600 hover:bg-red-700"
        >
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ReportButton;
