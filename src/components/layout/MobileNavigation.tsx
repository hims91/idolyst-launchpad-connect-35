
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Rocket, 
  Users, 
  Award, 
  MessageSquare, 
  User
} from 'lucide-react';

interface MobileNavigationProps {
  onNavItemClick?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onNavItemClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home, 
      requiresAuth: false 
    },
    { 
      path: '/pitch-hub', 
      label: 'PitchHub', 
      icon: Rocket, 
      requiresAuth: false 
    },
    { 
      path: '/mentor-space', 
      label: 'Mentors', 
      icon: Users, 
      requiresAuth: false 
    },
    { 
      path: '/ascend', 
      label: 'Ascend', 
      icon: Award, 
      requiresAuth: false 
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      requiresAuth: true 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User, 
      requiresAuth: false 
    }
  ];
  
  // Filter items based on auth status
  const filteredNavItems = navItems.filter(item => !item.requiresAuth || user);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-t">
      <ul className="flex justify-around">
        {filteredNavItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <li key={item.path} className="w-full">
              <Link 
                to={item.path}
                onClick={onNavItemClick}
                className={`flex flex-col items-center justify-center px-1 py-2 h-16 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`h-5 w-5 mb-1 ${active ? 'text-primary' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavigation;
