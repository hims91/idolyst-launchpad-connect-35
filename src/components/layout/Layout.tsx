
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileNavigation from "./MobileNavigation";
import WebSidebar from "./WebSidebar";
import MobileHeader from "./MobileHeader";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Web Sidebar - hidden on mobile */}
        <WebSidebar />
        
        <div className="flex flex-col flex-1 w-full overflow-x-hidden">
          {/* Mobile Header - visible only on mobile */}
          <MobileHeader />
          
          {/* Main Content */}
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
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
