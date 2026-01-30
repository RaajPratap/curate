import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock, ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice.jsx';

const CheckoutForm = ({ shippingInfo, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setMessage(submitError.message);
        onError(submitError.message);
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
          payment_method_data: {
            billing_details: {
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
              },
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message);
        onError(error.message);
        showError(error.message, 5000);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }),
          },
          body: JSON.stringify({
            orderItems: [],
            shippingAddress: {
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.postalCode,
              country: shippingInfo.country,
            },
            paymentMethod: 'card',
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: shippingInfo.email,
            },
            itemsPrice: paymentIntent.amount / 100,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: paymentIntent.amount / 100,
            isPaid: true,
            paidAt: new Date().toISOString(),
          }),
        });

        const orderData = await response.json();

        if (response.ok) {
          dispatch(clearCart());
          success('Payment successful! Your order has been placed.', 5000);
          onSuccess(orderData._id || orderData.order?._id || 'unknown');
        } else {
          throw new Error(orderData.message || 'Failed to create order');
        }
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setMessage('Additional authentication required. Please complete the verification.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage(err.message || 'An unexpected error occurred');
      onError(err.message || 'Payment processing failed');
      showError(err.message || 'Payment processing failed', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Payment Details</h2>
          <p className="text-sm text-gray-400">Enter your card information securely</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700">
          <PaymentElement
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                  email: shippingInfo.email,
                  phone: shippingInfo.phone,
                  address: {
                    line1: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    postal_code: shippingInfo.postalCode,
                    country: shippingInfo.country,
                  },
                },
              },
            }}
          />
        </div>

        {message && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{message}</p>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shipping
          </button>
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
