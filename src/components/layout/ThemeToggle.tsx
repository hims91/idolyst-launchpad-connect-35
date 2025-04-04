
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'sidebar' | 'minimal';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const iconVariants = {
    initial: { scale: 0.6, opacity: 0, rotate: -30 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.6, opacity: 0, rotate: 30 }
  };

  const getButtonVariant = () => {
    if (variant === 'sidebar') return "ghost";
    if (variant === 'minimal') return "ghost";
    return "outline";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={getButtonVariant()} 
          size="icon" 
          className={cn(
            "w-9 h-9 rounded-full transition-colors",
            variant === 'sidebar' && "text-sidebar-foreground hover:text-sidebar-primary",
            className
          )}
        >
          <motion.div
            key={theme}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={iconVariants}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2 cursor-pointer">
          <Sun className="h-4 w-4 mr-1" />
          <span>Light</span>
          {theme === 'light' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 bg-idolyst-purple rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2 cursor-pointer">
          <Moon className="h-4 w-4 mr-1" />
          <span>Dark</span>
          {theme === 'dark' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 bg-idolyst-purple rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2 cursor-pointer">
          <Monitor className="h-4 w-4 mr-1" />
          <span>System</span>
          {theme === 'system' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 bg-idolyst-purple rounded-full"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
