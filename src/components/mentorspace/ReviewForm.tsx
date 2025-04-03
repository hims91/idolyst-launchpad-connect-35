
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MentorshipSession } from "@/types/mentor";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useSubmitReview } from "@/hooks/use-mentors";
import { format } from "date-fns";
import { Star, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewFormProps {
  session: MentorshipSession;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ReviewForm = ({ session, onCancel, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const submitReview = useSubmitReview();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitReview.mutate({
      sessionId: session.id,
      rating,
      comment: comment.trim() ? comment : undefined,
      isPublic
    }, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      }
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  // Star rating labels to provide context
  const ratingLabels = [
    "Poor",
    "Below Average",
    "Average",
    "Good",
    "Excellent"
  ];
  
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div 
        variants={fadeInUp} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-bold mb-4 gradient-text">
          Review Your Session
        </h2>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Session:</span> {session.title}</p>
            <p><span className="font-medium">Mentor:</span> {session.mentor?.profile.full_name || 'Unknown'}</p>
            <p><span className="font-medium">Date:</span> {formatDate(session.session_date)}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <Label htmlFor="rating" className="mb-2 block">How would you rate this session?</Label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      <Star 
                        className={`w-9 h-9 ${
                          value <= (hoverRating || rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300 dark:text-gray-700"
                        } transition-colors duration-150`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {hoverRating || rating ? ratingLabels[(hoverRating || rating) - 1] : "Select a rating"}
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <Label htmlFor="comment">Share your feedback (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What went well? What could be improved? Would you recommend this mentor?"
                rows={5}
                className="mt-1 resize-none"
              />
            </motion.div>
            
            <motion.div variants={staggerItem} className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label htmlFor="is-public" className="text-sm font-normal cursor-pointer">
                Make this review public to help other users find great mentors
              </Label>
            </motion.div>
            
            <motion.div variants={staggerItem} className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitReview.isPending}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                className="gradient-bg hover-scale"
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
