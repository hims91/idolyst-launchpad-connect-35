
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Sparkles,
  Rocket,
  Users,
  MessageCircle,
  Bell,
  Settings,
  LogIn,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IdolystLogo from '@/components/shared/IdolystLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar, SidebarSection } from '@/components/ui/sidebar';

const WebSidebar = () => {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message || "An error occurred during sign out",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign out error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  // Mark a nav item as active if it's the current route
  const isActive = (path: string) => {
    // Exact match for home
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // Prefix match for other routes, but not home
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <Sidebar className="hidden md:flex">
      <div className="flex flex-col h-full py-6 pr-2">
        {/* Logo */}
        <div className="px-6 pb-6 mb-2">
          <Link to="/">
            <IdolystLogo />
          </Link>
        </div>

        {/* Main Navigation */}
        <SidebarSection>
          <TooltipProvider delayDuration={300}>
            <div className="space-y-1 px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/">
                    <Button
                      variant={isActive('/') ? "default" : "ghost"}
                      size="lg"
                      className={`w-full justify-start ${
                        isActive('/') ? 'gradient-bg hover-scale' : ''
                      }`}
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Launchpad
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Connect with the startup ecosystem
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/pitch-hub">
                    <Button
                      variant={isActive('/pitch-hub') ? "default" : "ghost"}
                      size="lg"
                      className={`w-full justify-start ${
                        isActive('/pitch-hub') ? 'gradient-bg hover-scale' : ''
                      }`}
                    >
                      <Rocket className="mr-2 h-5 w-5" />
                      PitchHub
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Launch and discover startup ideas
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/mentor-space">
                    <Button
                      variant={isActive('/mentor-space') ? "default" : "ghost"}
                      size="lg"
                      className={`w-full justify-start ${
                        isActive('/mentor-space') ? 'gradient-bg hover-scale' : ''
                      }`}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      MentorSpace
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Find mentors or become one
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/ascend">
                    <Button
                      variant={isActive('/ascend') ? "default" : "ghost"}
                      size="lg"
                      className={`w-full justify-start ${
                        isActive('/ascend') ? 'gradient-bg hover-scale' : ''
                      }`}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Ascend
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Grow and track your progress
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </SidebarSection>

        {/* Quick Actions */}
        {isAuthenticated && !isLoading && (
          <SidebarSection title="Quick Actions">
            <TooltipProvider delayDuration={300}>
              <div className="space-y-1 px-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/messages">
                      <Button
                        variant={isActive('/messages') ? "default" : "ghost"}
                        size="lg"
                        className={`w-full justify-start ${
                          isActive('/messages') ? 'gradient-bg hover-scale' : ''
                        }`}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Messages
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Connect with other users
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/notifications">
                      <Button
                        variant={isActive('/notifications') ? "default" : "ghost"}
                        size="lg"
                        className={`w-full justify-start ${
                          isActive('/notifications') ? 'gradient-bg hover-scale' : ''
                        }`}
                      >
                        <Bell className="mr-2 h-5 w-5" />
                        Notifications
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    View your notifications
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings">
                      <Button
                        variant={isActive('/settings') ? "default" : "ghost"}
                        size="lg"
                        className={`w-full justify-start ${
                          isActive('/settings') ? 'gradient-bg hover-scale' : ''
                        }`}
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        Settings
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Manage your account
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </SidebarSection>
        )}

        {/* User Profile / Login */}
        <div className="mt-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-idolyst-purple" />
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              <Link to="/profile">
                <Button
                  variant={isActive('/profile') ? "default" : "ghost"}
                  size="lg"
                  className={`w-full justify-start ${
                    isActive('/profile') ? 'gradient-bg hover-scale' : ''
                  }`}
                >
                  <Avatar className="h-6 w-6 mr-2 border border-gray-200">
                    <AvatarImage 
                      src={user?.profile?.avatar_url || undefined} 
                      alt={user?.profile?.username || "User"} 
                    />
                    <AvatarFallback>
                      {(user?.profile?.username?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {user?.profile?.username || "Profile"}
                  </span>
                </Button>
              </Link>

              <Button 
                variant="outline" 
                size="lg"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-5 w-5" />
                )}
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/auth/login">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full justify-start gradient-bg hover-scale"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>

              <Link to="/auth/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default WebSidebar;
