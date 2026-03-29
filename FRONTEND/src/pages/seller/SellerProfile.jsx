import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMapPin, FiAward, FiMessageSquare, FiCamera } from 'react-icons/fi';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const SellerProfile = () => {
  const { user, updateUser } = useAuth();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingKitchen, setUploadingKitchen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/cooks/me');
      setCook({ ...data.cook, phone: data.cook.userId?.phone || '' });
    } catch (err) {
      toast.error('Failed to load cook profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCook({ ...cook, [parent]: { ...cook[parent], [child]: value } });
    } else {
      setCook({ ...cook, [name]: value });
    }
  };

  const handleDishesChange = (e) => {
    const dishes = e.target.value.split(',').map(d => d.trim());
    setCook({ ...cook, specialDishes: dishes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put(`/cooks/${cook._id}`, {
        bio: cook.bio,
        location: cook.location,
        specialDishes: cook.specialDishes,
        deliveryRadius: cook.deliveryRadius,
        phone: cook.phone
      });
      if (data.success) {
        toast.success('Kitchen profile updated');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
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
        setCook({ ...cook, photo: res.data.url });
        
        // Auto-save the new photo directly to the database for the Cook Profile
        await api.put(`/cooks/${cook._id}`, { photo: res.data.url });
        
        // Synchronize this into the Global User avatar so Navbar reflects immediately!
        const userUpdateRes = await api.put('/users/profile', { avatar: res.data.url });
        if (userUpdateRes.data.success) {
          updateUser(userUpdateRes.data.user);
        }
        
        toast.success('Avatar uploaded securely');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to upload avatar');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleKitchenPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingKitchen(true);
      const data = new FormData();
      data.append('image', file);
      
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setCook({ ...cook, kitchenPhoto: res.data.url });
        await api.put(`/cooks/${cook._id}`, { kitchenPhoto: res.data.url });
        toast.success('Kitchen photo uploaded securely');
      }
    } catch (err) {
      toast.error('Failed to upload kitchen photo');
    } finally {
      setUploadingKitchen(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Kitchen Settings</h1>
        <p className="text-gray-500 mt-2">Update your cook profile, location, and specialties.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-12">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-50 rounded-bl-full z-0 opacity-50"></div>

        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-secondary-100 flex items-center justify-center">
              {cook?.photo ? (
                <img src={cook.photo} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-display text-secondary-600">👩‍🍳</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-md text-primary-500 hover:text-primary-600 transition-colors border border-gray-100 cursor-pointer">
              {uploadingImage ? <LoadingSpinner size="sm" /> : <FiCamera className="w-5 h-5" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingImage} />
            </label>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900">{user?.name}'s Kitchen</h3>
            <div className="flex gap-2 justify-center mt-2">
              {cook?.trustedMaaBadge && <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full border border-primary-100">🏅 Trusted</span>}
              {cook?.hygieneBadge && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full border border-green-100">✨ Clean</span>}
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Kitchen Photo</h3>
            <div className="relative group w-48 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center mx-auto">
              {cook?.kitchenPhoto ? (
                <img src={cook?.kitchenPhoto} alt="Kitchen" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FiCamera className="w-6 h-6 mb-2" />
                  <span className="text-xs">Upload Photo</span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingKitchen ? <LoadingSpinner size="sm" className="text-white" /> : <span className="text-white font-medium text-sm">Change</span>}
                <input type="file" accept="image/*" className="hidden" onChange={handleKitchenPhotoUpload} disabled={uploadingKitchen} />
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 relative z-10">
          {/* Phone */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <FiUser className="text-secondary-500" /> Contact Details
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone" type="tel" value={cook?.phone || ''} onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-secondary-500" /> About Your Kitchen
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kitchen Bio</label>
            <textarea
              name="bio" value={cook?.bio || ''} onChange={handleChange}
              placeholder="Tell customers about your cooking style and background..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            />
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mt-8 mb-4 flex items-center gap-2">
              <FiAward className="text-accent-500" /> Specialties
            </h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Dishes (comma separated)</label>
            <input
              type="text" value={cook?.specialDishes?.join(', ') || ''} onChange={handleDishesChange}
              placeholder="Rajma Chawal, Poha, Aloo Paratha"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mt-8 mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary-500" /> Location & Delivery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="location.city" type="text" value={cook?.location?.city || ''} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                <input
                  name="deliveryRadius" type="number" min="1" max="20" value={cook?.deliveryRadius || 5} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address (Internal use)</label>
              <input
                name="location.address" type="text" value={cook?.location?.address || ''} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-secondary-600 text-white font-medium rounded-xl hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors w-full md:w-auto"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SellerProfile;
