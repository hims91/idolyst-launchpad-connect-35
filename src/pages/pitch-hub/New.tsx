
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Rocket,
  Save,
  ArrowRight,
  Award,
  Check,
  Info
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MediaUploader from '@/components/pitch-hub/MediaUploader';
import StageSelector from '@/components/pitch-hub/StageSelector';
import TagSelector from '@/components/pitch-hub/TagSelector';
import PaymentModal from '@/components/pitch-hub/PaymentModal';
import { usePitchTags } from '@/hooks/usePitchHub';
import { IdeaStage, createPitchIdea, savePitchDraft } from '@/api/pitch';
import { useAuth } from '@/providers/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface PitchFormData {
  title: string;
  problem_statement: string;
  target_group: string;
  solution: string;
  stage: IdeaStage;
  tags: string[];
  media_urls: string[];
  is_premium: boolean;
}

const PitchHubNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { popularTags } = usePitchTags();
  
  const [currentStep, setCurrentStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Form
  const form = useForm<PitchFormData>({
    defaultValues: {
      title: '',
      problem_statement: '',
      target_group: '',
      solution: '',
      stage: 'ideation',
      tags: [],
      media_urls: [],
      is_premium: false,
    }
  });
  
  const isPremium = form.watch('is_premium');
  
  // Steps configuration
  const steps = [
    {
      id: 'problem',
      title: 'Define the Problem',
      description: 'What problem are you solving?',
      fields: ['title', 'problem_statement']
    },
    {
      id: 'solution',
      title: 'Your Solution',
      description: 'How does your idea solve the problem?',
      fields: ['target_group', 'solution', 'stage']
    },
    {
      id: 'details',
      title: 'Add Details',
      description: 'Enhance your pitch with additional information',
      fields: ['tags', 'media_urls']
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your pitch before submitting',
    }
  ];
  
  // Navigation
  const goToNext = async () => {
    // Validate current step fields
    const currentStepFields = steps[currentStep].fields || [];
    
    const isValid = await form.trigger(currentStepFields as any);
    if (!isValid) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of the steps section
      if (stepsRef.current) {
        stepsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Form submission
  const onSubmit = async (data: PitchFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your idea",
        variant: "destructive",
      });
      return;
    }
    
    // If premium option selected, open payment modal
    if (data.is_premium) {
      setIsPaymentModalOpen(true);
      return;
    }
    
    await submitPitch(data);
  };
  
  const submitPitch = async (data: PitchFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await createPitchIdea(data);
      
      if (result) {
        toast({
          title: "Pitch submitted successfully!",
          description: "Your idea is now live on PitchHub",
        });
        navigate(`/pitch-hub/${result.id}`);
      }
    } catch (error) {
      console.error("Error submitting pitch:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const saveDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save a draft",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingDraft(true);
    
    try {
      const formData = form.getValues();
      const result = await savePitchDraft(formData);
      
      if (result) {
        toast({
          title: "Draft saved",
          description: "Your pitch idea draft has been saved",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Failed to save draft",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  const handlePaymentSuccess = async () => {
    // Submit the pitch with premium flag
    await submitPitch(form.getValues());
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Submit Your Pitch | PitchHub | Idolyst</title>
        <meta name="description" content="Submit your startup or business idea to get feedback and validation from the community and mentors." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto pb-20 md:pb-0">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/pitch-hub')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">Submit Your Pitch</h1>
              <p className="text-idolyst-gray-dark">Share your startup idea with the community</p>
            </div>
          </div>
          
          <Separator />
        </div>
        
        {/* Stepper */}
        <div className="mb-8" ref={stepsRef}>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center space-y-2 ${
                  index <= currentStep 
                    ? 'text-idolyst-purple' 
                    : 'text-idolyst-gray'
                }`}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
                    index < currentStep 
                      ? 'bg-idolyst-purple text-white' 
                      : index === currentStep 
                        ? 'bg-idolyst-purple/20 text-idolyst-purple border-2 border-idolyst-purple' 
                        : 'bg-gray-100 text-idolyst-gray'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden md:block text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-idolyst-gray">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress connector */}
          <div className="relative w-full mt-6 mb-8">
            <div className="absolute top-0 h-1 w-full bg-gray-200 rounded-full"></div>
            <div 
              className="absolute top-0 h-1 bg-idolyst-purple rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6 animate-fade-in">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ 
                    required: "Title is required",
                    maxLength: {
                      value: 50,
                      message: "Title must be less than 50 characters"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Pitch Title</FormLabel>
                      <FormDescription>
                        A clear, concise title for your startup idea (50 chars max)
                      </FormDescription>
                      <FormControl>
                        <Input 
                          placeholder="e.g., AI-Powered Personal Shopping Assistant" 
                          {...field} 
                          maxLength={50}
                        />
                      </FormControl>
                      <div className="flex justify-end text-xs text-idolyst-gray">
                        {field.value.length}/50
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="problem_statement"
                  rules={{ 
                    required: "Problem statement is required",
                    maxLength: {
                      value: 200,
                      message: "Problem statement must be less than 200 characters"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Problem Statement</FormLabel>
                      <FormDescription>
                        What problem are you trying to solve? (200 chars max)
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Online shopping is time-consuming and overwhelms users with too many options, leading to decision fatigue and abandoned carts." 
                          {...field} 
                          maxLength={200}
                          rows={4}
                        />
                      </FormControl>
                      <div className="flex justify-end text-xs text-idolyst-gray">
                        {field.value.length}/200
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <FormField
                  control={form.control}
                  name="target_group"
                  rules={{ 
                    required: "Target audience is required",
                    maxLength: {
                      value: 100,
                      message: "Target audience must be less than 100 characters"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Target Audience</FormLabel>
                      <FormDescription>
                        Who will benefit from your solution? (100 chars max)
                      </FormDescription>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Busy professionals aged 25-45 who shop online regularly" 
                          {...field} 
                          maxLength={100}
                        />
                      </FormControl>
                      <div className="flex justify-end text-xs text-idolyst-gray">
                        {field.value.length}/100
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solution"
                  rules={{ 
                    required: "Solution is required",
                    maxLength: {
                      value: 300,
                      message: "Solution must be less than 300 characters"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Solution</FormLabel>
                      <FormDescription>
                        How does your idea solve the problem? (300 chars max)
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Our AI shopping assistant analyzes user preferences and shopping history to provide personalized product recommendations, reducing decision fatigue and saving time." 
                          {...field} 
                          maxLength={300}
                          rows={5}
                        />
                      </FormControl>
                      <div className="flex justify-end text-xs text-idolyst-gray">
                        {field.value.length}/300
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stage"
                  rules={{ required: "Development stage is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StageSelector
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <FormField
                  control={form.control}
                  name="tags"
                  rules={{ 
                    required: "At least one tag is required",
                    validate: {
                      minTags: (value) => value.length > 0 || "Add at least one tag",
                      maxTags: (value) => value.length <= 5 || "Maximum 5 tags allowed"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagSelector 
                          value={field.value}
                          onChange={field.onChange}
                          availableTags={popularTags}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="media_urls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Media (Optional)</FormLabel>
                      <FormDescription>
                        Add images to help illustrate your idea (max 5 images, 5MB each)
                      </FormDescription>
                      <FormControl>
                        <MediaUploader 
                          value={field.value}
                          onChange={field.onChange}
                          userId={user?.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Review Your Pitch</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-idolyst-gray">Title</div>
                      <div className="p-3 bg-gray-50 rounded-md">{form.getValues('title')}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-idolyst-gray">Problem Statement</div>
                      <div className="p-3 bg-gray-50 rounded-md">{form.getValues('problem_statement')}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-idolyst-gray">Target Audience</div>
                        <div className="p-3 bg-gray-50 rounded-md">{form.getValues('target_group')}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-idolyst-gray">Development Stage</div>
                        <div className="p-3 bg-gray-50 rounded-md capitalize">
                          {form.getValues('stage').replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-idolyst-gray">Solution</div>
                      <div className="p-3 bg-gray-50 rounded-md">{form.getValues('solution')}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-idolyst-gray">Tags</div>
                      <div className="p-3 bg-gray-50 rounded-md flex flex-wrap gap-2">
                        {form.getValues('tags').map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 text-xs bg-white border rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {form.getValues('media_urls').length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-idolyst-gray">Media</div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {form.getValues('media_urls').map((url, i) => (
                              <div key={i} className="aspect-square rounded-md overflow-hidden">
                                <img 
                                  src={url} 
                                  alt={`Pitch media ${i+1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="is_premium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FormLabel className="text-base mr-2">Boost Visibility</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-idolyst-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60">
                                  Premium pitches get featured placement on the PitchHub and increased visibility across the platform for 30 days.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <p className="text-sm text-idolyst-gray">
                            $5 for 30 days premium visibility 
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto">
                {currentStep === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/pitch-hub')}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={goToPrevious}
                  >
                    Previous Step
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-4 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={saveDraft}
                  disabled={isSavingDraft}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    className="w-full gradient-bg"
                    onClick={goToNext}
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full gradient-bg"
                    disabled={isSubmitting}
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Pitch'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
        
        {/* Payment Modal */}
        <PaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          pitchId={'pending'}
          onSuccess={handlePaymentSuccess}
          amount={5}
        />
      </div>
    </Layout>
  );
};

export default PitchHubNew;
