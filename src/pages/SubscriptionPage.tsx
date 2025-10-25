import React, { useState } from 'react';
import { useSubscriptionStore, SubscriptionPlan } from '../stores/subscriptionStore';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import { Check, Star, Users, Shield, Zap, Building2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const SubscriptionPage: React.FC = () => {
  const { plans, currentSubscription, subscribeToPlan, cancelSubscription } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowPayment(false);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'premium':
        return <Star className="w-6 h-6 text-yellow-500" />;
      case 'family':
        return <Users className="w-6 h-6 text-green-600" />;
      case 'enterprise':
        return <Building2 className="w-6 h-6 text-purple-600" />;
      default:
        return <Zap className="w-6 h-6 text-purple-600" />;
    }
  };

  const getCurrentPlanStatus = () => {
    if (!currentSubscription) return null;

    const plan = plans.find(p => p.id === currentSubscription.planId);
    if (!plan) return null;

    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Plan: {plan.name}
            </h3>
            <p className="text-gray-600">
              Status: <span className={`font-medium ${currentSubscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
            </p>
          </div>
          {currentSubscription.status === 'active' && (
            <button
              onClick={cancelSubscription}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your healthcare needs. All plans include secure payment processing and 24/7 support.
          </p>
        </div>

        {getCurrentPlanStatus()}

        {showPayment && selectedPlan ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Subscription
                </h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Plan Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>{selectedPlan.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>${selectedPlan.price}/{selectedPlan.interval}</span>
                    </div>
                    {selectedPlan.maxConsultations === -1 ? (
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>Unlimited consultations</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>{selectedPlan.maxConsultations} consultations/month</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={selectedPlan.price}
                      currency={selectedPlan.currency}
                      planId={selectedPlan.id}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg p-4 border-2 transition-all duration-200 hover:shadow-xl ${
                  plan.id === 'premium' ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.id === 'premium' && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="flex justify-center mb-3">
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {plan.interval}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    plan.id === 'premium'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {currentSubscription?.planId === plan.id ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-gray-600">
                Your health information is protected with bank-level encryption and HIPAA compliance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h4>
              <p className="text-gray-600">
                Get medical consultations and prescriptions within minutes, 24/7.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert Care</h4>
              <p className="text-gray-600">
                Connect with licensed healthcare professionals and specialists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage; 