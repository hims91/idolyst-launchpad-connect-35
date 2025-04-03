
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Mentor, TimeSlot } from "@/types/mentor";
import { useAvailableTimeSlots, useBookSession } from "@/hooks/use-mentors";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface BookingFormProps {
  mentor: Mentor;
  onComplete: () => void;
}

const BookingForm = ({ mentor, onComplete }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: timeSlots, isLoading: loadingTimeSlots } = useAvailableTimeSlots(
    mentor.id,
    selectedDate || new Date()
  );
  
  const bookSession = useBookSession();
  
  useEffect(() => {
    // Reset selected time slot when date changes
    setSelectedTimeSlot(null);
  }, [selectedDate]);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your session.",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your session.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    bookSession.mutate({
      mentorId: mentor.id,
      title,
      description,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTimeSlot.start_time,
      endTime: selectedTimeSlot.end_time,
      price: mentor.hourly_rate
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        toast({
          title: "Session booked!",
          description: "Your mentorship session has been scheduled.",
        });
        onComplete();
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast({
          title: "Booking failed",
          description: error.message || "Failed to book the session. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || getDay(date) === 0 || getDay(date) === 6}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {selectedDate && (
          <div>
            <Label>Available Time Slots</Label>
            <div className="mt-1 space-y-2">
              {loadingTimeSlots ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : timeSlots && timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      className={cn(
                        "justify-center",
                        selectedTimeSlot === slot ? "bg-purple-600 hover:bg-purple-700" : ""
                      )}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {slot.start_time} - {slot.end_time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">
                    No available time slots for this date.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Career Strategy Discussion"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">
            Description <span className="text-gray-500 text-sm">(optional)</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what you'd like to discuss in this session..."
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-400">Session Fee:</span>
          <span className="text-lg font-medium text-purple-700 dark:text-purple-400">
            ${mentor.hourly_rate}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onComplete}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={!selectedDate || !selectedTimeSlot || !title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Booking...
              </>
            ) : "Book Session"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
