
import React, { useEffect, useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import WebSidebar from './WebSidebar';
import WebRightSidebar from './WebRightSidebar';
import { useLocation, Link } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children,
  showRightSidebar = true
}) => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const location = useLocation();
  
  // Handle scroll events for hiding/showing mobile header and navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 60) {
        // Scrolling down - hide header
        if (currentScrollY > lastScrollY && headerVisible) {
          setHeaderVisible(false);
        } 
        // Scrolling up - show header
        else if (currentScrollY < lastScrollY && !headerVisible) {
          setHeaderVisible(true);
        }
        
        // Hide bottom nav on significant scroll down, show on scroll up
        if (currentScrollY > lastScrollY + 20 && navVisible) {
          setNavVisible(false);
        } else if (currentScrollY < lastScrollY - 20 && !navVisible) {
          setNavVisible(true);
        }
      } else {
        // Always show at top of page
        setHeaderVisible(true);
        setNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, headerVisible, navVisible]);
  
  // Provide haptic feedback for mobile interactions
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5); // Subtle 5ms vibration
    }
  };
  
  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
    if (isDesktop) triggerHapticFeedback();
  };
  
  const toggleRightSidebar = () => {
    setRightSidebarCollapsed(!rightSidebarCollapsed);
    if (isDesktop) triggerHapticFeedback();
  };
  
  // Reset visibility when route changes
  useEffect(() => {
    setHeaderVisible(true);
    setNavVisible(true);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Mobile Header */}
      {!isDesktop && (
        <div 
          className={`fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out bg-background/95 backdrop-blur-sm border-b ${
            headerVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <MobileHeader />
        </div>
      )}
      
      {/* Main Layout */}
      <div className="flex flex-1 pt-16 lg:pt-0">
        {/* Left Sidebar - Web Only */}
        {isDesktop && (
          <div 
            className={`h-screen sticky top-0 transition-all duration-300 ease-in-out ${
              leftSidebarCollapsed ? 'w-[60px]' : 'w-[250px]'
            }`}
          >
            <WebSidebar collapsed={leftSidebarCollapsed} onToggle={toggleLeftSidebar} />
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 transition-all duration-300">
          <main className={`container-fluid py-4 ${isDesktop ? 'pb-8' : 'pb-24'}`}>
            {children}
          </main>
        </div>
        
        {/* Right Sidebar - Web Only */}
        {isDesktop && showRightSidebar && (
          <div 
            className={`h-screen sticky top-0 transition-all duration-300 ease-in-out ${
              rightSidebarCollapsed ? 'w-[60px]' : 'w-[280px]'
            }`}
          >
            <WebRightSidebar collapsed={rightSidebarCollapsed} onToggle={toggleRightSidebar} />
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      {!isDesktop && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out safe-bottom ${
            navVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <MobileNavigation onNavItemClick={triggerHapticFeedback} />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
