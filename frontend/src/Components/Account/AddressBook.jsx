import { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  User,
  Check,
  X,
} from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';
import { userAPI } from '../../services/api.js';

const AddressSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-zinc-800 rounded w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="h-48 bg-zinc-800 rounded-2xl" />
      ))}
    </div>
  </div>
);

const EmptyAddresses = ({ onAdd }) => (
  <div className="text-center py-16 bg-zinc-800 rounded-2xl">
    <div className="w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
      <MapPin className="w-12 h-12 text-zinc-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No addresses saved</h3>
    <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
      Add your shipping addresses to make checkout faster and easier.
    </p>
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
    >
      <Plus className="w-5 h-5" />
      Add Address
    </button>
  </div>
);

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    type: 'home',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAddresses();
      setAddresses(data.addresses || data || []);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      type: 'home',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setFormData({
      name: address.name || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || address.postal_code || '',
      phone: address.phone || '',
      type: address.type || 'home',
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAddress) {
        await userAPI.updateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        await userAPI.addAddress(formData);
        toast.success('Address added successfully');
      }
      setShowForm(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    try {
      await userAPI.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await userAPI.setDefaultAddress(addressId);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Address Book</h1>
        <AddressSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Address Book</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-zinc-800 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Type */}
            <div className="flex gap-4">
              {['home', 'work', 'other'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    formData.type === type
                      ? 'bg-white text-zinc-900'
                      : 'bg-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="sr-only"
                  />
                  {getAddressIcon(type)}
                  <span className="capitalize font-medium">{type}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="Recipient's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="Contact phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="House number, street, apartment, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="City name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  placeholder="6-digit PIN code"
                />
              </div>

              <div className="flex items-center md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-white focus:ring-white"
                  />
                  <span className="text-zinc-400">Set as default address</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
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
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : addresses.length === 0 ? (
        <EmptyAddresses onAdd={handleAddClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-zinc-800 rounded-2xl p-6 relative ${
                address.isDefault ? 'ring-2 ring-white' : ''
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs text-white">
                  <Check className="w-3 h-3" />
                  Default
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                  {getAddressIcon(address.type)}
                </div>
                <span className="text-zinc-400 text-sm capitalize">{address.type}</span>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-white font-semibold">{address.name}</p>
                <p className="text-zinc-400 text-sm">{address.address}</p>
                <p className="text-zinc-400 text-sm">
                  {address.city}, {address.state} {address.postalCode || address.postal_code}
                </p>
                <p className="text-zinc-400 text-sm">Phone: {address.phone}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(address)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;
