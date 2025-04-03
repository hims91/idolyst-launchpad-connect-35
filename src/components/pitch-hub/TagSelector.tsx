
import React, { useState } from 'react';
import { Command, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  availableTags?: string[];
  maxTags?: number;
  id?: string;
  required?: boolean;
}

const TagSelector = ({ 
  value = [], 
  onChange, 
  availableTags = [],
  maxTags = 5,
  id = 'tags',
  required = false,
}: TagSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  
  // Filter available tags that haven't been selected yet
  const filteredTags = availableTags
    .filter(tag => !value.includes(tag))
    .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Create a custom tag from the search input if it doesn't exist
  const hasExactMatch = availableTags.some(
    tag => tag.toLowerCase() === searchQuery.toLowerCase()
  );
  
  const canCreateTag = searchQuery.trim().length > 0 && 
                     !hasExactMatch && 
                     !value.some(tag => tag.toLowerCase() === searchQuery.toLowerCase()) &&
                     value.length < maxTags;

  const addTag = (tag: string) => {
    const formattedTag = tag.trim();
    if (formattedTag && !value.includes(formattedTag) && value.length < maxTags) {
      onChange([...value, formattedTag]);
      setSearchQuery('');
    }
  };
  
  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
        Tags
      </Label>
      
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-idolyst-gray-dark hover:text-idolyst-gray-dark"
              disabled={value.length >= maxTags}
            >
              {value.length === 0 ? (
                <span>Select or create tags...</span>
              ) : (
                <span>{value.length} tag{value.length !== 1 ? 's' : ''} selected</span>
              )}
              <Command className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <CommandPrimitive>
              <CommandInput 
                placeholder="Search or create a tag..."
                onValueChange={setSearchQuery}
                value={searchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {canCreateTag ? (
                    <div className="py-3 px-4 text-sm">
                      Create tag:
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          addTag(searchQuery);
                          setOpen(false);
                        }}
                      >
                        "{searchQuery}"
                      </Button>
                    </div>
                  ) : (
                    'No matching tags found.'
                  )}
                </CommandEmpty>
                {filteredTags.length > 0 && (
                  <CommandGroup heading="Available Tags">
                    {filteredTags.map(tag => (
                      <CommandItem
                        key={tag}
                        onSelect={() => {
                          addTag(tag);
                          setOpen(false);
                        }}
                      >
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </CommandPrimitive>
          </PopoverContent>
        </Popover>
        
        {/* Selected tags */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {value.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </Button>
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-xs text-idolyst-gray mt-2">
          {value.length}/{maxTags} tags max. Add relevant categories for your idea.
        </p>
      </div>
    </div>
  );
};

export default TagSelector;
