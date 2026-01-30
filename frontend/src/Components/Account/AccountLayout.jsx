import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice.jsx';

const AccountLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    {
      label: 'Profile',
      path: '/account',
      icon: User,
    },
    {
      label: 'Orders',
      path: '/account/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
    },
    {
      label: 'Addresses',
      path: '/account/addresses',
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 text-white bg-zinc-800 rounded-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-zinc-800/50 backdrop-blur-xl border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">My Account</h1>
              <p className="text-zinc-400 text-sm">Manage your profile and orders</p>
            </div>

            {/* User Info Card */}
            {user && (
              <div className="bg-zinc-800 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-zinc-400 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/account'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-zinc-900'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </NavLink>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-6"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
