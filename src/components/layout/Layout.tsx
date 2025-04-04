
import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import WebSidebar from './WebSidebar';
import WebRightSidebar from './WebRightSidebar';
import MobileNavigation from './MobileNavigation';
import MobileHeader from './MobileHeader';
import { useAuth } from '@/hooks/useAuth';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-idolyst-bg">
      <Helmet>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Helmet>
      
      {/* Desktop Sidebar */}
      <WebSidebar />
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <motion.main 
        className="flex-1 md:ml-60 mt-12 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children || <Outlet />}
      </motion.main>
      
      {/* Web-only Right Sidebar */}
      <WebRightSidebar />
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;
