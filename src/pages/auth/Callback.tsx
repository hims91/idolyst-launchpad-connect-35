
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // This page is for handling auth redirects (email confirmations, password resets, OAuth callbacks, etc)
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        // Check for errors in auth state
        if (error) {
          console.error("Auth callback error:", error);
          setStatus('error');
          setErrorMessage(error.message);
          throw error;
        }

        // Get the hash and type from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get("type") || searchParams.get("type");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        // If we have tokens in the URL, exchange them for a session
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            setStatus('error');
            setErrorMessage(sessionError.message);
            throw sessionError;
          }
        }
        
        // Refresh the session data after potential token exchange
        const { data: refreshedData } = await supabase.auth.getSession();
        
        // Handle different auth redirect types
        switch (type) {
          case "recovery":
            // For password reset flow
            setStatus('success');
            setTimeout(() => {
              navigate("/auth/reset-password");
            }, 1500);
            break;
            
          case "signup":
          case "signup_email_confirmed":
            // For signup confirmation
            setStatus('success');
            toast({
              title: "Email confirmed",
              description: "Your account has been verified successfully. Please log in.",
            });
            setTimeout(() => {
              navigate("/auth/login?email_verified=true");
            }, 1500);
            break;
            
          case "magiclink":
          case "email_signin":
            // For magic link login
            if (refreshedData.session) {
              setStatus('success');
              toast({
                title: "Logged in successfully",
                description: "You have been logged in via email link.",
              });
              setTimeout(() => {
                navigate("/");
              }, 1500);
            }
            break;
  
          case "oauth":
            // For OAuth sign-in
            if (refreshedData.session) {
              setStatus('success');
              toast({
                title: "Logged in successfully",
                description: `You have been logged in via ${refreshedData.session.user.app_metadata.provider || 'social login'}.`,
              });
              setTimeout(() => {
                navigate("/");
              }, 1500);
            }
            break;
            
          default:
            // Default redirect if session exists
            if (refreshedData.session) {
              setStatus('success');
              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              setStatus('error');
              setErrorMessage("Authentication process could not be completed");
              setTimeout(() => {
                navigate("/auth/login");
              }, 3000);
            }
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setStatus('error');
        setErrorMessage(error.message || "An error occurred during authentication");
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message || "An error occurred during authentication",
        });
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      {status === 'loading' && (
        <>
          <Loader className="h-12 w-12 animate-spin text-idolyst-purple mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 text-center">Processing authentication...</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">Please wait while we complete the authentication process.</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 text-center">Authentication successful!</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">You will be redirected in a moment...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 text-center">Authentication failed</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-md">{errorMessage || "There was a problem with the authentication process."}</p>
          <Button 
            onClick={() => navigate('/auth/login')} 
            className="mt-6"
          >
            Return to Login
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthCallback;
