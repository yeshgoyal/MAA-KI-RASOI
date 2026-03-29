import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../Components/ui/StatusBadge';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { FiArrowLeft, FiMapPin, FiClock, FiPhone, FiInfo, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const isSeller = location.pathname.includes('/seller');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to load order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    try {
      setSubmittingReview(true);
      const { data } = await api.post('/reviews', {
        cookId: order.cookId?._id,
        orderId: order._id,
        rating,
        title: reviewTitle,
        text: reviewText
      });
      if (data.success) {
        toast.success('Thank you for rating your meal! 🌟');
        setOrder({ ...order, isRated: true });
        setShowReviewForm(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={isSeller ? "/seller/orders" : "/buyer/orders"} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors hover:-translate-x-1 transform duration-200">
        <FiArrowLeft className="mr-2" /> Back to Orders
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Order #{order._id.substring(order._id.length - 8)}</h1>
            <p className="text-sm text-gray-500 flex items-center"><FiClock className="mr-1" /> {orderDate}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-8 p-4 bg-primary-50 rounded-xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-primary-100 overflow-hidden">
              {isSeller ? (
                 order.userId?.avatar ? <img src={order.userId.avatar} alt="Buyer" className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>
              ) : (
                 order.cookId?.userId?.avatar ? <img src={order.cookId.userId.avatar} alt="Cook" className="w-full h-full object-cover" /> : <span className="text-2xl">👩‍🍳</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{isSeller ? order.userId?.name : order.cookId?.userId?.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <FiPhone className="text-primary-400" /> {isSeller ? order.userId?.phone : order.cookId?.userId?.phone || 'Phone hidden'}
              </p>
            </div>
            {!isSeller && (
              <div className="text-right">
                <Link to={`/cooks/${order.cookId?._id}`} className="text-sm font-medium text-primary-600">View Menu</Link>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-4 mb-8">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🍲</div>}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                  </div>
                </div>
                <div className="font-bold text-gray-700">₹{item.price * item.qty}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 mb-8 max-w-sm ml-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-dashed">
              <span>Total</span>
              <span className="text-primary-600">₹{order.finalAmount}</span>
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">Paid via {order.paymentMethod}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2"><FiMapPin className="text-secondary-500" /> Delivery To</h4>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
            </p>
            
            {order.specialInstructions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-1"><FiInfo className="text-blue-500" /> Instructions</h4>
                <p className="text-sm text-gray-600 italic bg-white p-3 rounded-lg border border-gray-100">{order.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Review Section */}
          {!isSeller && order.status === 'Delivered' && !order.isRated && !showReviewForm && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">How was your meal?</h3>
                <p className="text-gray-600 mb-4">Your feedback helps {order.cookId?.userId?.name} and other foodies!</p>
                <button onClick={() => setShowReviewForm(true)} className="bg-primary-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
                  Rate this Order
                </button>
              </div>
            </div>
          )}

          {!isSeller && showReviewForm && (
            <div className="mt-8 border-t border-gray-100 pt-6 animate-slide-up">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Meal 🌟</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                          <FiStar size={32} className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} required placeholder="e.g. Delicious and homely!" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required placeholder="What did you love about it?" className="w-full border border-gray-200 rounded-lg px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 flex-1 transition-colors">Cancel</button>
                    <button type="submit" disabled={submittingReview} className="px-6 py-2.5 rounded-xl bg-primary-500 font-medium text-white hover:bg-primary-600 flex-1 disabled:opacity-50 transition-colors shadow-md">Submit Review</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {!isSeller && order.status === 'Delivered' && order.isRated && (
             <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center font-medium border border-green-100 shadow-sm">
                  <FiStar className="fill-green-700 mr-2" /> You've rated this order. Thank you!
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
