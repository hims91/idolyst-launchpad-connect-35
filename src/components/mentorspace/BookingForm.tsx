import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TimeSlot, MentorWithProfile } from "@/types/mentor";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useBookSession } from "@/hooks/use-mentors";
import { useNavigate } from "react-router-dom";

interface BookingFormProps {
  mentor: MentorWithProfile;
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  onCancel: () => void;
}

const BookingForm = ({
  mentor,
  selectedDate,
  selectedTimeSlot,
  onCancel,
}: BookingFormProps) => {
  const [title, setTitle] = useState(`Session with ${mentor.profile.full_name || mentor.profile.username}`);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const bookSession = useBookSession();

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return format(date, 'h:mm a');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    bookSession.mutate({
      mentorId: mentor.id,
      title,
      description,
      date: formatDate(selectedDate),
      startTime: selectedTimeSlot.start_time,
      endTime: selectedTimeSlot.end_time,
      price: mentor.hourly_rate
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        navigate('/mentor-space/sessions');
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
        Complete Your Booking
      </h3>

      <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
        <div className="text-sm">
          <div className="mb-1">
            <span className="font-medium">Mentor:</span>{" "}
            {mentor.profile.full_name || mentor.profile.username}
          </div>
          <div className="mb-1">
            <span className="font-medium">Date:</span>{" "}
            {format(selectedDate, 'MMMM d, yyyy')}
          </div>
          <div className="mb-1">
            <span className="font-medium">Time:</span>{" "}
            {formatTime(selectedTimeSlot.start_time)} - {formatTime(selectedTimeSlot.end_time)}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${mentor.hourly_rate}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">
              Session Description <span className="text-gray-500">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'd like to discuss in this session..."
              rows={4}
            />
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
                  Processing...
                </>
              ) : (
                'Complete Booking'
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;
