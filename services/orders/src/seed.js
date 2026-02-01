const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const Order = require("./models/Order");
const Cart = require("./models/Cart");

// Helper to generate order numbers
const generateOrderNumber = (index) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `CUR-${year}${month}-${(1000 + index).toString()}`;
};

// We'll use placeholder ObjectIds - in real scenario, these would come from actual users/products
const mockUserIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const mockProductIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

// Mock orders data
const orders = [
  {
    orderNumber: generateOrderNumber(1),
    user: mockUserIds[0],
    items: [
      {
        product: mockProductIds[0],
        variant: { size: "M", color: "Black" },
        name: "Recycled Hoodie",
        image: "/images/products/hoodie-1.jpg",
        price: 4999,
        quantity: 1,
        sku: "RH-001-M-BLK",
      },
      {
        product: mockProductIds[1],
        variant: { size: "L", color: "White" },
        name: "Organic Cotton Tee",
        image: "/images/products/tee-1.jpg",
        price: 1499,
        quantity: 2,
        sku: "OCT-001-L-WHT",
      },
    ],
    subtotal: 7997,
    discount: 500,
    discountCode: "WELCOME10",
    shippingCost: 99,
    tax: 1439,
    total: 9035,
    currency: "INR",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "456 Green Lane",
      apartment: "Apt 2B",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      phone: "+91-9876543211",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "razorpay",
      status: "paid",
      razorpayOrderId: "order_MockRazorpay001",
      razorpayPaymentId: "pay_MockPayment001",
      razorpaySignature: "mock_signature_001",
      paidAt: new Date("2024-05-15T10:30:00Z"),
    },
    shipping: {
      method: "standard",
      carrier: "BlueDart",
      trackingNumber: "BD123456789",
      trackingUrl: "https://bluedart.com/track/BD123456789",
      estimatedDelivery: new Date("2024-05-20"),
      shippedAt: new Date("2024-05-16"),
      deliveredAt: new Date("2024-05-19"),
    },
    status: "delivered",
    statusHistory: [
      { status: "pending", timestamp: new Date("2024-05-15T10:25:00Z") },
      { status: "confirmed", timestamp: new Date("2024-05-15T10:30:00Z") },
      { status: "processing", timestamp: new Date("2024-05-15T14:00:00Z") },
      { status: "shipped", timestamp: new Date("2024-05-16T09:00:00Z") },
      { status: "delivered", timestamp: new Date("2024-05-19T15:30:00Z") },
    ],
    sustainabilityImpact: {
      totalCarbonFootprint: 6.3,
      carbonSavedVsConventional: 4.2,
    },
  },
  {
    orderNumber: generateOrderNumber(2),
    user: mockUserIds[1],
    items: [
      {
        product: mockProductIds[2],
        variant: { size: "32", color: "Olive" },
        name: "Eco Cargo Pants",
        image: "/images/products/cargo-1.jpg",
        price: 5999,
        quantity: 1,
        sku: "ECP-001-32-OLV",
      },
    ],
    subtotal: 5999,
    discount: 0,
    shippingCost: 99,
    tax: 1080,
    total: 7178,
    currency: "INR",
    shippingAddress: {
      firstName: "Priya",
      lastName: "Sharma",
      street: "321 Eco Avenue",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India",
      phone: "+91-9876543212",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "razorpay",
      status: "paid",
      razorpayOrderId: "order_MockRazorpay002",
      razorpayPaymentId: "pay_MockPayment002",
      razorpaySignature: "mock_signature_002",
      paidAt: new Date("2024-05-18T14:45:00Z"),
    },
    shipping: {
      method: "express",
      carrier: "DTDC",
      trackingNumber: "DTDC987654321",
      estimatedDelivery: new Date("2024-05-21"),
      shippedAt: new Date("2024-05-19"),
    },
    status: "shipped",
    statusHistory: [
      { status: "pending", timestamp: new Date("2024-05-18T14:40:00Z") },
      { status: "confirmed", timestamp: new Date("2024-05-18T14:45:00Z") },
      { status: "processing", timestamp: new Date("2024-05-18T18:00:00Z") },
      { status: "shipped", timestamp: new Date("2024-05-19T10:00:00Z") },
    ],
    sustainabilityImpact: {
      totalCarbonFootprint: 6.8,
      carbonSavedVsConventional: 3.5,
    },
  },
  {
    orderNumber: generateOrderNumber(3),
    user: mockUserIds[2],
    items: [
      {
        product: mockProductIds[3],
        variant: { size: "M", color: "Black" },
        name: "Limited Drop Jacket",
        image: "/images/products/jacket-1.jpg",
        price: 11999,
        quantity: 1,
        sku: "LDJ-001-M-BLK",
      },
      {
        product: mockProductIds[4],
        variant: { size: "One Size", color: "Charcoal" },
        name: "Hemp Beanie",
        image: "/images/products/beanie-1.jpg",
        price: 999,
        quantity: 1,
        sku: "HB-001-OS-CHR",
      },
    ],
    subtotal: 12998,
    discount: 1000,
    discountCode: "LIMITEDDROP",
    shippingCost: 0,
    tax: 2160,
    total: 14158,
    currency: "INR",
    shippingAddress: {
      firstName: "Amit",
      lastName: "Patel",
      street: "555 Sustainable Street",
      apartment: "Block C, Flat 12",
      city: "Ahmedabad",
      state: "Gujarat",
      zipCode: "380001",
      country: "India",
      phone: "+91-9876543213",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "razorpay",
      status: "paid",
      razorpayOrderId: "order_MockRazorpay003",
      razorpayPaymentId: "pay_MockPayment003",
      razorpaySignature: "mock_signature_003",
      paidAt: new Date("2024-05-20T09:15:00Z"),
    },
    shipping: {
      method: "standard",
      carrier: "Delhivery",
      estimatedDelivery: new Date("2024-05-25"),
    },
    status: "processing",
    statusHistory: [
      { status: "pending", timestamp: new Date("2024-05-20T09:10:00Z") },
      { status: "confirmed", timestamp: new Date("2024-05-20T09:15:00Z") },
      { status: "processing", timestamp: new Date("2024-05-20T12:00:00Z") },
    ],
    sustainabilityImpact: {
      totalCarbonFootprint: 9.3,
      carbonSavedVsConventional: 5.8,
    },
  },
  {
    orderNumber: generateOrderNumber(4),
    user: mockUserIds[0],
    items: [
      {
        product: mockProductIds[1],
        variant: { size: "M", color: "Black" },
        name: "Organic Cotton Tee",
        image: "/images/products/tee-1.jpg",
        price: 1499,
        quantity: 3,
        sku: "OCT-001-M-BLK",
      },
    ],
    subtotal: 4497,
    discount: 0,
    shippingCost: 99,
    tax: 809,
    total: 5405,
    currency: "INR",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "789 Tech Park",
      apartment: "Floor 5",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560002",
      country: "India",
      phone: "+91-9876543211",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "razorpay",
      status: "pending",
      razorpayOrderId: "order_MockRazorpay004",
    },
    shipping: {
      method: "standard",
      estimatedDelivery: new Date("2024-05-28"),
    },
    status: "pending",
    statusHistory: [{ status: "pending", timestamp: new Date() }],
    sustainabilityImpact: {
      totalCarbonFootprint: 6.3,
      carbonSavedVsConventional: 4.5,
    },
  },
  {
    orderNumber: generateOrderNumber(5),
    guestEmail: "guest.shopper@example.com",
    items: [
      {
        product: mockProductIds[0],
        variant: { size: "L", color: "Forest" },
        name: "Recycled Hoodie",
        image: "/images/products/hoodie-1.jpg",
        price: 4999,
        quantity: 1,
        sku: "RH-001-L-FOR",
      },
    ],
    subtotal: 4999,
    discount: 0,
    shippingCost: 149,
    tax: 900,
    total: 6048,
    currency: "INR",
    shippingAddress: {
      firstName: "Guest",
      lastName: "Shopper",
      street: "999 Random Street",
      city: "Chennai",
      state: "Tamil Nadu",
      zipCode: "600001",
      country: "India",
      phone: "+91-9876543299",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "razorpay",
      status: "paid",
      razorpayOrderId: "order_MockRazorpay005",
      razorpayPaymentId: "pay_MockPayment005",
      razorpaySignature: "mock_signature_005",
      paidAt: new Date("2024-05-10T16:20:00Z"),
    },
    shipping: {
      method: "standard",
      carrier: "India Post",
      trackingNumber: "IP1234567890IN",
      estimatedDelivery: new Date("2024-05-17"),
      shippedAt: new Date("2024-05-11"),
      deliveredAt: new Date("2024-05-16"),
    },
    status: "delivered",
    statusHistory: [
      { status: "pending", timestamp: new Date("2024-05-10T16:15:00Z") },
      { status: "confirmed", timestamp: new Date("2024-05-10T16:20:00Z") },
      { status: "processing", timestamp: new Date("2024-05-10T18:00:00Z") },
      { status: "shipped", timestamp: new Date("2024-05-11T10:00:00Z") },
      { status: "delivered", timestamp: new Date("2024-05-16T14:00:00Z") },
    ],
    sustainabilityImpact: {
      totalCarbonFootprint: 4.2,
      carbonSavedVsConventional: 3.1,
    },
  },
];

