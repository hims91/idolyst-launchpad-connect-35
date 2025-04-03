
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { fadeInUp, scaleAnimation } from "@/lib/animations";

import AuthLayout from "@/components/layout/AuthLayout";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
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
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

type FormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  
  // Check if the reset token is valid
  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // This will return true if there's a valid access token from the URL
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          setIsTokenValid(false);
          toast({
            variant: "destructive",
            title: "Invalid or expired token",
            description: "This password reset link is invalid or has expired. Please request a new one.",
          });
        } else if (data?.user) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setIsTokenValid(false);
      }
    };
    
    checkResetToken();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(data.password);
      
      if (!error) {
        toast({
          title: "Password updated successfully",
          description: "You can now log in with your new password.",
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      }
    } catch (error) {
      // Error is handled in the updatePassword function
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTokenValid === false) {
    return (
      <AuthLayout
        title="Reset link expired"
        subtitle="This password reset link is invalid or has expired"
        showBackButton
        backPath="/auth/forgot-password"
        backText="Request a new reset link"
      >
        <div className="text-center p-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-amber-500 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-gray-600">
            Your password reset link has expired or is invalid. Please request a new one.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Enter a new secure password for your account"
      showBackButton
      backPath="/auth/login"
      backText="Back to login"
    >
      {isTokenValid === null ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-idolyst-purple" />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <PasswordStrengthMeter password={password} className="mt-2" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                  Reset Password
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
