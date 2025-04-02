
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page is for handling auth redirects (email confirmations, password resets, etc)
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Check for errors in auth state
        if (error) {
          console.error("Auth callback error:", error);
          throw error;
        }

        // Get the hash and type from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get("type");
        
        // Handle different auth redirect types
        switch (type) {
          case "recovery":
            // For password reset flow
            navigate("/auth/reset-password");
            break;
            
          case "signup":
            // For signup confirmation
            toast({
              title: "Email confirmed",
              description: "Your account has been verified successfully. Please log in.",
            });
            navigate("/auth/login");
            break;
            
          case "magiclink":
            // For magic link login
            if (data.session) {
              toast({
                title: "Logged in successfully",
                description: "You have been logged in via magic link.",
              });
              navigate("/");
            }
            break;
            
          default:
            // Default redirect if session exists
            if (data.session) {
              navigate("/");
            } else {
              navigate("/auth/login");
            }
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message || "An error occurred during authentication",
        });
        navigate("/auth/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <Loader className="h-8 w-8 animate-spin text-idolyst-purple mb-4" />
      <h2 className="text-xl font-medium text-gray-700">Processing authentication...</h2>
      <p className="mt-2 text-gray-500">Please wait while we complete the authentication process.</p>
    </div>
  );
};

export default AuthCallback;
