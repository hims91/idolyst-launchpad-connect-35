
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MentorshipSession } from "@/types/mentor";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useSubmitReview } from "@/hooks/use-mentors";
import { format } from "date-fns";
import { Star, StarHalf } from "lucide-react";

interface ReviewFormProps {
  session: MentorshipSession;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ReviewForm = ({ session, onCancel, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
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
  
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div 
        variants={fadeInUp} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6"
        onClick={e => e.stopPropagation()}
      >
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating" className="mb-2 block">Rating</Label>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(value)}
                  >
                    {value <= rating ? (
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="comment">Feedback</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience and feedback..."
                rows={5}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is-public"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
              />
              <Label htmlFor="is-public" className="ml-1">Make this review public</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
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
                className="gradient-bg"
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
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
