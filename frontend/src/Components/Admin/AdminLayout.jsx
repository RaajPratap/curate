import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Store,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice.jsx';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: Users,
    },
  ];

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

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
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-zinc-400 text-xs">Curate E-Commerce</p>
                </div>
              </div>
            </div>

            {/* Admin Info Card */}
            {user && (
              <div className="bg-zinc-800 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={() =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActivePath(item.path)
                        ? 'bg-white text-zinc-900'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActivePath(item.path) && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-zinc-700/50">
              <NavLink
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">View Store</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
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

export default AdminLayout;
