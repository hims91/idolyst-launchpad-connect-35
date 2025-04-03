
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/api/launchpad';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const categories = getCategories();
  
  // Check if scrolling is needed and update arrow visibility
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollWidth > container.clientWidth && 
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };
  
  // Set up scroll checking
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      // Initial check
      checkScroll();
      
      // Cleanup
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);
  
  // Scroll to the selected category to make it visible
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const selectedElement = container.querySelector(`[data-category="${selectedCategory}"]`);
    if (selectedElement) {
      // Calculate position to center the element
      const scrollLeft = selectedElement.getBoundingClientRect().left + 
        container.scrollLeft - 
        container.getBoundingClientRect().left - 
        (container.clientWidth / 2) + 
        (selectedElement.getBoundingClientRect().width / 2);
        
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedCategory]);
  
  // Scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative w-full">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <motion.div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
      
      {/* Categories scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-1 -mx-1"
      >
        {categories.map(category => (
          <motion.div
            key={category}
            data-category={category}
            whileTap={{ scale: 0.95 }}
            className="px-1"
          >
            <Button
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'gradient-bg hover-scale' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Right scroll arrow */}
      {showRightArrow && (
        <motion.div 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryFilter;
