
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MentorAvailability, DateException } from "@/types/mentor";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, X, Plus, AlertTriangle } from "lucide-react";
import { useUpdateMentorAvailability, useAddDateException } from "@/hooks/use-mentors";
import { toast } from "@/hooks/use-toast";

interface AvailabilitySettingsProps {
  availability: MentorAvailability[];
  dateExceptions: DateException[];
}

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilitySettings = ({ availability, dateExceptions }: AvailabilitySettingsProps) => {
  const [scheduleItems, setScheduleItems] = useState<MentorAvailability[]>(
    availability.length > 0
      ? availability
      : dayNames.slice(1, 6).map((_, index) => ({
          id: `temp-${index}`,
          mentor_id: "",
          day_of_week: index + 1,
          start_time: "09:00",
          end_time: "17:00",
          is_recurring: true,
          created_at: "",
          updated_at: ""
        }))
  );
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDayOfWeek, setNewDayOfWeek] = useState(1);
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("17:00");
  
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);
  const [exceptionDate, setExceptionDate] = useState<Date | undefined>(undefined);
  const [exceptionIsAvailable, setExceptionIsAvailable] = useState(false);
  
  const updateAvailability = useUpdateMentorAvailability();
  const addException = useAddDateException();
  
  const handleSaveAvailability = () => {
    // Validate end times are after start times
    const isValid = scheduleItems.every(item => item.start_time < item.end_time);
    
    if (!isValid) {
      toast({
        title: "Validation error",
        description: "End time must be after start time for all slots",
        variant: "destructive"
      });
      return;
    }
    
    updateAvailability.mutate(scheduleItems, {
      onSuccess: () => {
        toast({
          title: "Availability saved",
          description: "Your availability settings have been updated",
        });
      }
    });
  };
  
  const handleStartTimeChange = (index: number, value: string) => {
    const updated = [...scheduleItems];
    updated[index].start_time = value;
    setScheduleItems(updated);
  };
  
  const handleEndTimeChange = (index: number, value: string) => {
    const updated = [...scheduleItems];
    updated[index].end_time = value;
    setScheduleItems(updated);
  };
  
  const handleRemoveTimeSlot = (index: number) => {
    const updated = [...scheduleItems];
    updated.splice(index, 1);
    setScheduleItems(updated);
  };
  
  const handleAddTimeSlot = () => {
    // Check that end time is after start time
    if (newStartTime >= newEndTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }
    
    // Check for overlapping time slots
    const overlapping = scheduleItems.some(item => 
      item.day_of_week === newDayOfWeek && 
      ((newStartTime >= item.start_time && newStartTime < item.end_time) ||
       (newEndTime > item.start_time && newEndTime <= item.end_time) ||
       (newStartTime <= item.start_time && newEndTime >= item.end_time))
    );
    
    if (overlapping) {
      toast({
        title: "Overlapping time slot",
        description: "This time slot overlaps with an existing one",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: MentorAvailability = {
      id: `temp-${Date.now()}`,
      mentor_id: "",
      day_of_week: newDayOfWeek,
      start_time: newStartTime,
      end_time: newEndTime,
      is_recurring: true,
      created_at: "",
      updated_at: ""
    };
    
    setScheduleItems([...scheduleItems, newItem]);
    setShowAddDialog(false);
  };
  
  const handleAddException = () => {
    if (!exceptionDate) return;
    
    const formattedDate = format(exceptionDate, "yyyy-MM-dd");
    
    addException.mutate({
      exceptionDate: formattedDate,
      isAvailable: exceptionIsAvailable
    }, {
      onSuccess: () => {
        toast({
          title: "Date exception added",
          description: `${format(exceptionDate, "MMMM d, yyyy")} marked as ${exceptionIsAvailable ? "available" : "unavailable"}`,
        });
        setShowExceptionDialog(false);
      }
    });
  };
  
  const isDateException = (date: Date): boolean => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return dateExceptions.some(ex => ex.exception_date === formattedDate);
  };
  
  const getExceptionBadgeText = (date: Date): string => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const exception = dateExceptions.find(ex => ex.exception_date === formattedDate);
    return exception?.is_available ? "Available" : "Unavailable";
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Weekly Availability</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Time Slot
          </Button>
        </div>
        
        {scheduleItems.length === 0 ? (
          <div className="py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
            <h4 className="text-base font-medium mb-1">No Availability Set</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You haven't set any regular availability times yet.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              Add Your First Time Slot
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduleItems
              .sort((a, b) => a.day_of_week - b.day_of_week)
              .map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-24 font-medium">
                    {dayNames[item.day_of_week]}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Select
                      value={item.start_time}
                      onValueChange={(value) => handleStartTimeChange(index, value)}
                    >
                      <SelectTrigger className="w-full sm:w-28">
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="mx-1 hidden sm:block">to</span>
                    
                    <Select
                      value={item.end_time}
                      onValueChange={(value) => handleEndTimeChange(index, value)}
                    >
                      <SelectTrigger className="w-full sm:w-28">
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time} disabled={time <= item.start_time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveTimeSlot(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
            ))}
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSaveAvailability}>
                Save Availability
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Date Exceptions</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExceptionDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exception
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mark specific dates as available or unavailable, overriding your regular weekly schedule.
          </p>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <Calendar
            mode="single"
            disabled={(date) => date < new Date()}
            modifiers={{
              exception: (date) => isDateException(date)
            }}
            modifiersClassNames={{
              exception: "border-2 border-purple-500"
            }}
            components={{
              DayContent: (props) => (
                <div className="relative">
                  <div>{props.day}</div>
                  {isDateException(props.date) && (
                    <Badge 
                      variant={getExceptionBadgeText(props.date) === "Available" ? "default" : "destructive"}
                      className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-[10px] p-0 h-5 whitespace-nowrap"
                    >
                      {getExceptionBadgeText(props.date)}
                    </Badge>
                  )}
                </div>
              )
            }}
            className="mx-auto"
          />
        </div>
      </div>
      
      {/* Add Time Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Availability Time Slot</DialogTitle>
            <DialogDescription>
              Add a recurring weekly time slot when you're available for mentorship sessions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="day">Day of Week</Label>
              <Select value={String(newDayOfWeek)} onValueChange={(value) => setNewDayOfWeek(Number(value))}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={day} value={String(index)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={newStartTime} onValueChange={setNewStartTime}>
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`dialog-start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select value={newEndTime} onValueChange={setNewEndTime}>
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`dialog-end-${time}`} value={time} disabled={time <= newStartTime}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot}>
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Exception Dialog */}
      <Dialog open={showExceptionDialog} onOpenChange={setShowExceptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Date Exception</DialogTitle>
            <DialogDescription>
              Mark a specific date as available or unavailable, overriding your regular schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Date</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={exceptionDate}
                  onSelect={setExceptionDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="exception-type"
                checked={exceptionIsAvailable}
                onCheckedChange={setExceptionIsAvailable}
              />
              <Label htmlFor="exception-type">
                Mark as {exceptionIsAvailable ? "available" : "unavailable"}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExceptionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddException}
              disabled={!exceptionDate}
            >
              Add Exception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilitySettings;
