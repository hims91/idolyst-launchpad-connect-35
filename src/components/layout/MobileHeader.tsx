
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, X, ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent,
  SheetClose
} from '@/components/ui/sheet';

const MobileHeader: React.FC = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Determine if we need the back button rather than menu
  const shouldShowBackButton = location.pathname !== "/" && 
                              !location.pathname.match(/^\/(?:mentor-space|pitch-hub|messages|ascend|profile)$/);
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Idolyst';
    if (path === '/pitch-hub') return 'PitchHub';
    if (path.includes('/pitch-hub')) return 'PitchHub';
    if (path === '/mentor-space') return 'MentorSpace';
    if (path.includes('/mentor-space')) return 'MentorSpace';
    if (path === '/ascend') return 'Ascend';
    if (path.includes('/ascend')) return 'Ascend';
    if (path.includes('/messages')) return 'Messages';
    if (path === '/profile') return 'My Profile';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/settings')) return 'Settings';
    
    return 'Idolyst';
  };
  
  const pageTitle = getPageTitle();
  
  // Mobile search component
  const MobileSearch = () => (
    <div className="fixed inset-0 bg-background z-40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSearchOpen(false)}
          className="shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full px-4 py-2 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
      </div>
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">Recent Searches</p>
        {/* Recent search items would go here */}
        <p className="text-sm text-muted-foreground">No recent searches</p>
      </div>
    </div>
  );

  return (
    <>
      <header className="px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {shouldShowBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
                          <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase() || "ID"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{profile?.full_name || "Idolyst User"}</p>
                          <p className="text-sm text-muted-foreground truncate">@{profile?.username || "idolyst_user"}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-medium">Welcome to Idolyst</p>
                        <div className="flex gap-2">
                          <SheetClose asChild>
                            <Button asChild variant="default" className="w-full">
                              <Link to="/auth/login">Sign In</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full">
                              <Link to="/auth/signup">Sign Up</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    )}
                  </div>
                  <nav className="flex-1 overflow-y-auto p-2">
                    <div className="grid gap-1 px-2">
                      <SheetClose asChild>
                        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                          <span>Home</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/pitch-hub" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                          <span>PitchHub</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/mentor-space" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                          <span>MentorSpace</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/ascend" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                          <span>Ascend</span>
                        </Link>
                      </SheetClose>
                      
                      {user && (
                        <>
                          <hr className="my-2 border-t border-muted" />
                          <SheetClose asChild>
                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                              <span>My Profile</span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                              <span>Settings</span>
                            </Link>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </nav>
                  {user && (
                    <div className="p-4 border-t">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" onClick={() => {/* Sign out logic */}}>
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <h1 className="text-lg font-semibold truncate">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)} 
            className="shrink-0"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {user && (
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      {/* Mobile search overlay */}
      {searchOpen && <MobileSearch />}
    </>
  );
};

export default MobileHeader;
