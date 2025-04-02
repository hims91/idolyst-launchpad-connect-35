
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fadeInUp, scaleAnimation } from "@/lib/animations";

import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user, profile, isAuthenticated, signOut } = useAuth();

  // If authenticated, display the user profile
  if (isAuthenticated && profile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto pb-20 md:pb-0">
          <motion.div 
            className="flex flex-col items-center justify-center py-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Avatar className="h-24 w-24 mb-6">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User"} />
              <AvatarFallback className="bg-idolyst-purple/20 text-idolyst-purple text-xl">
                {profile.username ? profile.username.slice(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-3xl font-bold gradient-text mb-2">{profile.username || "User"}</h1>
            {profile.full_name && (
              <p className="text-lg text-idolyst-gray-dark mb-2">{profile.full_name}</p>
            )}
            
            <div className="flex space-x-4 items-center mb-8">
              <div className="text-center">
                <p className="text-sm text-idolyst-gray">XP</p>
                <p className="text-xl font-medium">{profile.xp}</p>
              </div>
              
              <div className="h-8 w-px bg-gray-200"></div>
              
              <div className="text-center">
                <p className="text-sm text-idolyst-gray">Roles</p>
                <div className="flex space-x-1 mt-1">
                  {profile.roles.map((role) => (
                    <span 
                      key={role.id}
                      className={`text-xs px-2 py-1 rounded-full ${
                        role.role === "entrepreneur" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                      {role.is_verified && " ✓"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-full mb-8">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bio</h2>
              <p className="text-idolyst-gray-dark">
                {profile.bio || "No bio yet. Edit your profile to add one!"}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <motion.div
                variants={scaleAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button className="gradient-bg hover-scale">
                  Edit Profile
                </Button>
              </motion.div>
              
              <motion.div
                variants={scaleAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="outline" 
                  className="hover-scale"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, display login/signup options
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <motion.div 
          className="flex flex-col items-center justify-center py-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="rounded-full bg-idolyst-purple/20 p-6 mb-6">
            <User className="h-12 w-12 text-idolyst-purple" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Profile</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            Manage your profile, track your activity, and connect with other entrepreneurs and mentors.
          </p>
          
          <div className="flex space-x-4">
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                className="gradient-bg hover-scale"
                asChild
              >
                <Link to="/auth/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              variants={scaleAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="outline" 
                className="hover-scale"
                asChild
              >
                <Link to="/auth/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
