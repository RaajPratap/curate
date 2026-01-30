import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from './StripeProvider.jsx';
import ShippingForm from './ShippingForm.jsx';
import CheckoutForm from './CheckoutForm.jsx';
import OrderSummary from './OrderSummary.jsx';
import { Loader2, Lock, Shield, Truck, CreditCard } from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { stripe, loading: stripeLoading, error: stripeError } = useStripeContext();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      showError('Your cart is empty. Add items before checkout.', 3000);
      navigate('/shop');
    }
  }, [items, navigate, showError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setShippingInfo((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
      }));
    }
  }, [isAuthenticated, user]);

  const handleShippingSubmit = async (shippingData) => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          currency: 'inr',
          shipping: shippingData,
          items: items.map((item) => ({
            id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      setClientSecret(data.clientSecret);
      setShippingInfo(shippingData);
      setCurrentStep(2);
      success('Shipping information saved. Proceed to payment.', 3000);
    } catch (err) {
      showError(err.message || 'Failed to process shipping information', 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId) => {
    navigate(`/checkout/confirmation?orderId=${orderId}`);
  };

  const handlePaymentError = (message) => {
    showError(message || 'Payment failed. Please try again.', 5000);
  };

  const steps = [
    { number: 1, label: 'Shipping', icon: Truck },
    { number: 2, label: 'Payment', icon: CreditCard },
    { number: 3, label: 'Confirmation', icon: Shield },
  ];

  if (stripeLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white">Loading payment system...</p>
        </div>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment System Error</h2>
          <p className="text-gray-400 mb-6">{stripeError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 sm:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-white text-zinc-900'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-zinc-800 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-zinc-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <ShippingForm
                initialData={shippingInfo}
                onSubmit={handleShippingSubmit}
                loading={loading}
              />
            )}

            {currentStep === 2 && stripe && clientSecret && (
              <Elements stripe={stripe} options={{ clientSecret }}>
                <CheckoutForm
                  shippingInfo={shippingInfo}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              totalAmount={totalAmount}
              shippingCost={currentStep > 1 ? 0 : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
