
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExpertiseCategory } from "@/types/mentor";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useApplyAsMentor } from "@/hooks/use-mentors";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MentorApplicationFormProps {
  expertiseCategories: ExpertiseCategory[];
}

const MentorApplicationForm = ({
  expertiseCategories,
}: MentorApplicationFormProps) => {
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const applyAsMentor = useApplyAsMentor();
  const { toast } = useToast();

  const toggleExpertise = (expertise: ExpertiseCategory) => {
    if (selectedExpertise.includes(expertise)) {
      setSelectedExpertise(selectedExpertise.filter((e) => e !== expertise));
    } else {
      setSelectedExpertise([...selectedExpertise, expertise]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedExpertise.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one expertise area",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    applyAsMentor.mutate({
      bio,
      expertise: selectedExpertise,
      hourlyRate: parseFloat(hourlyRate),
      yearsExperience: parseInt(yearsExperience, 10)
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        toast({
          title: "Application Submitted",
          description: "Your mentor application has been submitted for review.",
          variant: "default"
        });
        navigate('/mentor-space/profile');
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast({
          title: "Application Failed",
          description: error.message || "There was an error submitting your application. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Apply to Become a Mentor
      </h2>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-800 dark:text-blue-200">
        <h3 className="font-medium mb-1">Why Become a Mentor?</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Share your expertise and help others grow professionally</li>
          <li>Earn money by providing valuable mentorship sessions</li>
          <li>Build your personal brand and expand your network</li>
          <li>Gain XP and unlock exclusive badges in the platform</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="bio">
              Professional Bio <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your professional background, expertise, and what mentees can expect from your sessions..."
              rows={6}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="expertise">
              Areas of Expertise <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {expertiseCategories.map((expertise) => (
                <Badge
                  key={expertise}
                  variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedExpertise.includes(expertise)
                      ? "bg-purple-600"
                      : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => toggleExpertise(expertise)}
                >
                  {expertise}
                </Badge>
              ))}
            </div>
            {selectedExpertise.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one expertise
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hourlyRate">
                Hourly Rate (USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="pl-7"
                  placeholder="50.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="yearsExperience">
                Years of Experience <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="5"
                required
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              type="submit"
              disabled={isSubmitting || selectedExpertise.length === 0}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default MentorApplicationForm;
