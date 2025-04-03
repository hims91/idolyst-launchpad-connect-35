
import React from 'react';
import { Check } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IdeaStage } from '@/api/pitch';

interface StageSelectorProps {
  selectedStage: IdeaStage | null;
  onChange: (stage: IdeaStage) => void;
}

const stages: { id: IdeaStage; title: string; description: string }[] = [
  {
    id: 'ideation',
    title: 'Ideation',
    description: 'Just an idea, exploring concepts'
  },
  {
    id: 'mvp',
    title: 'MVP',
    description: 'Building a minimum viable product'
  },
  {
    id: 'pmf',
    title: 'PMF',
    description: 'Achieved product-market fit'
  },
  {
    id: 'investment',
    title: 'Investment',
    description: 'Raising or secured investment'
  },
  {
    id: 'go_to_market',
    title: 'Go-To-Market',
    description: 'Developing marketing strategy'
  },
  {
    id: 'growth',
    title: 'Growth',
    description: 'Scaling the business'
  },
  {
    id: 'maturity',
    title: 'Maturity',
    description: 'Established business'
  }
];

const StageSelector = ({ selectedStage, onChange }: StageSelectorProps) => {
  return (
    <RadioGroup
      value={selectedStage || undefined}
      onValueChange={(value: IdeaStage) => onChange(value)}
      className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full"
    >
      {stages.map((stage) => (
        <div key={stage.id}>
          <RadioGroupItem
            value={stage.id}
            id={`stage-${stage.id}`}
            className="peer sr-only"
          />
          <Label
            htmlFor={`stage-${stage.id}`}
            className="flex flex-col items-start space-y-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold">{stage.title}</div>
              <Check className="h-4 w-4 opacity-0 peer-data-[state=checked]:opacity-100" />
            </div>
            <div className="text-sm text-muted-foreground">
              {stage.description}
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default StageSelector;
