
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Filter, Search, Star, X } from "lucide-react";
import { MentorFilter, ExpertiseCategory } from "@/types/mentor";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface FilterBarProps {
  filter: MentorFilter;
  onFilterChange: (newFilter: MentorFilter) => void;
  expertiseCategories: ExpertiseCategory[];
}

const FilterBar = ({ filter, onFilterChange, expertiseCategories }: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filter.searchQuery || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filter.minPrice || 0,
    filter.maxPrice || 200,
  ]);
  const [rating, setRating] = useState<number>(filter.minRating || 0);
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseCategory[]>(
    filter.expertise || []
  );

  const handleSearch = () => {
    onFilterChange({
      ...filter,
      searchQuery: searchInput,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filter,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleRatingChange = (values: number[]) => {
    setRating(values[0]);
    onFilterChange({
      ...filter,
      minRating: values[0],
    });
  };

  const toggleExpertise = (expertise: ExpertiseCategory) => {
    let newExpertise;
    if (selectedExpertise.includes(expertise)) {
      newExpertise = selectedExpertise.filter((e) => e !== expertise);
    } else {
      newExpertise = [...selectedExpertise, expertise];
    }
    setSelectedExpertise(newExpertise);
    onFilterChange({
      ...filter,
      expertise: newExpertise.length > 0 ? newExpertise : undefined,
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filter,
      sortBy: value as 'rating' | 'price_low' | 'price_high' | 'sessions',
    });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setPriceRange([0, 200]);
    setRating(0);
    setSelectedExpertise([]);
    onFilterChange({});
  };

  const hasFilters = 
    !!filter.searchQuery || 
    !!filter.minPrice || 
    !!filter.maxPrice || 
    !!filter.minRating || 
    (filter.expertise && filter.expertise.length > 0);

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-6 space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search mentors, skills, or keywords..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasFilters && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                    {Object.values(filter).filter(v => 
                      (Array.isArray(v) ? v.length > 0 : !!v)
                    ).length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Mentors</SheetTitle>
                <SheetDescription>
                  Refine your mentor search with these filters
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={200}
                    step={5}
                    onValueChange={handlePriceChange}
                    onValueCommit={applyPriceFilter}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Minimum Rating</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      defaultValue={[rating]}
                      max={5}
                      step={0.5}
                      onValueChange={handleRatingChange}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 min-w-[45px]">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertiseCategories.map((expertise) => (
                      <Badge
                        key={expertise}
                        variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedExpertise.includes(expertise)
                            ? "bg-purple-600"
                            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => toggleExpertise(expertise)}
                      >
                        {selectedExpertise.includes(expertise) && (
                          <Check className="mr-1 h-3 w-3" />
                        )}
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button onClick={() => {}}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSortChange('rating')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Top Rated
                  {filter.sortBy === 'rating' && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSortChange('price_low')}
                >
                  Price: Low to High
                  {filter.sortBy === 'price_low' && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSortChange('price_high')}
                >
                  Price: High to Low
                  {filter.sortBy === 'price_high' && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSortChange('sessions')}
                >
                  Most Sessions
                  {filter.sortBy === 'sessions' && <Check className="ml-auto h-4 w-4" />}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {filter.searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{filter.searchQuery}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filter, searchQuery: undefined })}
              />
            </Badge>
          )}

          {(filter.minPrice || filter.maxPrice) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${filter.minPrice || 0} - ${filter.maxPrice || '200+'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filter, minPrice: undefined, maxPrice: undefined })}
              />
            </Badge>
          )}

          {filter.minRating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filter.minRating}+ <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filter, minRating: undefined })}
              />
            </Badge>
          )}

          {filter.expertise &&
            filter.expertise.map((expertise) => (
              <Badge key={expertise} variant="secondary" className="flex items-center gap-1">
                {expertise}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newExpertise = filter.expertise?.filter((e) => e !== expertise) || [];
                    onFilterChange({
                      ...filter,
                      expertise: newExpertise.length > 0 ? newExpertise : undefined,
                    });
                  }}
                />
              </Badge>
            ))}

          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-gray-500 h-7 px-2"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default FilterBar;
