
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ProfessionalExperience } from '@/types/auth';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, CalendarDays, MapPin, PenLine } from 'lucide-react';
import ProfileExperienceForm from './ProfileExperienceForm';

interface ProfileExperienceProps {
  experiences: ProfessionalExperience[];
  editable?: boolean;
  onUpdate?: (experiences: ProfessionalExperience[]) => Promise<void>;
}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({
  experiences,
  editable = false,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ProfessionalExperience | null>(null);

  const handleAddNew = () => {
    setSelectedExperience(null);
    setIsEditing(true);
  };

  const handleEdit = (experience: ProfessionalExperience) => {
    setSelectedExperience(experience);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedExperience(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const sortedExperiences = [...experiences].sort((a, b) => {
    const aDate = a.isCurrentPosition ? new Date() : new Date(a.endDate || '');
    const bDate = b.isCurrentPosition ? new Date() : new Date(b.endDate || '');
    return bDate.getTime() - aDate.getTime();
  });

  if (isEditing) {
    return (
      <ProfileExperienceForm
        experience={selectedExperience}
        experiences={experiences}
        onClose={handleClose}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-idolyst-purple" />
          Professional Experience
        </h3>
        
        {editable && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddNew}
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        )}
      </div>

      {sortedExperiences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
          <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No professional experience added yet</p>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAddNew}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          )}
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {sortedExperiences.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionItem 
                value={experience.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{experience.title}</h4>
                      {editable && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(experience)}
                          className="h-6 w-6 p-0 rounded-full"
                        >
                          <PenLine className="h-3.5 w-3.5 text-gray-500" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{experience.company}</p>
                    <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        {formatDate(experience.startDate)} — {experience.isCurrentPosition ? 'Present' : formatDate(experience.endDate || '')}
                      </span>
                      {experience.location && (
                        <span className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {experience.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <AccordionTrigger className="p-0" />
                </div>
                <AccordionContent className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                  {experience.description || 'No description provided.'}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ProfileExperience;
