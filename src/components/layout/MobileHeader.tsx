
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import IdolystLogo from '@/components/shared/IdolystLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogIn, Settings, LogOut, User, 
  Bell, MessageSquare, Shield, Home,
  GitPullRequest, BookOpen, TrendingUp
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useUnreadMessages } from '@/hooks/use-unread-messages';

const MobileHeader = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { unreadCount } = useUnreadMessages();
  
  // Add shadow when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-12 md:hidden z-30 bg-white dark:bg-gray-900 transition-all duration-200 ${
        scrolled ? 'shadow-md dark:shadow-gray-800/50' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <IdolystLogo size="small" />
        </Link>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle variant="minimal" />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer relative"
                >
                  <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                    <AvatarImage 
                      src={user?.profile?.avatar_url || undefined} 
                      alt={user?.profile?.username || "User"} 
                    />
                    <AvatarFallback>
                      {(user?.profile?.username?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {(unreadCount > 0) && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    />
                  )}
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.profile?.full_name || user?.profile?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto py-0 h-5">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/pitch-hub">
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      <span>PitchHub</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mentor-space">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>MentorSpace</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ascend">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Ascend</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
