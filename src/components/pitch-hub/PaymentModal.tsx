
import React, { useState } from 'react';
import { Check, CreditCard, DollarSign, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPremiumPayment } from '@/api/pitch';
import { toast } from '@/hooks/use-toast';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pitchId: string;
  onSuccess: () => void;
  amount?: number;
}

const PaymentModal = ({ 
  open, 
  onOpenChange, 
  pitchId, 
  onSuccess,
  amount = 5 
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'paypal'>('razorpay');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2');
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  const handlePayment = async () => {
    // Simple validation
    if (!formData.name || !formData.email || 
        !formData.cardNumber || !formData.expiry || !formData.cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, you would integrate with the payment gateway here
      // For this demo, we'll simulate a successful payment
      const payment = await createPremiumPayment(pitchId, amount, paymentMethod);
      
      if (payment) {
        toast({
          title: "Payment successful!",
          description: "Your pitch has been boosted for premium visibility",
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Boost Your Pitch</DialogTitle>
          <DialogDescription className="text-center">
            Get premium visibility for your idea across the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Payment method selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                paymentMethod === 'razorpay' 
                  ? 'border-idolyst-purple bg-idolyst-purple/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('razorpay')}
            >
              <div className={`p-2 rounded-full mb-2 ${
                paymentMethod === 'razorpay' ? 'bg-idolyst-purple text-white' : 'bg-gray-100'
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Credit Card</span>
            </button>
            
            <button
              type="button"
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                paymentMethod === 'paypal' 
                  ? 'border-idolyst-purple bg-idolyst-purple/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className={`p-2 rounded-full mb-2 ${
                paymentMethod === 'paypal' ? 'bg-idolyst-purple text-white' : 'bg-gray-100'
              }`}>
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">PayPal</span>
            </button>
          </div>
          
          {/* Payment details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber" 
                name="cardNumber" 
                placeholder="4242 4242 4242 4242" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={19} // 16 digits + 3 spaces
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input 
                  id="expiry" 
                  name="expiry" 
                  placeholder="MM/YY" 
                  value={formData.expiry}
                  onChange={handleInputChange}
                  maxLength={5} // MM/YY
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">Security Code</Label>
                <Input 
                  id="cvv" 
                  name="cvv" 
                  placeholder="123" 
                  type="password"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={4} // 3-4 digits
                />
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">Premium Boost</div>
            <div className="text-sm font-bold">${amount.toFixed(2)}</div>
          </div>
          
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Lock className="h-3 w-3 mr-1" />
            Your payment information is secured with encryption
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="gradient-bg"
          >
            {isProcessing ? 'Processing...' : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
