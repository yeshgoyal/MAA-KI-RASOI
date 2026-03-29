import { useState, useEffect } from 'react';
import api from '../../api/axios';
import FoodCard from '../../Components/ui/FoodCard';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import EmptyState from '../../Components/ui/EmptyState';
import toast from 'react-hot-toast';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';

const ManageMenu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Very simple inline form for adding item (in a real app, use a proper modal)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'Main Course',
    type: 'veg', spiciness: 'Medium', prepTime: 30, available: true, image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/food/cook');
      setFoods(data.foodItems || []);
    } catch (err) {
      console.error('Failed to fetch menu items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
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
        setFormData({ ...formData, image: res.data.url });
        toast.success('Image uploaded');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/food', formData);
      if (data.success) {
        toast.success('Food item created');
        setShowForm(false);
        setFormData({ name: '', description: '', price: '', category: 'Main Course', type: 'veg', spiciness: 'Medium', prepTime: 30, available: true, image: '' });
        fetchFoodItems();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/food/${id}`);
      toast.success('Item deleted');
      fetchFoodItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Menu</h1>
          <p className="text-gray-500 mt-1">Control what you serve and manage availability.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-600 transition-colors"
        >
          {showForm ? 'Cancel' : <><FiPlus /> Add Item</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-primary-200 shadow-md mb-8 animate-slide-up">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Add New Menu Item</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Price (₹)</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 resize-none h-20"></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Food Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="egg">Contains Egg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Image</label>
              <div className="flex items-center gap-3 mt-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                {uploadingImage && <LoadingSpinner size="sm" />}
                {formData.image && <img src={formData.image} alt="preview" className="h-10 w-10 object-cover rounded shadow-sm border" />}
              </div>
            </div>
            <button type="submit" disabled={uploadingImage} className="md:col-span-2 bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 mt-2 disabled:opacity-50">
              Save Food Item
            </button>
          </form>
        </div>
      )}

      {foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {foods.map(food => (
            <FoodCard 
              key={food._id} 
              food={food} 
              isCookView={true} 
              onEdit={() => toast('Edit coming soon')} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<FiGrid />}
          title="Your menu is empty"
          message="Start adding the delicious dishes you want to serve to customers in your area."
          action={<button onClick={() => setShowForm(true)} className="px-6 py-2 bg-primary-50 rounded-lg text-primary-600 font-medium">Add First Item</button>}
        />
      )}
    </div>
  );
};

export default ManageMenu;
