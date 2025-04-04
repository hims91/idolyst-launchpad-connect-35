
import { useState, useEffect } from 'react';

/**
 * Custom hook that returns true if the provided media query matches.
 * 
 * @param query CSS media query string (e.g. '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Default to false on server/initial render to prevent hydration mismatches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Define and call the listener to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};
