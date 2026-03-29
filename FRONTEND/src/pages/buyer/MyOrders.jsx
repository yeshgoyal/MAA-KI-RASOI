import { useState, useEffect } from 'react';
import api from '../../api/axios';
import OrderCard from '../../Components/ui/OrderCard';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import EmptyState from '../../Components/ui/EmptyState';
import { FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = (updatedOrder) => {
      setOrders((prev) => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    };
    
    socket.on('orderStatusUpdate', handleUpdate);
    return () => {
      socket.off('orderStatusUpdate', handleUpdate);
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<FiShoppingBag />}
          title="No orders yet"
          message="You haven't placed any orders yet. Start exploring delicious home-cooked meals nearby!"
          action={
            <a href="/explore" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium inline-block hover:bg-primary-600 transition-colors">
              Explore Home Chefs
            </a>
          }
        />
      )}
    </div>
  );
};

export default MyOrders;
