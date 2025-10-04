import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxConsultations: number;
  maxPrescriptions: number;
  prioritySupport: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPlans: (plans: SubscriptionPlan[]) => void;
  setCurrentSubscription: (subscription: UserSubscription | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Subscription management
  subscribeToPlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  renewSubscription: () => Promise<void>;
  
  // Usage tracking
  getRemainingConsultations: () => number;
  getRemainingPrescriptions: () => number;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      '5 consultations per month',
      'Basic prescription management',
      'Email support',
      'Medical records access'
    ],
    maxConsultations: 5,
    maxPrescriptions: 10,
    prioritySupport: false,
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited consultations',
      'Advanced prescription management',
      'Priority support',
      'Full medical records',
      'Video consultations',
      'Family member management'
    ],
    maxConsultations: -1, // Unlimited
    maxPrescriptions: -1, // Unlimited
    prioritySupport: true,
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 39.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 5 family members',
      'Unlimited consultations',
      'Advanced prescription management',
      'Priority support',
      'Full medical records',
      'Video consultations',
      'Family health dashboard'
    ],
    maxConsultations: -1,
    maxPrescriptions: -1,
    prioritySupport: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 79.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 20 family members',
      'Unlimited consultations',
      'Advanced prescription management',
      '24/7 priority support',
      'Full medical records',
      'Video consultations',
      'Enterprise health dashboard',
      'Custom integrations',
      'Dedicated account manager'
    ],
    maxConsultations: -1,
    maxPrescriptions: -1,
    prioritySupport: true,
  },
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: defaultPlans,
      currentSubscription: null,
      isLoading: false,
      error: null,

      setPlans: (plans) => set({ plans }),
      setCurrentSubscription: (subscription) => set({ currentSubscription: subscription }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      subscribeToPlan: async (planId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would call your backend API
          const plan = get().plans.find(p => p.id === planId);
          if (!plan) {
            throw new Error('Plan not found');
          }

          const subscription: UserSubscription = {
            id: `sub_${Date.now()}`,
            planId,
            status: 'pending',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            autoRenew: true,
          };

          set({ currentSubscription: subscription });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Subscription failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      cancelSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          const subscription = get().currentSubscription;
          if (!subscription) {
            throw new Error('No active subscription');
          }

          const updatedSubscription: UserSubscription = {
            ...subscription,
            status: 'canceled',
            autoRenew: false,
          };

          set({ currentSubscription: updatedSubscription });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Cancellation failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      renewSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          const subscription = get().currentSubscription;
          if (!subscription) {
            throw new Error('No subscription to renew');
          }

          const updatedSubscription: UserSubscription = {
            ...subscription,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            autoRenew: true,
          };

          set({ currentSubscription: updatedSubscription });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Renewal failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      getRemainingConsultations: () => {
        const subscription = get().currentSubscription;
        if (!subscription || subscription.status !== 'active') {
          return 0;
        }

        const plan = get().plans.find(p => p.id === subscription.planId);
        if (!plan) return 0;

        return plan.maxConsultations === -1 ? Infinity : plan.maxConsultations;
      },

      getRemainingPrescriptions: () => {
        const subscription = get().currentSubscription;
        if (!subscription || subscription.status !== 'active') {
          return 0;
        }

        const plan = get().plans.find(p => p.id === subscription.planId);
        if (!plan) return 0;

        return plan.maxPrescriptions === -1 ? Infinity : plan.maxPrescriptions;
      },
    }),
    {
      name: 'subscription-storage',
    }
  )
);