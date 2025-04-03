
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import IdolystLogo from '@/components/shared/IdolystLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const MobileHeader = () => {
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  // Add shadow when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-12 md:hidden z-30 bg-white transition-all duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <IdolystLogo height={28} />
        </Link>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <Link to="/profile">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage 
                    src={user?.profile?.avatar_url || undefined} 
                    alt={user?.profile?.username || "User"} 
                  />
                  <AvatarFallback>
                    {(user?.profile?.username?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </Link>
          ) : (
            <Link to="/auth/login">
              <Button size="sm" variant="ghost" className="flex items-center">
                <LogIn className="h-4 w-4 mr-1" />
                <span className="text-sm">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
