
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ProfessionalExperience } from '@/types/auth';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader, X, Save, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentPosition: z.boolean().default(false),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof experienceSchema>;

interface ProfileExperienceFormProps {
  experience: ProfessionalExperience | null;
  experiences: ProfessionalExperience[];
  onClose: () => void;
  onUpdate?: (experiences: ProfessionalExperience[]) => Promise<void>;
}

const ProfileExperienceForm: React.FC<ProfileExperienceFormProps> = ({
  experience,
  experiences,
  onClose,
  onUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!experience;

  const form = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: experience?.title || '',
      company: experience?.company || '',
      location: experience?.location || '',
      startDate: experience?.startDate || '',
      endDate: experience?.endDate || '',
      isCurrentPosition: experience?.isCurrentPosition || false,
      description: experience?.description || '',
    },
  });

  const { watch } = form;
  const isCurrentPosition = watch('isCurrentPosition');

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // For new experience
      if (!isEditing) {
        const newExperience: ProfessionalExperience = {
          id: uuidv4(),
          ...values,
        };

        const updatedExperiences = [...experiences, newExperience];
        
        if (onUpdate) {
          await onUpdate(updatedExperiences);
        }
        
        toast({
          title: 'Experience added',
          description: 'Your professional experience has been added successfully.',
        });
      } 
      // For editing existing experience
      else {
        const updatedExperiences = experiences.map(exp => 
          exp.id === experience.id ? { ...exp, ...values } : exp
        );
        
        if (onUpdate) {
          await onUpdate(updatedExperiences);
        }
        
        toast({
          title: 'Experience updated',
          description: 'Your professional experience has been updated successfully.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !experience) return;
    
    setIsDeleting(true);
    
    try {
      const updatedExperiences = experiences.filter(exp => exp.id !== experience.id);
      
      if (onUpdate) {
        await onUpdate(updatedExperiences);
      }
      
      toast({
        title: 'Experience deleted',
        description: 'The experience has been removed from your profile.',
      });
      
      onClose();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting this experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Edit Experience' : 'Add Experience'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting || isDeleting}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location <span className="text-gray-400">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g., San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="month" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isCurrentPosition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Current Position</FormLabel>
                      <FormDescription>
                        I currently work here
                      </FormDescription>
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

              {!isCurrentPosition && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="month" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-gray-400">(Optional)</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your responsibilities and achievements..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-2">
            {isEditing ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            ) : (
              <div /> // Empty div to maintain flex layout
            )}

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileExperienceForm;
