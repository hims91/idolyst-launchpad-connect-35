
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlot } from "@/types/mentor";
import { format, addDays, parseISO, isSameDay } from "date-fns";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInUp } from "@/lib/animations";

interface AvailabilityPickerProps {
  mentorId: string;
  timeSlots: TimeSlot[];
  isLoading: boolean;
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  onDateChange: (date: Date) => void;
  onTimeSlotSelect: (slot: TimeSlot) => void;
}

const AvailabilityPicker = ({
  mentorId,
  timeSlots,
  isLoading,
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotSelect,
}: AvailabilityPickerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formatTime = (timeString: string) => {
    // Parse the time string (assuming format like "14:30:00")
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return format(date, 'h:mm a');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Book a Session
      </h3>

      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Date
          </label>
          <Button
            variant="outline"
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="w-full justify-between"
          >
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Choose date'}
            <Calendar className="h-4 w-4 opacity-50" />
          </Button>

          <AnimatePresence>
            {calendarOpen && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-2"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => {
                    if (date) {
                      onDateChange(date);
                      setCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="border rounded-md"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available Time Slots
          </label>

          {selectedDate ? (
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={`${slot.date}-${slot.start_time}`}
                      variant={
                        selectedTimeSlot &&
                        selectedTimeSlot.date === slot.date &&
                        selectedTimeSlot.start_time === slot.start_time
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedTimeSlot &&
                        selectedTimeSlot.date === slot.date &&
                        selectedTimeSlot.start_time === slot.start_time
                          ? "bg-purple-600 hover:bg-purple-700"
                          : ""
                      }
                      onClick={() => onTimeSlotSelect(slot)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(slot.start_time)}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No available slots for this date
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Select a date to see available slots
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPicker;
