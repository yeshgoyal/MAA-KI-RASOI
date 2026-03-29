import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatCard from '../../Components/ui/StatCard';
import OrderCard from '../../Components/ui/OrderCard';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { FiPieChart, FiDollarSign, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cook, setCook] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: cookData } = await api.get('/cooks/me');
        setCook(cookData.cook);

        const { data: orderData } = await api.get('/orders/cook');
        setRecentOrders(orderData.orders?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load seller dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!cook) return <div className="text-center py-20 text-gray-500">Cook profile not found. Please setup your profile.</div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const toggleCookStatus = async () => {
    try {
      const { data } = await api.put(`/cooks/${cook._id}`, {
        isActive: !cook.isActive,
        isApproved: true // Forcing true guarantees they appear on the Explore page immediately
      });
      if (data.success) {
        setCook(data.cook);
        toast.success(data.cook.isActive ? "You are now Live on Explore Page! 🚀" : "Kitchen Closed. You are hidden from Explore Page.");
      }
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">{getGreeting()}, Chef {user?.name?.split(' ')[0]}! 👩‍🍳</h1>
          <p className="text-gray-500 mt-2">Here's what your kitchen looks like today.</p>
        </div>
        <button 
          onClick={toggleCookStatus} 
          className={`flex items-center px-5 py-2.5 rounded-xl shadow-sm transition-all transform hover:scale-105 ${cook.isActive ? 'bg-green-50 hover:bg-green-100 border border-green-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
        >
          <span className="relative flex h-3 w-3 mr-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cook.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${cook.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          </span>
          <span className={`font-bold text-sm ${cook.isActive ? 'text-green-700' : 'text-gray-700'}`}>
            {cook.isActive ? 'Live - Serving Orders' : 'Go Live / Offline'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Earnings" value={`₹${cook.totalEarnings}`} icon={<FiDollarSign />} color="green" />
        <StatCard title="Orders Completed" value={cook.totalOrders} icon={<FiPieChart />} color="primary" />
        <StatCard title="Pending Orders" value={recentOrders.filter(o => ['Placed', 'Preparing'].includes(o.status)).length} icon={<FiClock />} color="accent" />
        <StatCard title="Overall Rating" value={`${cook.rating?.toFixed(1) || '0.0'} / 5`} icon={<FiStar />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Incoming Orders</h2>
            <Link to="/seller/orders" className="text-primary-600 font-medium hover:text-primary-700">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <OrderCard key={order._id} order={order} isCookView={true} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border text-center border-dashed border-gray-300">
                <div className="text-4xl mb-4">💤</div>
                <h3 className="text-lg font-bold text-gray-900">It's quiet here</h3>
                <p className="text-gray-500">You have no recent orders.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links & Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/seller/menu" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span className="font-medium text-gray-700">Manage Menu Items</span>
                <FiChevronRight className="text-gray-400 group-hover:text-primary-500" />
              </Link>
              <Link to="/seller/reviews" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span className="font-medium text-gray-700">Read Customer Reviews</span>
                <FiChevronRight className="text-gray-400 group-hover:text-primary-500" />
              </Link>
              <Link to="/seller/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span className="font-medium text-gray-700">Update Profile & Location</span>
                <FiChevronRight className="text-gray-400 group-hover:text-primary-500" />
              </Link>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">💡 Pro Tip for Chefs</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Adding high-quality pictures to your food items increases the chance of securing an order by up to 50%. Take pictures in natural light!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
