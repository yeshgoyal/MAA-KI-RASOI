import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from 'react-icons/fi';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    }
  });

  const handleChange = (e) => {
    if (['street', 'city', 'state', 'pincode'].includes(e.target.name)) {
      setFormData({
        ...formData,
        address: { ...formData.address, [e.target.name]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', formData);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        // Automatically save new avatar link to user profile
        const updateRes = await api.put('/users/profile', { avatar: res.data.url });
        if (updateRes.data.success) {
          updateUser(updateRes.data.user);
          toast.success('Avatar updated successfully');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to upload avatar');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account details and delivery addresses.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full z-0 opacity-50"></div>

        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-primary-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-display text-primary-600">{user?.name?.charAt(0)}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-md text-primary-500 hover:text-primary-600 transition-colors border border-gray-100 cursor-pointer">
                {uploadingImage ? <LoadingSpinner size="sm" /> : <FiCamera className="w-5 h-5" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingImage} />
              </label>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <FiUser className="text-primary-500" /> Personal Info
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name" type="text" value={formData.name} onChange={handleChange} required
                  className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400 font-normal">(cannot change)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiMail /></div>
                  <input
                    type="email" value={user?.email || ''} disabled 
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FiPhone /></div>
                  <input
                    name="phone" type="tel" value={formData.phone} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mt-10 mb-4 flex items-center gap-2">
              <FiMapPin className="text-secondary-500" /> Delivery Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  name="street" type="text" value={formData.address.street} onChange={handleChange}
                  className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                  placeholder="Apt, Suite, Building Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="city" type="text" value={formData.address.city} onChange={handleChange}
                    className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    name="state" type="text" value={formData.address.state} onChange={handleChange}
                    className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    name="pincode" type="text" value={formData.address.pincode} onChange={handleChange}
                    className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
