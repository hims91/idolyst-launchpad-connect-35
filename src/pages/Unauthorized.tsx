
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, scaleAnimation } from "@/lib/animations";
import { Shield, ArrowLeft } from "lucide-react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <motion.div 
          className="flex flex-col items-center justify-center py-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="rounded-full bg-amber-100 p-6 mb-6">
            <Shield className="h-12 w-12 text-amber-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-lg text-idolyst-gray-dark mb-8 max-w-md">
            You don't have permission to access this page. This area requires specific user roles or permissions.
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
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
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
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
