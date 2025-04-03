
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ExpertiseCategory, MentorFilter } from "@/types/mentor";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterBarProps {
  expertiseCategories: ExpertiseCategory[];
  onFilterChange: (filter: MentorFilter) => void;
}

const FilterBar = ({ expertiseCategories, onFilterChange }: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  useEffect(() => {
    // Apply filters when they change
    const filter: MentorFilter = {};
    
    if (searchQuery) {
      filter.searchQuery = searchQuery;
    }
    
    if (selectedExpertise.length > 0) {
      filter.expertise = selectedExpertise;
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      filter.minPrice = priceRange[0];
      filter.maxPrice = priceRange[1];
    }
    
    if (minRating !== undefined) {
      filter.minRating = minRating;
    }
    
    // Check if any filter is active
    setIsFilterActive(
      !!searchQuery || 
      selectedExpertise.length > 0 || 
      priceRange[0] > 0 || 
      priceRange[1] < 200 || 
      minRating !== undefined
    );
    
    onFilterChange(filter);
  }, [searchQuery, selectedExpertise, priceRange, minRating, onFilterChange]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleExpertiseToggle = (expertise: ExpertiseCategory) => {
    if (selectedExpertise.includes(expertise)) {
      setSelectedExpertise(selectedExpertise.filter(e => e !== expertise));
    } else {
      setSelectedExpertise([...selectedExpertise, expertise]);
    }
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedExpertise([]);
    setPriceRange([0, 200]);
    setMinRating(undefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 pr-10"
          placeholder="Search mentors..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
              {isFilterActive && <span className="ml-1 w-2 h-2 rounded-full bg-purple-500"></span>}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Filter Mentors</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseCategories.map((exp) => (
                    <Badge
                      key={exp}
                      variant={selectedExpertise.includes(exp) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedExpertise.includes(exp)
                          ? "bg-purple-600"
                          : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleExpertiseToggle(exp)}
                    >
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 200]}
                    max={200}
                    step={5}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Badge
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      className={`cursor-pointer ${
                        minRating === rating
                          ? "bg-amber-500"
                          : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setMinRating(minRating === rating ? undefined : rating)}
                    >
                      {rating}+ ★
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {selectedExpertise.length > 0 && (
          <div className="flex-1 overflow-x-auto whitespace-nowrap py-1 px-1 scrollbar-hide">
            <div className="flex gap-1">
              {selectedExpertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="gap-1 flex-shrink-0">
                  {exp}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleExpertiseToggle(exp)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {isFilterActive && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearFilters}
            className="text-purple-600 dark:text-purple-400 shrink-0"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
