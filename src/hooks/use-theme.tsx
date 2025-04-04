
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
    () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme === 'dark' ? 'dark' : 'light';
    }
  );
  const { user } = useAuth();

  const setTheme = React.useCallback(async (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolvedNewTheme = newTheme === 'system' ? systemTheme : newTheme;
    
    root.classList.add(resolvedNewTheme);
    setResolvedTheme(resolvedNewTheme);
    
    // Update localStorage and state
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    
    // If user is logged in, update their profile
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ dark_mode_enabled: resolvedNewTheme === 'dark' })
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update theme preference in profile:', error);
      }
    }
  }, [user?.id]);

  // Initialize theme from localStorage or user profile
  useEffect(() => {
    const initializeTheme = async () => {
      let savedTheme: Theme | null = localStorage.getItem('theme') as Theme | null;
      
      // If user is logged in and no localStorage theme, try to get from profile
      if (user?.id && !savedTheme) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('dark_mode_enabled')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            savedTheme = data.dark_mode_enabled ? 'dark' : 'light';
          }
        } catch (error) {
          console.error('Failed to fetch theme preference from profile:', error);
        }
      }
      
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    };
    
    initializeTheme();
  }, [user?.id, setTheme]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply transition class for smooth theme switching
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('theme-transition');
    
    const removeTransition = () => {
      html.classList.remove('theme-transition');
    };
    
    // Remove the transition class after transitions complete to avoid
    // transition on page load
    const transitionEndCallback = () => {
      removeTransition();
      html.removeEventListener('transitionend', transitionEndCallback);
    };
    
    html.addEventListener('transitionend', transitionEndCallback);
    return () => {
      removeTransition();
      html.removeEventListener('transitionend', transitionEndCallback);
    };
  }, []);

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
  }), [theme, setTheme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: 'system' as Theme,
      setTheme: () => {},
      resolvedTheme: 'light' as 'light' | 'dark'
    };
  }
  return context;
}
