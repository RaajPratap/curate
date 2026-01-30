import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, ChevronRight, Heart } from 'lucide-react';
import { logout } from '../../features/auth/authSlice.jsx';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { count: wishlistCount } = useSelector((state) => state.wishlist);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: null },
    { label: 'Shop', path: '/shop', icon: null },
    { label: 'About', path: '/about', icon: null },
    { label: 'Lookbook', path: '/lookbook', icon: null },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-8 left-4 z-[60] p-2 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-zinc-900 z-[56] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          {/* Logo */}
          <h1 
            onClick={() => handleNavigate('/')}
            className="text-2xl font-bold text-white mb-8 cursor-pointer"
          >
            CURATE
          </h1>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center justify-between py-3 px-4 text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-zinc-800" />

          {/* Cart & Auth Section */}
          <div className="space-y-2">
            <button
              onClick={() => handleNavigate('/cart')}
              className="w-full flex items-center justify-between py-3 px-4 text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Shopping Bag</span>
              </div>
              {totalQuantity > 0 && (
                <span className="bg-white text-zinc-900 text-xs font-bold px-2 py-1 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>

            {isAuthenticated && (
              <button
                onClick={() => handleNavigate('/wishlist')}
                className="w-full flex items-center justify-between py-3 px-4 text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate('/account')}
                  className="w-full flex items-center gap-3 py-3 px-4 text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">My Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-3 px-4 text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full flex items-center gap-3 py-3 px-4 text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login / Register</span>
              </button>
            )}
          </div>

          {/* User Info (if logged in) */}
          {isAuthenticated && user && (
            <div className="mt-6 p-4 bg-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-400">Signed in as</p>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
