import React from 'react';
import { Package, IndianRupee, Truck, Shield, Info } from 'lucide-react';

const OrderSummary = ({ items, totalAmount, shippingCost = 0 }) => {
  const subtotal = totalAmount;
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + tax + shippingCost;

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 sticky top-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Order Summary</h2>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item._id} className="flex gap-4 p-3 bg-zinc-900/50 rounded-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://placehold.co/100x100/1a202c/ffffff?text=No+Image';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{item.name}</h4>
              <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
              <p className="text-white font-semibold mt-1">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="border-t border-zinc-700 pt-4 space-y-3">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-400">
          <span className="flex items-center gap-1">
            Tax (18% GST)
            <Info className="w-3 h-3 text-gray-500" title="Goods and Services Tax" />
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {tax.toFixed(2)}
          </span>
        </div>
        
        {shippingCost !== undefined && (
          <div className="flex justify-between text-gray-400">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Shipping
            </span>
            <span className="flex items-center gap-1">
              {shippingCost === 0 ? (
                <span className="text-green-400">Free</span>
              ) : (
                <>
                  <IndianRupee className="w-3 h-3" />
                  {shippingCost.toFixed(2)}
                </>
              )}
            </span>
          </div>
        )}

        <div className="border-t border-zinc-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-white font-bold text-xl flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {total.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Including all taxes and shipping</p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-zinc-900/50 p-3 rounded-lg">
          <Shield className="w-4 h-4 text-green-400" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-zinc-900/50 p-3 rounded-lg">
          <Truck className="w-4 h-4 text-blue-400" />
          <span>Free Shipping</span>
        </div>
      </div>

      {/* Item Count */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          {items.reduce((acc, item) => acc + item.quantity, 0)} items in cart
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
