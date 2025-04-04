
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Save, X, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { fadeInUp } from '@/lib/animations';

interface ProfileBylineProps {
  byline: string | null | undefined;
  editable?: boolean;
  onUpdate?: (byline: string) => Promise<void>;
}

const ProfileByline: React.FC<ProfileBylineProps> = ({
  byline,
  editable = false,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(byline || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setInputValue(byline || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(byline || '');
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsSubmitting(true);
    
    try {
      await onUpdate(inputValue);
      
      toast({
        title: 'Byline updated',
        description: 'Your byline has been updated successfully.'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating byline:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your byline. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {isEditing ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center space-x-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a professional headline or byline"
            maxLength={100}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {byline || (editable ? 'Add a professional headline' : '')}
          </p>
          {editable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="ml-2"
            >
              <PenLine className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileByline;
