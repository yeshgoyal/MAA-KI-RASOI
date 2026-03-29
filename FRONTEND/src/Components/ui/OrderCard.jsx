import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi';

const OrderCard = ({ order, isCookView = false }) => {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Order #{order._id.substring(order._id.length - 6)}</p>
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <FiClock className="mr-1" /> {date}
          </div>
          <h4 className="font-bold text-gray-900">
            {isCookView ? order.userId?.name : order.cookId?.userId?.name}
          </h4>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <StatusBadge status={order.status} />
          </div>
          <p className="font-bold text-lg text-primary-600">₹{order.finalAmount}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-700"><span className="text-gray-400 mr-2">{item.qty}x</span> {item.name}</span>
            <span className="text-gray-500">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {isCookView && (
        <div className="flex items-center text-xs text-secondary-600 bg-secondary-50 p-2 rounded-lg mb-4">
          <FiMapPin className="mr-1 shrink-0" />
          <span className="truncate">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
        </div>
      )}

      <div className="pt-4 mt-auto">
        <Link 
          to={`/${isCookView ? 'seller' : 'buyer'}/orders/${order._id}`}
          className="w-full flex items-center justify-center text-sm font-medium text-primary-600 bg-primary-50 py-2.5 rounded-xl hover:bg-primary-100 transition-colors"
        >
          View Details <FiChevronRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
