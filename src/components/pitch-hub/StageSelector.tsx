
import React from 'react';
import { IdeaStage } from '@/api/pitch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StageSelectorProps {
  value: IdeaStage | null;
  onChange: (value: IdeaStage) => void;
  id?: string;
  required?: boolean;
}

const stages: { value: IdeaStage; label: string; description: string }[] = [
  {
    value: 'ideation',
    label: 'Ideation',
    description: 'Initial concept stage, exploring the idea and its potential'
  },
  {
    value: 'mvp',
    label: 'Minimum Viable Product (MVP)',
    description: 'Building a basic version of your product to validate core functionality'
  },
  {
    value: 'investment',
    label: 'Investment',
    description: 'Seeking funding to scale your validated concept'
  },
  {
    value: 'pmf',
    label: 'Product-Market Fit (PMF)',
    description: 'Refining your product to meet market demands effectively'
  },
  {
    value: 'go_to_market',
    label: 'Go to Market',
    description: 'Launching and executing your marketing and sales strategy'
  },
  {
    value: 'growth',
    label: 'Growth',
    description: 'Scaling operations and expanding your customer base'
  },
  {
    value: 'maturity',
    label: 'Maturity',
    description: 'Established business optimizing for profitability and stability'
  },
];

const StageSelector = ({ value, onChange, id = 'stage', required = false }: StageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
        Development Stage
      </Label>
      
      <Select
        value={value || undefined}
        onValueChange={(val) => onChange(val as IdeaStage)}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select stage of development" />
        </SelectTrigger>
        
        <SelectContent>
          {stages.map((stage) => (
            <SelectItem 
              key={stage.value} 
              value={stage.value}
              className="cursor-pointer"
            >
              <div>
                <div className="font-medium">{stage.label}</div>
                <div className="text-xs text-idolyst-gray mt-1 line-clamp-1">
                  {stage.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StageSelector;
