import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
  };
}

interface PaymentResult {
  status: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
}

interface PaymentContextType {
  loading: boolean;
  createPaymentIntent: (amount: number, currency: string) => Promise<PaymentIntent>;
  confirmPayment: (paymentMethod: PaymentMethod) => Promise<PaymentResult>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async (amount: number, currency: string): Promise<PaymentIntent> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'requires_payment_method'
      };
      
      return paymentIntent;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentMethod: PaymentMethod): Promise<PaymentResult> => {
    setLoading(true);
    try {
      // Simulate payment confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: PaymentResult = {
        status: 'succeeded',
        transactionId: `txn_${Date.now()}`,
        amount: 0, // This would come from the actual payment
        currency: 'USD'
      };
      
      console.log('Payment confirmed with method:', paymentMethod.id);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const value: PaymentContextType = {
    loading,
    createPaymentIntent,
    confirmPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}; 