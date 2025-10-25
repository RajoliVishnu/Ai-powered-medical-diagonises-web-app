import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Download, Calendar, User, Phone, Mail, Shield } from 'lucide-react';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'inr',
  description = 'Payment',
  onSuccess,
  onError,
  customerInfo
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string>('');

  useEffect(() => {
    // Load saved payment methods
    loadSavedPaymentMethods();
  }, []);

  const loadSavedPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/methods', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      let paymentIntent;

      if (selectedSavedMethod) {
        // Use saved payment method
        paymentIntent = await stripe.confirmPayment({
          payment_method: selectedSavedMethod,
          confirm: true,
          return_url: window.location.origin + '/payment-success'
        });
      } else {
        // Use new payment method
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
          await createPaymentIntent(),
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: customerInfo?.name || '',
                email: customerInfo?.email || '',
                phone: customerInfo?.phone || '',
              },
            },
          }
        );

        if (error) {
          throw new Error(error.message);
        }

        paymentIntent = confirmedPaymentIntent;
      }

      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        onSuccess?.(paymentIntent);
        
        // Save payment method if requested
        if (!selectedSavedMethod && paymentMethod === 'card') {
          await savePaymentMethod(paymentIntent.payment_method);
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      onError?.(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const createPaymentIntent = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: currency,
        description: description,
        payment_method_types: ['card', 'upi'],
        metadata: {
          customer_name: customerInfo?.name,
          customer_email: customerInfo?.email,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data.clientSecret;
  };

  const savePaymentMethod = async (paymentMethodId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/payments/save-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method_id: paymentMethodId,
          set_as_default: savedPaymentMethods.length === 0
        })
      });

      // Reload saved payment methods
      await loadSavedPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
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
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your payment has been processed successfully.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Amount */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              ₹{amount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            title="Payment Error" 
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Saved Payment Methods */}
        {savedPaymentMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Saved Payment Methods
            </h3>
            <div className="space-y-2">
              {savedPaymentMethods.map((method) => (
                <label key={method.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedSavedMethod === method.id}
                    onChange={(e) => setSelectedSavedMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {method.card?.brand.toUpperCase()} •••• {method.card?.last4}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Expires {method.card?.exp_month}/{method.card?.exp_year}
                      {method.isDefault && ' • Default'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="mt-3">
              <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value=""
                  checked={selectedSavedMethod === ''}
                  onChange={(e) => setSelectedSavedMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900 dark:text-white">Use new payment method</span>
              </label>
            </div>
          </div>
        )}

        {/* New Payment Method */}
        {selectedSavedMethod === '' && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Payment Method
            </h3>
            
            {/* Payment Method Type Selection */}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <CreditCard className="h-4 w-4 inline mr-2" />
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                UPI
              </button>
            </div>

            {/* Card Element */}
            {paymentMethod === 'card' && (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <CardElement options={cardElementOptions} />
              </div>
            )}

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    UPI Payment will be processed through your preferred UPI app
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm">
                      Google Pay
                    </button>
                    <button type="button" className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm">
                      PhonePe
                    </button>
                    <button type="button" className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm">
                      Paytm
                    </button>
                    <button type="button" className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm">
                      BHIM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Lock className="h-4 w-4 mr-2" />
          Your payment information is secure and encrypted
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay ₹{amount.toLocaleString()}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const EnhancedPaymentPage: React.FC = () => {
  const [amount, setAmount] = useState(2999);
  const [description, setDescription] = useState('Premium Plan Subscription');
  const [customerInfo, setCustomerInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210'
  });

  const elementsOptions: StripeElementsOptions = {
    mode: 'payment',
    amount: amount * 100,
    currency: 'inr',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    // Handle successful payment
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Handle payment error
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your payment securely with our encrypted payment system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm
                amount={amount}
                description={description}
                customerInfo={customerInfo}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Premium Plan</span>
                <span className="font-medium text-gray-900 dark:text-white">₹2,999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                <span className="font-medium text-gray-900 dark:text-white">₹540</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">₹3,539</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{customerInfo.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{customerInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{customerInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Security Features
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Fraud protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPaymentPage;
