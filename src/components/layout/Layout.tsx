
import { ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileNavigation from "./MobileNavigation";
import WebSidebar from "./WebSidebar";
import MobileHeader from "./MobileHeader";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Add a class to the body to adjust spacing for mobile header
  useEffect(() => {
    document.body.classList.add('has-mobile-header');
    
    return () => {
      document.body.classList.remove('has-mobile-header');
    };
  }, []);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Web Sidebar - hidden on mobile */}
        <WebSidebar />
        
        <div className="flex flex-col flex-1 w-full overflow-x-hidden">
          {/* Mobile Header - visible only on mobile */}
          <MobileHeader />
          
          {/* Main Content - adjusted padding for mobile header */}
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8 mt-12 md:mt-0">
            {children}
          </main>
          
          {/* Mobile Navigation - visible only on mobile */}
          <MobileNavigation />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
