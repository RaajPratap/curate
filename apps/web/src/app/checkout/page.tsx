'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Card, CardContent, Badge, Input } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartCarbonFootprint,
  clearCart,
} from '@/store/slices/cartSlice'
import { formatPrice } from '@/lib/utils'

type CheckoutStep = 'information' | 'shipping' | 'payment'

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment: string
  city: string
  state: string
  pincode: string
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  carbonNeutral: boolean
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Carbon neutral delivery',
    price: 199,
    estimatedDays: '5-7 business days',
    carbonNeutral: true,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Fast delivery with carbon offset',
    price: 399,
    estimatedDays: '2-3 business days',
    carbonNeutral: true,
  },
  {
    id: 'free',
    name: 'Eco Shipping',
    description: 'Free on orders over ₹2,999',
    price: 0,
    estimatedDays: '7-10 business days',
    carbonNeutral: true,
  },
]

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)
  const carbonFootprint = useAppSelector(selectCartCarbonFootprint)

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information')
  const [isProcessing, setIsProcessing] = useState(false)

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [selectedShipping, setSelectedShipping] = useState<string>('standard')
  const [selectedPayment, setSelectedPayment] = useState<string>('card')
  const [saveInfo, setSaveInfo] = useState(true)

  const shippingCost = cartTotal >= 2999 
    ? 0 
    : shippingMethods.find(m => m.id === selectedShipping)?.price || 199
  const total = cartTotal + shippingCost

  const steps: { id: CheckoutStep; label: string; number: number }[] = [
    { id: 'information', label: 'Information', number: 1 },
    { id: 'shipping', label: 'Shipping', number: 2 },
    { id: 'payment', label: 'Payment', number: 3 },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const validateInformation = () => {
    return (
      address.firstName &&
      address.lastName &&
      address.email &&
      address.phone &&
      address.address &&
      address.city &&
      address.state &&
      address.pincode
    )
  }

  const handleContinue = () => {
    if (currentStep === 'information' && validateInformation()) {
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment')
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    dispatch(clearCart())
    router.push('/order/CUR-2026-' + Math.random().toString().slice(2, 8))
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen">
        <Header cartCount={0} />
        <section className="py-24">
          <Container>
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold tracking-tighter mb-4">
                YOUR CART IS EMPTY
              </h1>
              <p className="font-mono text-foreground-muted mb-8">
                Add some items to checkout
              </p>
              <Link href="/shop">
                <Button variant="brutal">Continue Shopping</Button>
              </Link>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      <section className="py-12">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-sm">
              <li>
                <Link href="/cart" className="text-foreground-muted hover:text-accent transition-colors">
                  Cart
                </Link>
              </li>
              <li className="text-foreground-muted">/</li>
              <li className="text-accent">Checkout</li>
            </ol>
          </nav>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.id === 'information') setCurrentStep('information')
                    else if (step.id === 'shipping' && validateInformation()) setCurrentStep('shipping')
                    else if (step.id === 'payment' && validateInformation()) setCurrentStep('payment')
                  }}
                  className={`flex items-center gap-2 ${
                    currentStep === step.id ? 'text-accent' : 'text-foreground-muted'
                  }`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center font-mono text-sm border ${
                      currentStep === step.id
                        ? 'border-accent bg-accent text-black'
                        : steps.findIndex((s) => s.id === currentStep) > index
                        ? 'border-accent text-accent'
                        : 'border-border'
                    }`}
                  >
                    {steps.findIndex((s) => s.id === currentStep) > index ? '✓' : step.number}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-wider hidden sm:inline">
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-8 sm:w-16 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-12">
            {/* Main Content */}
            <div>
              {/* Information Step */}
              {currentStep === 'information' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tighter mb-6">
                      CONTACT INFORMATION
                    </h2>
                    <div className="space-y-4">
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={address.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                      <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={address.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tighter mb-6">
                      SHIPPING ADDRESS
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          name="firstName"
                          value={address.firstName}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          label="Last Name"
                          name="lastName"
                          value={address.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Input
                        label="Address"
                        name="address"
                        value={address.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        required
                      />
                      <Input
                        label="Apartment, suite, etc. (optional)"
                        name="apartment"
                        value={address.apartment}
                        onChange={handleInputChange}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="City"
                          name="city"
                          value={address.city}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          label="State"
                          name="state"
                          value={address.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Input
                        label="PIN Code"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="font-mono text-sm">Save this information for next time</span>
                  </label>

                  <div className="flex justify-between items-center pt-4">
                    <Link
                      href="/cart"
                      className="font-mono text-sm text-foreground-muted hover:text-accent transition-colors"
                    >
                      ← Return to cart
                    </Link>
                    <Button
                      variant="brutal"
                      onClick={handleContinue}
                      disabled={!validateInformation()}
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              )}

              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <div className="space-y-8">
                  <div className="border border-border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm text-foreground-muted">Contact</span>
                      <span className="font-mono text-sm">{address.email}</span>
                      <button
                        onClick={() => setCurrentStep('information')}
                        className="font-mono text-sm text-accent"
                      >
                        Change
                      </button>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-mono text-sm text-foreground-muted">Ship to</span>
                      <span className="font-mono text-sm">
                        {address.address}, {address.city}, {address.pincode}
                      </span>
                      <button
                        onClick={() => setCurrentStep('information')}
                        className="font-mono text-sm text-accent"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tighter mb-6">
                      SHIPPING METHOD
                    </h2>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => {
                        const isFreeEligible = method.id === 'free' && cartTotal >= 2999
                        const isDisabled = method.id === 'free' && cartTotal < 2999

                        return (
                          <label
                            key={method.id}
                            className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                              selectedShipping === method.id
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:border-foreground-muted'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="shipping"
                                value={method.id}
                                checked={selectedShipping === method.id}
                                onChange={(e) => setSelectedShipping(e.target.value)}
                                disabled={isDisabled}
                                className="w-4 h-4 accent-accent"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-semibold">
                                    {method.name}
                                  </span>
                                  {method.carbonNeutral && (
                                    <Badge variant="success" size="sm">
                                      Carbon Neutral
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-mono text-xs text-foreground-muted">
                                  {method.estimatedDays}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-sm">
                              {method.price === 0
                                ? isFreeEligible
                                  ? 'FREE'
                                  : `Free over ${formatPrice(2999)}`
                                : formatPrice(method.price)}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setCurrentStep('information')}
                      className="font-mono text-sm text-foreground-muted hover:text-accent transition-colors"
                    >
                      ← Return to information
                    </button>
                    <Button variant="brutal" onClick={handleContinue}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="space-y-8">
                  <div className="border border-border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm text-foreground-muted">Contact</span>
                      <span className="font-mono text-sm">{address.email}</span>
                      <button
                        onClick={() => setCurrentStep('information')}
                        className="font-mono text-sm text-accent"
                      >
                        Change
                      </button>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-mono text-sm text-foreground-muted">Ship to</span>
                      <span className="font-mono text-sm">
                        {address.address}, {address.city}
                      </span>
                      <button
                        onClick={() => setCurrentStep('information')}
                        className="font-mono text-sm text-accent"
                      >
                        Change
                      </button>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-mono text-sm text-foreground-muted">Method</span>
                      <span className="font-mono text-sm">
                        {shippingMethods.find((m) => m.id === selectedShipping)?.name} ·{' '}
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                      <button
                        onClick={() => setCurrentStep('shipping')}
                        className="font-mono text-sm text-accent"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tighter mb-6">
                      PAYMENT METHOD
                    </h2>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                            selectedPayment === method.id
                              ? 'border-accent bg-accent/5'
                              : 'border-border hover:border-foreground-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-xl">{method.icon}</span>
                          <span className="font-mono text-sm font-semibold">{method.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="space-y-4 p-4 border border-border">
                      <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVV" placeholder="123" type="password" />
                      </div>
                      <Input label="Name on Card" placeholder="Full name as on card" />
                    </div>
                  )}

                  {selectedPayment === 'upi' && (
                    <div className="p-4 border border-border">
                      <Input label="UPI ID" placeholder="yourname@upi" />
                    </div>
                  )}

                  <div className="border border-accent p-4 bg-accent/5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">🌱</span>
                      <span className="font-mono text-sm font-semibold text-accent">
                        ECO-CONSCIOUS ORDER
                      </span>
                    </div>
                    <p className="font-mono text-xs text-foreground-muted">
                      This order has a carbon footprint of {carbonFootprint.toFixed(1)} kg CO₂. 
                      We will offset 100% through our partner reforestation projects.
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="font-mono text-sm text-foreground-muted hover:text-accent transition-colors"
                    >
                      ← Return to shipping
                    </button>
                    <Button
                      variant="brutal"
                      onClick={handlePlaceOrder}
                      isLoading={isProcessing}
                      className="min-w-[200px]"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:border-l lg:border-border lg:pl-12">
              <div className="sticky top-24">
                <h3 className="font-display text-xl font-bold tracking-tighter mb-6">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-background-secondary border border-border flex-shrink-0">
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground-muted text-background flex items-center justify-center font-mono text-xs">
                          {item.quantity}
                        </div>
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-foreground-muted">
                          IMG
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate">{item.product.name}</p>
                        <p className="font-mono text-xs text-foreground-muted">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="font-mono text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-foreground-muted">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-foreground-muted">Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  {cartTotal < 2999 && (
                    <p className="font-mono text-xs text-foreground-muted">
                      Add {formatPrice(2999 - cartTotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-lg font-bold">TOTAL</span>
                    <span className="font-display text-2xl font-bold text-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-foreground-muted mt-1">
                    Including all taxes
                  </p>
                </div>

                <div className="mt-6 p-4 border border-eco-green bg-eco-green/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-eco-green">🌍</span>
                    <span className="font-mono text-sm font-semibold text-eco-green">
                      Carbon Footprint
                    </span>
                  </div>
                  <p className="font-mono text-xs text-foreground-muted">
                    {carbonFootprint.toFixed(1)} kg CO₂ - 100% offset included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
