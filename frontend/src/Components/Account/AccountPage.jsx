import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Lock, Eye, EyeOff, Edit2, Check, Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';
import { userAPI } from '../../services/api.js';

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-zinc-800 rounded w-48" />
    <div className="bg-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-zinc-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-zinc-700 rounded w-32" />
          <div className="h-4 bg-zinc-700 rounded w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-12 bg-zinc-700 rounded-xl" />
        <div className="h-12 bg-zinc-700 rounded-xl" />
      </div>
    </div>
  </div>
);

const AccountPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { count: wishlistCount } = useSelector((state) => state.wishlist);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfileData({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await userAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setActiveTab('profile');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const formatJoinDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return 'Member';
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/wishlist')}
          className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors text-left"
        >
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">{wishlistCount}</p>
            <p className="text-zinc-400 text-sm">Wishlist Items</p>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-500" />
        </button>

        <button
          onClick={() => navigate('/account/orders')}
          className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors text-left"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">View</p>
            <p className="text-zinc-400 text-sm">My Orders</p>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'password'
              ? 'bg-white text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="bg-zinc-800 rounded-2xl p-6 lg:p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
              <div className="flex items-center gap-2 text-zinc-400 mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {formatJoinDate()}</span>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-white disabled:opacity-50"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-white disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-14 text-white placeholder-zinc-500 focus:outline-none focus:border-white disabled:opacity-50"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="px-6 py-3 bg-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="bg-zinc-800 rounded-2xl p-6 lg:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
