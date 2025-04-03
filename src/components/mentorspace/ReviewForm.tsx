
import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useSubmitReview } from "@/hooks/use-mentors";
import { Star } from "lucide-react";

interface ReviewFormProps {
  sessionId: string;
  onComplete: () => void;
}

const ReviewForm = ({ sessionId, onComplete }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitReview = useSubmitReview();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    submitReview.mutate({
      sessionId,
      rating,
      comment,
      isPublic
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        onComplete();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4 space-y-6">
        <div className="flex flex-col items-center">
          <p className="text-center mb-3 text-sm text-gray-600 dark:text-gray-400">
            How would you rate this mentorship session?
          </p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={`
                    ${(hoveredRating >= star || rating >= star)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                    } 
                    transition-colors
                  `}
                />
              </motion.button>
            ))}
          </div>
          <p className="mt-2 text-sm font-medium">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>
        
        <div>
          <Label htmlFor="comment" className="mb-2 block">Your feedback (optional)</Label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this mentorship session..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="isPublic">
            Make this review public
          </Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : "Submit Review"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ReviewForm;
