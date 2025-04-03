import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from "@/components/layout/Layout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { IdeaStage, createPitchIdea, savePitchDraft } from '@/api/pitch';
import { useAuth } from '@/hooks/useAuth';
import MediaUploader from '@/components/pitch-hub/MediaUploader';
import TagSelector from '@/components/pitch-hub/TagSelector';
import StageSelector from '@/components/pitch-hub/StageSelector';
import PaymentModal from '@/components/pitch-hub/PaymentModal';

// Define schema for pitch form
const pitchFormSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must not exceed 50 characters"),
  problem_statement: z.string()
    .min(20, "Problem statement must be at least 20 characters")
    .max(200, "Problem statement must not exceed 200 characters"),
  target_group: z.string()
    .min(5, "Target group must be at least 5 characters"),
  solution: z.string()
    .min(20, "Solution must be at least 20 characters")
    .max(300, "Solution must not exceed 300 characters"),
  stage: z.enum([
    'ideation', 'mvp', 'investment', 'pmf', 'go_to_market', 'growth', 'maturity'
  ], {
    required_error: "Please select a stage for your idea",
  }),
  tags: z.array(z.string())
    .min(1, "Please add at least one tag")
    .max(5, "You can add up to 5 tags"),
  media_urls: z.array(z.string()).optional(),
  is_premium: z.boolean().default(false),
});

type PitchFormValues = z.infer<typeof pitchFormSchema>;

