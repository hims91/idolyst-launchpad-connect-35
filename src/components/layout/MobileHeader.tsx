
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Bell, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import IdolystLogo from "../shared/IdolystLogo";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/providers/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { fadeInUp, bellAnimation } from "@/lib/animations";
import { Button } from "@/components/ui/button";

const MobileHeader = () => {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // For theme toggling
  const { theme, setTheme } = useTheme();
  
  // Placeholder for unread messages - to be replaced with real data
  const unreadMessages = 0; // This would be fetched from a messaging service
  
  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  if (!isMobile) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-30 md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center py-3 px-4">
            <Link to="/" className="flex items-center">
              <IdolystLogo />
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Theme toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-idolyst-gray-dark dark:text-gray-300 hover:text-idolyst-purple dark:hover:text-idolyst-purple"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
                ) : (
                  <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
                )}
              </Button>
              
              {isAuthenticated && (
                <>
                  <Link to="/messages" className="relative">
                    <MessageSquare className="h-6 w-6 text-idolyst-gray-dark dark:text-gray-300 hover:text-idolyst-purple dark:hover:text-idolyst-purple transition-colors" />
                    
                    <AnimatePresence>
                      {unreadMessages > 0 && (
                        <motion.span 
                          className="absolute -top-1 -right-1 bg-idolyst-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                  
                  <Link to="/notifications" className="relative">
                    <motion.div
                      variants={bellAnimation}
                      whileHover="visible"
                      initial="hidden"
                    >
                      <Bell className="h-6 w-6 text-idolyst-gray-dark dark:text-gray-300 hover:text-idolyst-purple dark:hover:text-idolyst-purple transition-colors" />
                    </motion.div>
                    
                    <AnimatePresence>
                      {unreadCount > 0 && (
                        <motion.span 
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            transition: { 
                              repeat: 3,
                              repeatType: "reverse",
                              duration: 0.6
                            }
                          }}
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileHeader;
