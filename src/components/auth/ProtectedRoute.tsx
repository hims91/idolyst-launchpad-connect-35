
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('entrepreneur' | 'mentor' | 'admin')[];  // Updated to include 'admin'
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile, roles } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <Loader className="h-8 w-8 animate-spin text-idolyst-purple mb-4" />
        <p className="text-gray-500">Verifying authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Check for required roles if specified
  if (requiredRoles && requiredRoles.length > 0 && roles) {
    const userRoles = roles.map(r => r.role);
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role as 'entrepreneur' | 'mentor' | 'admin'));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required roles (if any), render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