// Mock carts data
const carts = [
  {
    user: mockUserIds[3],
    items: [
      {
        product: mockProductIds[0],
        variant: { size: "S", color: "Charcoal" },
        quantity: 1,
        price: 4999,
        name: "Recycled Hoodie",
        image: "/images/products/hoodie-1.jpg",
      },
      {
        product: mockProductIds[4],
        variant: { size: "One Size", color: "Black" },
        quantity: 2,
        price: 999,
        name: "Hemp Beanie",
        image: "/images/products/beanie-1.jpg",
      },
    ],
  },
  {
    sessionId: "guest_session_abc123",
    items: [
      {
        product: mockProductIds[2],
        variant: { size: "30", color: "Black" },
        quantity: 1,
        price: 5999,
        name: "Eco Cargo Pants",
        image: "/images/products/cargo-1.jpg",
      },
    ],
  },
  {
    user: mockUserIds[1],
    items: [
      {
        product: mockProductIds[3],
        variant: { size: "L", color: "Black" },
        quantity: 1,
        price: 11999,
        name: "Limited Drop Jacket",
        image: "/images/products/jacket-1.jpg",
      },
    ],
  },
];

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log("Cleared existing orders and carts");

    // Insert orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`Seeded ${createdOrders.length} orders`);

    // Insert carts
    const createdCarts = [];
    for (const cartData of carts) {
      const cart = new Cart(cartData);
      await cart.save(); // This triggers subtotal calculation
      createdCarts.push(cart);
    }
    console.log(`Seeded ${createdCarts.length} carts`);

    console.log("\n--- Order Summary ---");
    createdOrders.forEach((order) => {
      console.log(`  ${order.orderNumber} - ₹${order.total} (${order.status})`);
    });

    console.log("\n--- Cart Summary ---");
    createdCarts.forEach((cart) => {
      const owner = cart.user ? "User" : `Guest (${cart.sessionId})`;
      console.log(
        `  ${owner} - ${cart.items.length} items - ₹${cart.subtotal}`,
      );
    });

    console.log("\nOrders & Carts seeding completed!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedOrders();
