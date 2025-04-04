
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader, Info, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fadeInUp, scaleAnimation } from '@/lib/animations';

interface TwoFactorSetupProps {
  onSetupComplete?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSetupComplete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{
    qrCode: string | null;
    secret: string | null;
    factorId: string | null;
  }>({
    qrCode: null,
    secret: null,
    factorId: null
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'init' | 'verify' | 'complete'>('init');
  const { setupTwoFactor, verifyTwoFactorSetup, twoFactorState } = useAuth();

  const handleSetupStart = async () => {
    setIsLoading(true);
    
    try {
      const { qrCode, secret, error } = await setupTwoFactor();
      
      if (error) throw error;
      
      if (qrCode && secret) {
        setSetupData({ 
          qrCode, 
          secret,
          factorId: qrCode.split('factor_id=')[1]?.split('&')[0] || null
        });
        setStep('verify');
      } else {
        throw new Error('Failed to generate 2FA setup data');
      }
    } catch (error: any) {
      console.error('Two-factor setup error:', error);
      toast({
        title: "Setup Error",
        description: error.message || "An error occurred during two-factor setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!setupData.factorId) {
      toast({
        title: "Setup Error",
        description: "Missing factor ID, please try again",
        variant: "destructive",
      });
      return;
    }
    
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await verifyTwoFactorSetup(setupData.factorId, verificationCode);
      
      if (error) throw error;
      
      if (success) {
        toast({
          title: "Setup Complete",
          description: "Two-factor authentication is now enabled for your account",
        });
        setStep('complete');
        if (onSetupComplete) {
          onSetupComplete();
        }
      }
    } catch (error: any) {
      console.error('Two-factor verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={twoFactorState.isEnrolled ? "outline" : "default"}
          size="sm"
          className={twoFactorState.isEnrolled ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200" : ""}
        >
          {twoFactorState.isEnrolled ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-700" />
              2FA Enabled
            </>
          ) : (
            "Enable Two-Factor Auth"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {twoFactorState.isEnrolled 
              ? "Two-factor authentication is currently enabled for your account." 
              : "Secure your account with two-factor authentication"}
          </DialogDescription>
        </DialogHeader>
        
        {twoFactorState.isEnrolled ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Protection Enabled</h4>
              <p className="text-sm text-green-700">
                Your account is protected with two-factor authentication. You will need to enter a verification code each time you log in.
              </p>
            </div>
          </div>
        ) : (
          <>
            {step === 'init' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-4"
              >
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">How it works</h4>
                    <p className="text-sm text-amber-700">
                      Two-factor authentication adds an extra layer of security to your account. After setup, you'll need an authentication app like Google Authenticator or Authy to generate verification codes when logging in.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSetupStart} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Get Started
                </Button>
              </motion.div>
            )}
            
            {step === 'verify' && setupData.qrCode && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="border border-gray-200 rounded-md p-2 bg-white">
                      <img 
                        src={setupData.qrCode} 
                        alt="QR Code for Two-Factor Authentication" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Manual entry code</h4>
                    <div className="bg-gray-100 p-2 rounded text-center font-mono text-sm">
                      {setupData.secret}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="verification-code" className="block text-sm font-medium">
                      Verification Code
                    </label>
                    <Input
                      id="verification-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                      className="text-center text-xl tracking-widest"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleVerify} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Verify & Enable
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Scan the QR code with your authenticator app, then enter the verification code.
                  </p>
                </div>
              </motion.div>
            )}
            
            {step === 'complete' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-4"
              >
                <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800">Setup Complete</h4>
                    <p className="text-sm text-green-700">
                      Two-factor authentication has been successfully enabled for your account. You'll need to enter a verification code each time you log in.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorSetup;
