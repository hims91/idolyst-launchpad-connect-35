
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/api/launchpad";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = getCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  // Check if scrolling is needed
  useEffect(() => {
    const checkForScrollButtons = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setShowRightScroll(hasOverflow && container.scrollLeft < container.scrollWidth - container.clientWidth);
      setShowLeftScroll(container.scrollLeft > 0);
    };
    
    checkForScrollButtons();
    window.addEventListener('resize', checkForScrollButtons);
    
    return () => {
      window.removeEventListener('resize', checkForScrollButtons);
    };
  }, []);
  
  // Scroll on button click
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth / 2;
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
      
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
    
    // Update scroll buttons after animation
    setTimeout(() => {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }, 300);
  };
  
  // Scroll to selected category
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const selectedButton = container.querySelector(`[data-category="${selectedCategory}"]`) as HTMLButtonElement;
    if (selectedButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();
      
      const isVisible = 
        buttonRect.left >= containerRect.left && 
        buttonRect.right <= containerRect.right;
      
      if (!isVisible) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedCategory]);
  
  return (
    <div className="relative">
      <div className="flex items-center">
        {/* Left scroll button */}
        <AnimatedScrollButton 
          direction="left" 
          onClick={() => handleScroll('left')} 
          visible={showLeftScroll}
        />
        
        {/* Categories */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-1 py-2 transition-all"
          style={{ scrollBehavior: 'smooth' }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              data-category={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`
                whitespace-nowrap py-1.5 px-3 rounded-full transition-all
                ${selectedCategory === category 
                  ? 'gradient-bg hover:opacity-90' 
                  : 'hover:border-idolyst-purple hover:text-idolyst-purple'}
              `}
              size="sm"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Right scroll button */}
        <AnimatedScrollButton 
          direction="right" 
          onClick={() => handleScroll('right')} 
          visible={showRightScroll} 
        />
      </div>
    </div>
  );
};

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  visible: boolean;
}

const AnimatedScrollButton: React.FC<ScrollButtonProps> = ({ direction, onClick, visible }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={`absolute z-10 ${direction === 'left' ? 'left-0' : 'right-0'}`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={`h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white hover:shadow ${
          direction === 'left'
            ? 'hover:translate-x-[-2px] -ml-1'
            : 'hover:translate-x-[2px] -mr-1'
        }`}
      >
        {direction === 'left' ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
};

export default CategoryFilter;