const NewPitchIdea = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [pitchId, setPitchId] = useState<string | null>(null);
  
  // Define form with zod resolver
  const form = useForm<PitchFormValues>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      title: "",
      problem_statement: "",
      target_group: "",
      solution: "",
      tags: [],
      media_urls: [],
      is_premium: false,
    },
  });
  
  const steps = [
    { id: 'basics', title: 'Basic Information' },
    { id: 'details', title: 'Detailed Description' },
    { id: 'media', title: 'Media & Tags' },
    { id: 'review', title: 'Review & Submit' }
  ];
  
  const currentProgress = ((currentStep + 1) / steps.length) * 100;
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a pitch idea",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { returnUrl: "/pitch-hub/new" } });
    }
  }, [isAuthenticated, navigate]);

  const goToNextStep = () => {
    const currentFields = getFieldsForStep(currentStep);
    
    // Validate current step fields
    form.trigger(currentFields as any).then((isValid) => {
      if (isValid) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          window.scrollTo(0, 0);
        }
      } else {
        // Form has errors, they will be displayed by the form components
        toast({
          title: "Validation error",
          description: "Please fix the errors before proceeding",
          variant: "destructive",
        });
      }
    });
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get fields for the current step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: // Basic Information
        return ['title', 'target_group'];
      case 1: // Detailed Description
        return ['problem_statement', 'solution', 'stage'];
      case 2: // Media & Tags
        return ['tags', 'media_urls'];
      case 3: // Review & Submit
        return ['is_premium'];
      default:
        return [];
    }
  };

  // Handle form submission - FIXED VERSION
  const onSubmit = async (values: PitchFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a pitch idea",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we have all required fields for the pitch idea
      const pitchData = {
        title: values.title,
        problem_statement: values.problem_statement,
        target_group: values.target_group,
        solution: values.solution,
        stage: values.stage,
        tags: values.tags,
        media_urls: mediaUrls
      };
      
      const result = await createPitchIdea(pitchData);
      
      if (result) {
        setPitchId(result.id);
        
        if (values.is_premium) {
          // Show payment modal
          setShowPaymentModal(true);
        } else {
          // Navigate to the newly created pitch
          toast({
            title: "Idea submitted successfully",
            description: "Your pitch idea has been submitted successfully!",
          });
          navigate(`/pitch-hub/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your pitch idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle saving draft
  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save a draft",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get current form values, even if incomplete
      const currentValues = form.getValues();
      
      const draftData = {
        ...currentValues,
        media_urls: mediaUrls
      };
      
      const result = await savePitchDraft(draftData);
      
      if (result) {
        toast({
          title: "Draft saved",
          description: "Your pitch idea has been saved as a draft.",
        });
        // Navigate to drafts or stay on page
        navigate('/pitch-hub');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Failed to save draft",
        description: "Failed to save your draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful",
      description: "Your pitch has been boosted for premium visibility!",
    });
    
    // Navigate to the newly created pitch
    if (pitchId) {
      navigate(`/pitch-hub/${pitchId}`);
    } else {
      navigate('/pitch-hub');
    }
  };
  
  // Handle media URLs update
  const handleMediaUpdate = (urls: string[]) => {
    setMediaUrls(urls);
    form.setValue('media_urls', urls);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6 animate-fade-in">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A catchy name for your startup idea" {...field} />
                  </FormControl>
                  <FormDescription>
                    Keep it concise and memorable (max 50 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="target_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="Who is this idea for?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe your target market or user demographic
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 1: // Detailed Description
        return (
          <div className="space-y-6 animate-fade-in">
            <FormField
              control={form.control}
              name="problem_statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What problem are you solving?" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Clearly define the problem your idea addresses</span>
                    <span>{field.value.length}/200</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How does your idea solve the problem?" 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Describe your solution and its unique value proposition</span>
                    <span>{field.value.length}/300</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Development Stage</FormLabel>
                  <FormControl>
                    <StageSelector
                      selectedStage={field.value as IdeaStage | null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the current stage of your idea
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2: // Media & Tags
        return (
          <div className="space-y-6 animate-fade-in">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      selectedTags={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help others discover your idea
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="media_urls"
              render={() => (
                <FormItem>
                  <FormLabel>Media</FormLabel>
                  <FormControl>
                    <MediaUploader
                      mediaUrls={mediaUrls}
                      onChange={handleMediaUpdate}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload images to illustrate your idea (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 3: // Review & Submit
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Preview summary */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{form.getValues('title')}</h3>
                <p className="text-sm text-idolyst-gray">Target: {form.getValues('target_group')}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Problem Statement</h4>
                <p className="text-sm p-3 border rounded-md bg-gray-50">
                  {form.getValues('problem_statement')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Solution</h4>
                <p className="text-sm p-3 border rounded-md bg-gray-50">
                  {form.getValues('solution')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Stage</h4>
                  <div className="text-sm p-2 border rounded-md bg-gray-50">
                    {form.getValues('stage')?.replace('_', ' ')}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {form.getValues('tags').map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {mediaUrls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Media</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="aspect-video rounded-md overflow-hidden">
                        <img
                          src={url}
                          alt={`Pitch media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Premium option */}
            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Boost Visibility ($5)</FormLabel>
                    <FormDescription>
                      Get featured placement, highlight in trending section, and premium badge
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Submit Your Pitch Idea | PitchHub | Idolyst</title>
        <meta name="description" content="Submit your startup idea to get feedback from mentors and validation from the community." />
        <meta property="og:title" content="Submit Your Pitch Idea | PitchHub | Idolyst" />
        <meta property="og:description" content="Submit your startup idea to get feedback from mentors and validation from the community." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Submit Your Pitch Idea | PitchHub | Idolyst" />
        <meta name="twitter:description" content="Submit your startup idea to get feedback from mentors and validation from the community." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-2xl mx-auto pb-20 md:pb-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Submit Your Idea</h1>
          <p className="text-idolyst-gray-dark mt-1">
            Share your startup concept and get valuable feedback
          </p>
        </div>
        
        {/* Stepper component */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`text-center flex-1 ${currentStep === index ? 'text-idolyst-purple font-medium' : 'text-idolyst-gray'}`}
              >
                <div className="text-xs sm:text-sm hidden sm:block">{step.title}</div>
                <div className="text-xs sm:hidden">{`Step ${index + 1}`}</div>
              </div>
            ))}
          </div>
          <Progress value={currentProgress} className="h-1" />
        </div>
        
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderStepContent()}
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0 || isSubmitting}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="button"
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="gradient-bg hover-scale"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Idea'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
        
        {/* Payment Modal */}
        {showPaymentModal && pitchId && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              navigate(`/pitch-hub/${pitchId}`);
            }}
            pitchId={pitchId}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default NewPitchIdea;
