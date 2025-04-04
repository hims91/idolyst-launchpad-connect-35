
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Rocket, 
  Users, 
  Award, 
  MessageSquare, 
  Settings, 
  Bell, 
  LogOut,
  User,
  Search
} from 'lucide-react';

interface WebSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const WebSidebar: React.FC<WebSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home, requiresAuth: false },
    { path: '/pitch-hub', label: 'PitchHub', icon: Rocket, requiresAuth: false },
    { path: '/mentor-space', label: 'MentorSpace', icon: Users, requiresAuth: false },
    { path: '/ascend', label: 'Ascend', icon: Award, requiresAuth: false }
  ];
  
  const userNavItems = [
    { path: '/messages', label: 'Messages', icon: MessageSquare, requiresAuth: true },
    { path: '/profile', label: 'Profile', icon: User, requiresAuth: false },
    { path: '/notifications', label: 'Notifications', icon: Bell, requiresAuth: true },
    { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true }
  ];
  
  // Filter items based on auth status
  const filteredUserNavItems = userNavItems.filter(item => !item.requiresAuth || user);

  return (
    <aside className="h-full border-r flex flex-col bg-background">
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <h1 className="text-xl font-bold">Idolyst</h1>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggle} 
          className={collapsed ? 'mx-auto' : ''}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="px-2 py-2 border-b">
        <Button 
          variant="outline" 
          className={`w-full justify-start ${collapsed ? 'px-0 min-w-0' : ''}`}
        >
          <Search className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Search</span>}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="grid gap-1 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted ${
                    active ? 'bg-muted' : ''
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  {!collapsed && <span className={active ? 'font-medium' : ''}>{item.label}</span>}
                </Link>
              </li>
            );
          })}
          
          <li className="mt-6 mb-2">
            {!collapsed && <p className="px-3 text-xs font-medium text-muted-foreground">Account</p>}
          </li>
          
          {filteredUserNavItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted ${
                    active ? 'bg-muted' : ''
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  {!collapsed && <span className={active ? 'font-medium' : ''}>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
              <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase() || "ID"}</AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile?.full_name || "Idolyst User"}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile?.username || "user"}</p>
              </div>
            )}
            
            {!collapsed ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {!collapsed ? (
              <>
                <Link to="/auth/login">
                  <Button variant="default" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="outline" className="w-full">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Link to="/auth/login">
                <Button variant="outline" size="icon" className="w-full">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default WebSidebar;
