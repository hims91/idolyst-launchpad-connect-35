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
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
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
import { Loader, Mail, LockKeyhole, User, UserCheck } from "lucide-react";

type FormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState(["entrepreneur"]);

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
      roles: ["entrepreneur"],
    },
  });

  const { watch, formState: { errors } } = form;
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const metadata = {
        username: data.username,
        full_name: data.fullName || "",
        roles: data.roles,
        byline: ""
      };

      const { error } = await signUp(data.email, data.password, metadata);
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "Please check your information and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
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
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        placeholder="e.g., johndoe"
                        autoComplete="username"
                        className="pl-10"
                        {...field}
                      />
                    </div>
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-gray-400">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
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
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
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
              name="roles"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <RoleSelector
                    selectedRoles={roles}
                    onChange={setRoles}
                    error={errors.roles?.message}
                    includeAdmin={false}
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

export default SignUp;
