import React, { useState } from 'react';
import { Truck, User, MapPin, Phone, Mail, Loader2, ChevronRight } from 'lucide-react';

const ShippingForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^[0-9]{6}$/.test(formData.postalCode.replace(/\D/g, ''))) {
      newErrors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClasses = (error) => `
    w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-700'}
  `;

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Shipping Information</h2>
          <p className="text-sm text-gray-400">Enter your delivery details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <User className="w-4 h-4" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className={inputClasses(errors.firstName)}
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <User className="w-4 h-4" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={inputClasses(errors.lastName)}
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className={inputClasses(errors.email)}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={inputClasses(errors.phone)}
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <MapPin className="w-4 h-4" />
            Street Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123, Main Street, Apartment 4B"
            rows={3}
            className={inputClasses(errors.address)}
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai"
              className={inputClasses(errors.city)}
            />
            {errors.city && (
              <p className="text-red-400 text-xs mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Maharashtra"
              className={inputClasses(errors.state)}
            />
            {errors.state && (
              <p className="text-red-400 text-xs mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="400001"
              className={inputClasses(errors.postalCode)}
            />
            {errors.postalCode && (
              <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country (Read-only for now) */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            disabled
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-gray-400 cursor-not-allowed"
          />
          <p className="text-gray-500 text-xs mt-1">Currently shipping to India only</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
