
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useAuth } from "@/hooks/useAuth";

const Ascend = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-0 text-center">
        <motion.div 
          className="flex flex-col items-center justify-center py-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 mb-6">
            <Trophy className="h-12 w-12 text-indigo-600" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Ascend</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Level up your entrepreneurial journey with XP, badges, and rewards. Compete with others and unlock special perks.
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <Button 
                className="gradient-bg hover-scale text-lg py-6 px-8 w-full md:w-auto"
                onClick={() => navigate('/ascend/dashboard')}
              >
                <Zap className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
              
              <Button 
                variant="outline"
                className="hover-scale text-lg py-6 px-8 w-full md:w-auto"
                onClick={() => navigate('/ascend/leaderboard')}
              >
                <Crown className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </div>
          ) : (
            <Button 
              className="gradient-bg hover-scale text-lg py-6 px-8"
              onClick={() => navigate('/auth/login')}
            >
              <Zap className="mr-2 h-5 w-5" />
              Sign In to Access Ascend
            </Button>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Ascend;
