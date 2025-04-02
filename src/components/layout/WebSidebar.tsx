
import { Link, useLocation } from "react-router-dom";
import { Home, User, Trophy, Rocket, Users, MessageSquare, Bell, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import IdolystLogo from "../shared/IdolystLogo";

const WebSidebar = () => {
  const location = useLocation();
  const { isAuthenticated, profile, signOut } = useAuth();
  
  const navItems = [
    {
      name: "Launchpad",
      icon: Home,
      path: "/",
    },
    {
      name: "MentorSpace",
      icon: Users,
      path: "/mentor-space",
      requiresAuth: true,
    },
    {
      name: "Ascend",
      icon: Trophy,
      path: "/ascend",
      requiresAuth: true,
    },
    {
      name: "PitchHub",
      icon: Rocket,
      path: "/pitch-hub",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      requiresAuth: true,
    },
  ];
  
  // Additional items for logged in users
  const extraItems = [
    {
      name: "Messages",
      icon: MessageSquare,
      path: "/messages",
      badge: 3,
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge: 5,
    },
  ];

  return (
    <Sidebar className="hidden md:flex border-r border-border bg-white">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <IdolystLogo />
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-6 p-4">
          <nav className="space-y-1">
            {navItems
              .filter(item => !item.requiresAuth || isAuthenticated)
              .map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-lg transition-colors group",
                      isActive
                        ? "bg-idolyst-purple/10 text-idolyst-purple"
                        : "hover:bg-gray-100 text-idolyst-gray-dark"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      isActive
                        ? "text-idolyst-purple"
                        : "text-idolyst-gray group-hover:text-idolyst-purple-dark"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
              
            {isAuthenticated && (
              <div className="pt-4 border-t border-border mt-4">
                {extraItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-lg transition-colors group relative",
                        isActive
                          ? "bg-idolyst-purple/10 text-idolyst-purple"
                          : "hover:bg-gray-100 text-idolyst-gray-dark"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3",
                        isActive
                          ? "text-idolyst-purple"
                          : "text-idolyst-gray group-hover:text-idolyst-purple-dark"
                      )} />
                      {item.name}
                      
                      {item.badge && (
                        <span className="absolute right-3 bg-idolyst-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        {!isAuthenticated ? (
          <div className="space-y-2">
            <Button asChild className="w-full gradient-bg">
              <Link to="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        ) : profile ? (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User"} />
              <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple">
                {profile.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-idolyst-gray-dark truncate">
                  {profile.username || "User"}
                </p>
                <button 
                  onClick={() => signOut()} 
                  className="ml-2 text-idolyst-gray hover:text-idolyst-purple"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-idolyst-gray truncate">
                {profile.full_name || profile.email}
              </p>
            </div>
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
};

export default WebSidebar;
