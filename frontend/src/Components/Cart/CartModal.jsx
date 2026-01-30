import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeItemFromCart, updateItemQuantity, clearCart } from '../../features/cart/cartSlice.jsx';
import { ShoppingBag, Trash2, Plus, Minus, X, ArrowRight } from 'lucide-react';

const CartModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeItemFromCart(id));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-zinc-800 rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-700 rounded-full"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-sm">Add some items to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100/1a202c/ffffff?text=No+Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{item.name}</h3>
                    <p className="text-gray-400 text-sm">₹{item.price} each</p>
                    <p className="text-white font-medium text-sm mt-1">
                      Total: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-8 h-8 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-8 h-8 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.countInStock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Total Items</span>
                <span className="text-white">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-300 text-lg">Total Amount</span>
                <span className="text-white text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
                <button 
                  onClick={handleCheckout}
                  className="flex-[2] px-4 py-3 bg-white hover:bg-gray-100 text-zinc-900 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
