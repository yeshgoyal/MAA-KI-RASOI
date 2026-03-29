import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import EmptyState from '../../Components/ui/EmptyState';
import { FiDollarSign, FiStar, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';

export const EarningsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await api.get('/orders/cook');
        if (data.success) {
          const deliveredOrders = data.orders.filter(o => o.status === 'Delivered');
          setOrders(deliveredOrders);
          const total = deliveredOrders.reduce((sum, o) => sum + o.finalAmount, 0);
          setTotalEarnings(total);
        }
      } catch (err) {
        console.error('Failed to fetch earnings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
        <FiTrendingUp className="text-green-500" /> Earnings & Payouts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
          <p className="text-green-100 font-medium mb-1">Total Lifetime Earnings</p>
          <h2 className="text-4xl font-bold font-display">₹{totalEarnings}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 font-medium mb-1">Total Orders Delivered</p>
          <h2 className="text-4xl font-bold text-gray-900 font-display flex items-center gap-2">
            {orders.length} <FiShoppingBag className="text-primary-500 opacity-20" size={32} />
          </h2>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Earning History (Delivered Orders)</h2>

      {orders.length === 0 ? (
        <EmptyState 
          icon={<FiDollarSign />}
          title="No earnings yet"
          message="Start accepting and completing orders to see your earnings here."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date Delivered</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium text-right">Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.substring(order._id.length - 6)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.userId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">+₹{order.finalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const ReviewsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Customer Reviews</h1>
      <EmptyState 
        icon={<FiStar className="text-yellow-400" />}
        title="No reviews yet"
        message="When customers rate your amazing food, you'll see their comments and ratings here."
      />
    </div>
  );
};
