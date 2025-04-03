
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import MentorCard from "@/components/mentorspace/MentorCard";
import MentorCardSkeleton from "@/components/mentorspace/MentorCardSkeleton";
import FilterBar from "@/components/mentorspace/FilterBar";
import { Button } from "@/components/ui/button";
import { ExpertiseCategory, MentorFilter } from "@/types/mentor";
import { useMentors } from "@/hooks/use-mentors";
import { motion } from "framer-motion";
import { pageTransition, fadeInUp, staggerContainer } from "@/lib/animations";
import { 
  ArrowLeft, 
  ArrowUp, 
  Search, 
  X,
  Filter as FilterIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const expertiseCategories: ExpertiseCategory[] = [
  'Business',
  'Marketing',
  'Technology',
  'Design',
  'Finance',
  'Product',
  'Leadership',
  'Sales',
  'Operations',
  'Data'
];

const MentorDirectory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MentorFilter>({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<MentorFilter['sortBy'] | undefined>(undefined);
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  const { data: mentors, isLoading, refetch } = useMentors(filter);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Only apply filters when they've changed
    const newFilter: MentorFilter = {};
    
    if (searchQuery) {
      newFilter.searchQuery = searchQuery;
    }
    
    if (selectedExpertise.length > 0) {
      newFilter.expertise = selectedExpertise;
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      newFilter.minPrice = priceRange[0];
      newFilter.maxPrice = priceRange[1];
    }
    
    if (minRating !== undefined) {
      newFilter.minRating = minRating;
    }
    
    if (sortBy) {
      newFilter.sortBy = sortBy;
    }
    
    // Check if any filter is active
    setIsFilterActive(
      !!searchQuery || 
      selectedExpertise.length > 0 || 
      priceRange[0] > 0 || 
      priceRange[1] < 200 || 
      minRating !== undefined ||
      sortBy !== undefined
    );
    
    setFilter(newFilter);
  }, [searchQuery, selectedExpertise, priceRange, minRating, sortBy]);
  
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
    setSortBy(undefined);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Find a Mentor | Idolyst MentorSpace</title>
        <meta 
          name="description" 
          content="Connect with experienced mentors in business, technology, design, and more. Filter by expertise, price range, and ratings to find your perfect match." 
        />
        <meta 
          name="keywords" 
          content="find mentor, professional mentorship, expert advice, career mentors, business mentors, technology mentors" 
        />
        <link rel="canonical" href="/mentor-space/directory" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Find a Mentor | Idolyst MentorSpace" />
        <meta 
          property="og:description" 
          content="Connect with experienced mentors in business, technology, design, and more." 
        />
        <meta property="og:url" content="/mentor-space/directory" />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Find a Mentor | Idolyst MentorSpace",
            "description": "Connect with experienced mentors in business, technology, design, and more.",
            "url": "/mentor-space/directory",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": mentors?.slice(0, 10).map((mentor, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Person",
                  "name": mentor.profile.full_name || mentor.profile.username,
                  "description": mentor.bio,
                  "knowsAbout": mentor.expertise,
                  "jobTitle": "Mentor"
                }
              })) || []
            }
          })}
        </script>
      </Helmet>
      
      <motion.div 
        className="max-w-6xl mx-auto pb-20 md:pb-0 px-4"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/mentor-space')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Find a Mentor</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Discover mentors who can help you grow professionally
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 pr-10"
              placeholder="Search by name or keyword..."
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
          
          <div className="flex flex-wrap gap-2 items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="mr-2">
                  <FilterIcon className="h-4 w-4 mr-2" />
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
                  
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={sortBy === 'rating' ? "default" : "outline"}
                        className={`cursor-pointer ${
                          sortBy === 'rating'
                            ? "bg-purple-600"
                            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSortBy(sortBy === 'rating' ? undefined : 'rating')}
                      >
                        Top Rated
                      </Badge>
                      <Badge
                        variant={sortBy === 'price_low' ? "default" : "outline"}
                        className={`cursor-pointer ${
                          sortBy === 'price_low'
                            ? "bg-purple-600"
                            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSortBy(sortBy === 'price_low' ? undefined : 'price_low')}
                      >
                        Price: Low to High
                      </Badge>
                      <Badge
                        variant={sortBy === 'price_high' ? "default" : "outline"}
                        className={`cursor-pointer ${
                          sortBy === 'price_high'
                            ? "bg-purple-600"
                            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSortBy(sortBy === 'price_high' ? undefined : 'price_high')}
                      >
                        Price: High to Low
                      </Badge>
                      <Badge
                        variant={sortBy === 'sessions' ? "default" : "outline"}
                        className={`cursor-pointer ${
                          sortBy === 'sessions'
                            ? "bg-purple-600"
                            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSortBy(sortBy === 'sessions' ? undefined : 'sessions')}
                      >
                        Most Sessions
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy ? sortBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Featured'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy(undefined)}>
                  Featured
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Top Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_low')}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_high')}>
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('sessions')}>
                  Most Sessions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isFilterActive && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
                className="text-purple-600 dark:text-purple-400"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {selectedExpertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedExpertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="gap-1">
                  {exp}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleExpertiseToggle(exp)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <MentorCardSkeleton key={index} />
            ))}
          </div>
        ) : mentors && mentors.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            className="space-y-4"
          >
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={fadeInUp}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No mentors match your current filters.
            </p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </motion.div>
        )}
        
        {showScrollTop && (
          <motion.button
            className="fixed bottom-20 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>
    </Layout>
  );
};

export default MentorDirectory;
