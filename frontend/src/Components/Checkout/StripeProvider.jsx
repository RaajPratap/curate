import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';

const StripeContext = createContext(null);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext must be used within StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        if (STRIPE_PUBLIC_KEY === 'pk_test_placeholder') {
          console.warn('Stripe public key not configured. Using placeholder.');
        }
        
        const stripeInstance = await loadStripe(STRIPE_PUBLIC_KEY);
        
        if (!stripeInstance) {
          throw new Error('Failed to initialize Stripe');
        }
        
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err) {
        console.error('Stripe initialization error:', err);
        setError(err.message || 'Failed to load payment system');
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  const value = {
    stripe,
    loading,
    error,
    isReady: !!stripe && !loading,
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

export default StripeProvider;
