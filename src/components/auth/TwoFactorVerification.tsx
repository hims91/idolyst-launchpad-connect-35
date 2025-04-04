
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { fadeInUp, scaleAnimation } from '@/lib/animations';

interface TwoFactorVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ onVerified, onCancel }) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { twoFactorState, verifyTwoFactorLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length < 6) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    if (!twoFactorState.currentFactorId) {
      toast({
        title: "Authentication Error",
        description: "Two-factor authentication not properly initialized",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await verifyTwoFactorLogin(twoFactorState.currentFactorId, code);
      
      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      } else if (success) {
        onVerified();
      }
    } catch (error: any) {
      console.error('Two-factor verification error:', error);
      toast({
        title: "Verification Error",
        description: error.message || "An error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-idolyst-purple to-idolyst-purple-dark rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="otp-code" className="block text-sm font-medium">
            Verification Code
          </label>
          <Input
            id="otp-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
            className="text-center text-xl tracking-widest"
            required
            autoComplete="one-time-code"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        
        <div className="space-y-3">
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
              Verify
            </Button>
          </motion.div>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Back to Login
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TwoFactorVerification;
