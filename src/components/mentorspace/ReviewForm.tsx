
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MentorshipSession } from "@/types/mentor";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useSubmitReview } from "@/hooks/use-mentors";

interface ReviewFormProps {
  session: MentorshipSession;
  onCancel: () => void;
  onSuccess: () => void;
}

const ReviewForm = ({
  session,
  onCancel,
  onSuccess,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitReview = useSubmitReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    submitReview.mutate({
      sessionId: session.id,
      rating,
      comment,
      isPublic
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        onSuccess();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mt-4"
    >
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Rate Your Session with {session.mentor?.profile.full_name || session.mentor?.profile.username}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 self-end">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">
              Your Review <span className="text-gray-500">(optional)</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this mentor..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="public-review"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public-review" className="cursor-pointer">
              Make review public
            </Label>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
  );
};

export default ReviewForm;
