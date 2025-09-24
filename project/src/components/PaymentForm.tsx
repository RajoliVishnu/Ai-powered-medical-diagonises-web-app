import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../contexts/PaymentContext';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  planId: string;
  onSuccess?: (paymentResult: PaymentResult) => void;
  onError?: (error: string) => void;
}

interface PaymentResult {
  status: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'USD',
  planId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment, loading } = usePayment();
  const { subscribeToPlan } = useSubscriptionStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError('Stripe has not loaded yet. Please wait.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      await createPaymentIntent(amount * 100, currency); // Convert to cents

      // Get payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Confirm payment
      const paymentResult = await confirmPayment(paymentMethod);
      
      if (paymentResult.status === 'succeeded') {
        // Subscribe to plan
        await subscribeToPlan(planId);
        
        setPaymentSuccess(true);
        toast.success('Payment successful! Your subscription is now active.');
        
        // Show transaction history after successful payment
        setShowTransactionHistory(true);
        
        if (onSuccess) {
          onSuccess(paymentResult);
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentError(errorMessage);
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600">
            Your subscription has been activated. You can now access all the features of your plan.
          </p>
        </div>

        {/* Transaction History Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            Recent Transaction
          </h4>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Transaction ID:</span>
                <p className="font-medium text-gray-900">TXN-{Date.now().toString().slice(-8)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date:</span>
                <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Amount:</span>
                <p className="font-medium text-gray-900 text-green-600">${amount.toFixed(2)} {currency}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-500">Plan:</span>
              <p className="font-medium text-gray-900">{planId.charAt(0).toUpperCase() + planId.slice(1)} Plan</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowTransactionHistory(true)}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            View Full Transaction History
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Full Transaction History */}
        {showTransactionHistory && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Transaction History</h4>
              <button
                onClick={() => setShowTransactionHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Transaction */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h5 className="font-medium text-green-900">Subscription Payment</h5>
                      <p className="text-sm text-green-700">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-900">${amount.toFixed(2)}</p>
                    <span className="text-sm text-green-600">Completed</span>
                  </div>
                </div>
              </div>

              {/* Sample Previous Transactions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <h5 className="font-medium text-gray-900">Previous Subscription</h5>
                      <p className="text-sm text-gray-600">{new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$29.99</p>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <h5 className="font-medium text-gray-900">Initial Setup</h5>
                      <p className="text-sm text-gray-600">{new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$19.99</p>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Complete History in Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center mb-6">
        <Lock className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${amount.toFixed(2)} {currency}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {paymentError && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{paymentError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing || loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing || loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ${amount.toFixed(2)}
            </div>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm; 