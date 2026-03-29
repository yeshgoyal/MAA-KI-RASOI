import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import OrderCard from '../../Components/ui/OrderCard';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import EmptyState from '../../Components/ui/EmptyState';
import toast from 'react-hot-toast';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

const IncomingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevOrderCountRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    // Poll every 20 seconds for new incoming orders
    intervalRef.current = setInterval(fetchOrders, 20000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/cook');
      const newOrders = data.orders || [];
      // Alert seller if a new order arrived since last poll
      if (prevOrderCountRef.current > 0 && newOrders.length > prevOrderCountRef.current) {
        toast('🔔 You received a new order!', { icon: '🍲' });
      }
      prevOrderCountRef.current = newOrders.length;
      setOrders(newOrders);
    } catch (err) {
      console.error('Failed to fetch outgoing orders', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      if (data.success) {
        toast.success(`Order marked as ${status}`);
        setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;

  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Incoming Orders</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiClock className="text-primary-500" /> Active Orders
        </h2>
        
        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {activeOrders.map(order => (
              <div key={order._id} className="relative group">
                <OrderCard order={order} isCookView={true} />
                <div className="absolute -top-3 -right-3 flex flex-col gap-2 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  {order.status === 'Placed' && (
                    <>
                      <button onClick={() => updateStatus(order._id, 'Accepted')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Accept Order"><FiCheck /></button>
                      <button onClick={() => updateStatus(order._id, 'Cancelled')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Reject Order"><FiX /></button>
                    </>
                  )}
                  {order.status === 'Accepted' && (
                    <button onClick={() => updateStatus(order._id, 'Assigned to Partner')} className="px-3 py-1.5 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 text-xs font-bold w-full">Assign Partner</button>
                  )}
                  {order.status === 'Assigned to Partner' && (
                    <button onClick={() => updateStatus(order._id, 'Delivered')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-xs font-bold w-full">Mark Delivered</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={<FiClock />} title="No active orders" message="You've completed all current orders. Sit back and relax!" />
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-t border-gray-200 pt-8">Completed Orders</h2>
        {pastOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
            {pastOrders.map(order => (
              <OrderCard key={order._id} order={order} isCookView={true} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No past orders to display.</p>
        )}
      </div>
    </div>
  );
};

export default IncomingOrders;
