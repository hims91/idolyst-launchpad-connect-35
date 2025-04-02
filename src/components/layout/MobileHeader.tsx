
import { Link } from "react-router-dom";
import { MessageSquare, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import IdolystLogo from "../shared/IdolystLogo";

const MobileHeader = () => {
  // Placeholder for unread counts
  const unreadMessages = 3;
  const unreadNotifications = 5;

  return (
    <div className="sticky top-0 left-0 right-0 bg-white shadow-sm z-30 md:hidden">
      <div className="flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center">
          <IdolystLogo />
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/messages" className="relative">
            <MessageSquare className="h-6 w-6 text-idolyst-gray-dark hover:text-idolyst-purple transition-colors" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-idolyst-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>
          
          <Link to="/notifications" className="relative">
            <Bell className="h-6 w-6 text-idolyst-gray-dark hover:text-idolyst-purple transition-colors" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
