
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagSelectorProps {
  maxTags?: number;
  suggestedTags?: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector = ({ 
  maxTags = 5, 
  suggestedTags = [
    'AI', 'Blockchain', 'SaaS', 'Fintech', 'Mobile', 'Healthcare', 
    'Education', 'Gaming', 'Environment', 'B2B', 'B2C', 'Data', 
    'Social', 'E-commerce', 'PropTech', 'Marketplace'
  ], 
  selectedTags = [], // Provide default empty array
  onChange 
}: TagSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ensure selectedTags is always an array
  const normalizedSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  useEffect(() => {
    if (inputValue) {
      const filtered = suggestedTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !normalizedSelectedTags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestedTags, normalizedSelectedTags]);

  const handleAddTag = (tag: string) => {
    tag = tag.trim();
    if (tag && !normalizedSelectedTags.includes(tag) && normalizedSelectedTags.length < maxTags) {
      onChange([...normalizedSelectedTags, tag]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(normalizedSelectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && normalizedSelectedTags.length > 0) {
      handleRemoveTag(normalizedSelectedTags[normalizedSelectedTags.length - 1]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {normalizedSelectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center">
            {tag}
            <button 
              type="button"
              onClick={() => handleRemoveTag(tag)} 
              className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="relative" ref={inputRef}>
        <div className="flex">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            placeholder={normalizedSelectedTags.length < maxTags ? "Add tags..." : "Max tags reached"}
            disabled={normalizedSelectedTags.length >= maxTags}
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon" 
            onClick={() => handleAddTag(inputValue)}
            disabled={!inputValue || normalizedSelectedTags.length >= maxTags}
            className="ml-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showSuggestions && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleAddTag(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {normalizedSelectedTags.length < maxTags ? (
        <p className="text-xs text-gray-500 mt-1">{normalizedSelectedTags.length}/{maxTags} tags (press Enter to add)</p>
      ) : (
        <p className="text-xs text-amber-600 mt-1">Maximum tags reached</p>
      )}
      
      {(!inputValue && suggestedTags.length > 0) && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Popular tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags
              .filter(tag => !normalizedSelectedTags.includes(tag))
              .slice(0, 8)
              .map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
