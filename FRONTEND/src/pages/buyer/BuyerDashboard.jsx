import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatCard from '../../Components/ui/StatCard';
import OrderCard from '../../Components/ui/OrderCard';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { FiShoppingBag, FiStar, FiHeart, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    walletBalance: user?.wallet || 0,
    favorites: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, there might be a dedicated /dashboard endpoint
        // Here we fetch orders and derive stats
        const { data: orderData } = await api.get('/orders/my');
        const orders = orderData.orders || [];
        
        setRecentOrders(orders.slice(0, 3));
        
        const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
        const totalSpent = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.finalAmount, 0);

        setStats({
          activeOrders,
          walletBalance: user?.wallet || 0,
          favorites: 5, // Mock value since favorites feature isn't in backend yet
          totalSpent
        });
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" className="text-primary-500" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-2">Here's an overview of your food journey today.</p>
      </div>

      {/* Consumer Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 border border-gray-100 rounded-2xl shadow-sm">
         <Link to="/buyer/dashboard" className="px-6 py-2.5 bg-primary-50 text-primary-600 font-bold rounded-xl whitespace-nowrap">Overview</Link>
         <Link to="/explore" className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors whitespace-nowrap">Explore Moms</Link>
         <Link to="/buyer/orders" className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors whitespace-nowrap">My Orders</Link>
         <Link to="/buyer/wallet" className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors whitespace-nowrap">Wallet</Link>
      </div>

      {/* The 50 Rupee Plate Promo */}
      <div className="mb-10 bg-gradient-to-r from-orange-500 to-primary-600 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden shadow-xl shadow-primary-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-[40px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 border border-white/30">
            🔥 Special Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-3 text-white">
            Daily Maa ki Thali
          </h2>
          <p className="text-orange-50 text-lg mb-6 leading-relaxed">
            A simple, wholesome, and affordable home-cooked meal. Perfect for your daily lunch or dinner. No minimum order, just pure love!
          </p>
          <Link to="/explore?price=50" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1">
            Book @ ₹50 Now
          </Link>
        </div>
        <div className="relative z-10 shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white/20 overflow-hidden bg-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
           {/* Placeholder for aesthetic food image */}
           <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80" alt="Home cooked thali" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Active Orders" value={stats.activeOrders} icon={<FiShoppingBag />} color="primary" />
        <StatCard title="Wallet Balance" value={`₹${stats.walletBalance}`} icon={<FiDollarSign />} color="green" />
        <StatCard title="Total Spent" value={`₹${stats.totalSpent}`} icon={<FiStar />} color="accent" />
        <StatCard title="Favorite Cooks" value={stats.favorites} icon={<FiHeart />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-primary-600 font-medium hover:text-primary-700">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border text-center border-dashed border-gray-300">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-lg font-bold text-gray-900">No recent orders</h3>
                <p className="text-gray-500 mb-6">You haven't ordered anything recently.</p>
                <Link to="/explore" className="px-6 py-2 bg-primary-50 rounded-lg text-primary-600 font-medium">Explore Cooks</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <Link to="/explore" className="flex items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary-500 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <FiShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Order Food</h3>
                <p className="text-sm text-gray-500">Find something delicious</p>
              </div>
            </Link>
            
            <Link to="/buyer/wallet" className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-green-500 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Add Money</h3>
                <p className="text-sm text-gray-500">Top up your wallet</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
