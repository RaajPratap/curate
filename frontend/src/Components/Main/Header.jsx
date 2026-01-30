import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import ButtonMinimalist from "../Micro/ButtonMinimalist.jsx";
import AuthModal from "../Auth/AuthModal.jsx";
import CartModal from "../Cart/CartModal.jsx";
import MobileNav from "./MobileNav.jsx";
import { logout } from "../../features/auth/authSlice.jsx";


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Header */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center px-4 lg:px-10 py-4 lg:py-8 h-16 lg:h-[10vw] justify-between">
        {/* Left Navigation - Desktop Only */}
        <div className="hidden lg:flex gap-2 items-center">
          <ButtonMinimalist title="Shop" to="/shop"/>
          <ButtonMinimalist title="About" />
          <ButtonMinimalist title="Lookbook" />
        </div>

        {/* Logo - Mobile (centered) & Desktop (hidden, shown elsewhere) */}
        <div className="lg:hidden flex-1 text-center">
          <span className="text-xl font-bold text-white">CURATE</span>
        </div>

        {/* Right Navigation */}
        <div className="flex gap-2 items-center">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex gap-2">
                <button
                  onClick={handleAccountClick}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Account</span>
                </button>
                <ButtonMinimalist title="Logout" onClick={handleLogout} />
              </div>
              <ButtonMinimalist 
                title={`Bag/${totalQuantity}`} 
                onClick={() => setShowCartModal(true)}
              />
            </>
          ) : (
            <>
              <div className="hidden lg:flex gap-2">
                <ButtonMinimalist
                  title="Login"
                  onClick={() => handleAuthClick("login")}
                />
                <ButtonMinimalist
                  title="Sign Up"
                  onClick={() => handleAuthClick("register")}
                />
              </div>

              <ButtonMinimalist 
                title={`Bag/${totalQuantity}`} 
                onClick={() => setShowCartModal(true)}
              />
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
};

export default Header;
