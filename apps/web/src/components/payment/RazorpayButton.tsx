'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  orderId: string
  amount: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  onSuccess: (response: PaymentResponse) => void
  onError: (error: any) => void
  disabled?: boolean
}

interface PaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export function RazorpayButton({
  orderId,
  amount,
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
  disabled = false,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => setScriptLoaded(true)
      script.onerror = () => {
        console.error('Failed to load Razorpay script')
        onError(new Error('Failed to load payment gateway'))
      }
      document.body.appendChild(script)
    } else {
      setScriptLoaded(true)
    }
  }, [onError])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      onError(new Error('Payment gateway not loaded'))
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const response = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order')
      }

      const { razorpayOrderId, keyId } = data.data

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'CURATE',
        description: `Order #${orderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone || '',
        },
        notes: {
          orderId,
          orderNumber,
        },
        theme: {
          color: '#CCFF00',
          backdrop_color: 'rgba(0, 0, 0, 0.8)',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
        handler: async (response: PaymentResponse) => {
          // Verify payment on server
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...response,
                orderId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              onSuccess(response)
            } else {
              onError(new Error(verifyData.message || 'Payment verification failed'))
            }
          } catch (error) {
            onError(error)
          } finally {
            setLoading(false)
          }
        },
      }

      const razorpay = new window.Razorpay(options)
      
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false)
        onError(new Error(response.error.description || 'Payment failed'))
      })

      razorpay.open()
    } catch (error) {
      setLoading(false)
      onError(error)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !scriptLoaded}
      className="w-full"
      size="lg"
    >
      {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
    </Button>
  )
}
