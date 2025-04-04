
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { fadeInUp, scaleAnimation } from "@/lib/animations";

import AuthLayout from "@/components/layout/AuthLayout";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import TwoFactorVerification from "@/components/auth/TwoFactorVerification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Loader, Mail, LockKeyhole } from "lucide-react";

type FormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, isAuthenticated, isLoading: authLoading, twoFactorState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || "/";
  
  // Check for registered query param to show welcome toast
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const registered = searchParams.get("registered");
    
    if (registered === "true") {
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account before logging in.",
      });
      
      // Clean up the URL
      navigate("/auth/login", { replace: true });
    }

    // Check for email_verified param
    const emailVerified = searchParams.get("email_verified");
    if (emailVerified === "true") {
      toast({
        title: "Email verified!",
        description: "Your email has been verified. You can now log in.",
      });
      
      // Clean up the URL
      navigate("/auth/login", { replace: true });
    }
  }, [location, navigate]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && !showTwoFactor) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from, showTwoFactor]);

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      } else {
        // Check if 2FA is required
        if (twoFactorState.isEnrolled && twoFactorState.isChallengeRequired) {
          setShowTwoFactor(true);
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back to Idolyst!",
          });
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render two-factor verification if needed
  if (showTwoFactor) {
    return (
      <AuthLayout
        title="Two-Factor Authentication"
        subtitle="Enter the verification code from your authenticator app"
        showBackButton
        backPath="/auth/login"
        backText="Back to login"
      >
        <TwoFactorVerification 
          onVerified={() => {
            toast({
              title: "Login successful",
              description: "Welcome back to Idolyst!",
            });
            navigate(from, { replace: true });
          }}
          onCancel={() => setShowTwoFactor(false)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your account to continue"
      showBackButton
      backPath="/auth/signup"
      backText="Don't have an account? Sign up"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs text-idolyst-purple hover:text-idolyst-purple-dark hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                className="w-full gradient-bg hover-scale"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Log In
              </Button>
            </motion.div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialLoginButtons />
          </form>
        </Form>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
