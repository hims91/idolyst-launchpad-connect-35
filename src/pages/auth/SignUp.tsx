
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/validation";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { fadeInUp, scaleAnimation } from "@/lib/animations";

import AuthLayout from "@/components/layout/AuthLayout";
import RoleSelector from "@/components/auth/RoleSelector";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

type FormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      roles: ["entrepreneur"], // Default role
    },
  });

  const { watch } = form;
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Prepare metadata for Supabase auth
      const metadata = {
        username: data.username,
        full_name: data.fullName || "",
        roles: data.roles
      };

      // Sign up user
      const { error } = await signUp(data.email, data.password, metadata);
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "Please check your information and try again",
          variant: "destructive",
        });
      } else {
        // Show success message
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
        // Redirect to login with a query param to show a success message
        navigate("/auth/login?registered=true");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the Idolyst community to connect with mentors and entrepreneurs"
      showBackButton
      backPath="/auth/login"
      backText="Already have an account? Log in"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., johndoe"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your unique username on Idolyst
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-gray-400">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      autoComplete="name"
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm Password</FormLabel>
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

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <RoleSelector
                    selectedRoles={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.roles?.message}
                  />
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
                Sign Up
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </AuthLayout>
  );
};

export default SignUp;
