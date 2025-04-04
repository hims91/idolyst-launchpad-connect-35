
import { Link, useLocation } from "react-router-dom";
import { Home, User, Trophy, Rocket, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavigation = () => {
  const location = useLocation();
  
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
    },
    {
      name: "Ascend",
      icon: Trophy,
      path: "/ascend",
    },
    {
      name: "PitchHub",
      icon: Rocket,
      path: "/pitch-hub",
      isPrimary: true,
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 md:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 w-full h-full transition-all",
                isActive 
                  ? "text-idolyst-purple" 
                  : "text-idolyst-gray",
                item.isPrimary && "relative"
              )}
            >
              {item.isPrimary && (
                <div className="absolute -top-6 w-14 h-14 bg-gradient-to-r from-idolyst-purple to-idolyst-purple-dark rounded-full flex items-center justify-center shadow-lg">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
              )}
              
              {!item.isPrimary && (
                <item.icon className={cn(
                  "h-6 w-6",
                  isActive && "animate-bounce"
                )} />
              )}
              
              <span className={cn(
                "text-xs mt-1",
                item.isPrimary && "mt-7"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavigation;
