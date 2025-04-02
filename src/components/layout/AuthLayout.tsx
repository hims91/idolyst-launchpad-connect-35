
import React from "react";
import { Link } from "react-router-dom";
import IdolystLogo from "../shared/IdolystLogo";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backPath = "/auth/login",
  backText = "Back to login"
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with gradient background - visible on md screens and up */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-idolyst-purple to-idolyst-purple-dark text-white p-8 flex-col justify-between">
        <div className="mb-auto">
          <Link to="/" className="block mb-16">
            <IdolystLogo />
          </Link>
          
          <motion.div 
            className="max-w-lg"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-bold mb-6">Welcome to Idolyst</h1>
            <p className="text-xl">
              The professional networking platform designed for entrepreneurs to launch ideas, 
              find mentorship, track growth, and connect with like-minded professionals.
            </p>
          </motion.div>
        </div>
        
        <div className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} Idolyst. All rights reserved.
        </div>
      </div>
      
      {/* Right panel with form content */}
      <div className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col">
        {/* Mobile logo */}
        <div className="md:hidden mb-8">
          <Link to="/" className="block">
            <IdolystLogo />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">{title}</h2>
            <p className="text-idolyst-gray-dark">{subtitle}</p>
          </motion.div>

          {children}
          
          {showBackButton && (
            <div className="mt-8 text-center">
              <Link
                to={backPath}
                className="text-idolyst-purple hover:text-idolyst-purple-dark underline-animation transition-colors"
              >
                {backText}
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile footer */}
        <div className="mt-8 md:hidden text-sm text-center text-idolyst-gray">
          &copy; {new Date().getFullYear()} Idolyst. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
