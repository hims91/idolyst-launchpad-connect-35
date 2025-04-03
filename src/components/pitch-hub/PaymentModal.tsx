
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Mail } from "lucide-react";
import { createPremiumPayment } from '@/api/pitch';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchId: string;
  onSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, pitchId, onSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'razorpay'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, we would integrate with PayPal or Razorpay here
      const payment = await createPremiumPayment(pitchId, 5, paymentMethod);
      
      if (payment) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="gradient-text">Boost Your Pitch</DialogTitle>
          <DialogDescription>
            Increase your pitch visibility with premium placement for just $5
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Premium Features:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Featured placement on the PitchHub homepage</li>
                <li>Highlighted in the Launchpad trending section</li>
                <li>Priority visibility to mentors</li>
                <li>Premium badge on your pitch</li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Select Payment Method:</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'paypal' | 'razorpay')}
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    PayPal
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted mt-2">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                    Razorpay
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Service fee:</span>
                <span className="text-sm">$5.00</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>$5.00 USD</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            className="gradient-bg hover-scale"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
