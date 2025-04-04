
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { UserQualification } from '@/types/auth';
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

const qualificationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution name is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentlyStudying: z.boolean().default(false),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof qualificationSchema>;

interface ProfileQualificationFormProps {
  qualification: UserQualification | null;
  qualifications: UserQualification[];
  onClose: () => void;
  onUpdate?: (qualifications: UserQualification[]) => Promise<void>;
}

const ProfileQualificationForm: React.FC<ProfileQualificationFormProps> = ({
  qualification,
  qualifications,
  onClose,
  onUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditing = !!qualification;

  const form = useForm<FormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      degree: qualification?.degree || '',
      institution: qualification?.institution || '',
      fieldOfStudy: qualification?.fieldOfStudy || '',
      startDate: qualification?.startDate || '',
      endDate: qualification?.endDate || '',
      isCurrentlyStudying: qualification?.isCurrentlyStudying || false,
      description: qualification?.description || '',
    },
  });

  const { watch } = form;
  const isCurrentlyStudying = watch('isCurrentlyStudying');

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // For new qualification
      if (!isEditing) {
        const newQualification: UserQualification = {
          id: uuidv4(),
          ...values,
        };

        const updatedQualifications = [...qualifications, newQualification];
        
        if (onUpdate) {
          await onUpdate(updatedQualifications);
        }
        
        toast({
          title: 'Education added',
          description: 'Your educational qualification has been added successfully.',
        });
      } 
      // For editing existing qualification
      else {
        const updatedQualifications = qualifications.map(qual => 
          qual.id === qualification.id ? { ...qual, ...values } : qual
        );
        
        if (onUpdate) {
          await onUpdate(updatedQualifications);
        }
        
        toast({
          title: 'Education updated',
          description: 'Your educational qualification has been updated successfully.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error updating education:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your education. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !qualification) return;
    
    setIsDeleting(true);
    
    try {
      const updatedQualifications = qualifications.filter(qual => qual.id !== qualification.id);
      
      if (onUpdate) {
        await onUpdate(updatedQualifications);
      }
      
      toast({
        title: 'Education deleted',
        description: 'The educational qualification has been removed from your profile.',
      });
      
      onClose();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting this education. Please try again.',
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
          {isEditing ? 'Edit Education' : 'Add Education'}
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
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor of Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stanford University" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study <span className="text-gray-400">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Computer Science" {...field} />
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
                name="isCurrentlyStudying"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Currently Studying</FormLabel>
                      <FormDescription>
                        I am currently pursuing this degree
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

              {!isCurrentlyStudying && (
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
                    placeholder="Add details about your studies, awards, or achievements..." 
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

export default ProfileQualificationForm;
