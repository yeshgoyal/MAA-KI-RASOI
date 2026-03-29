import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { loadRazorpay } from '../utils/loadRazorpay';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deliveryFee = cart.items.length > 0 ? 20 : 0;
  const totalAmount = getCartTotal();
  const finalAmount = totalAmount + deliveryFee;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place your order.');
      navigate('/login?redirect=/cart');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      setLoading(true);
      const { data: orderData } = await api.post('/orders/razorpay/create', { amount: finalAmount });
      
      if (orderData.isMock) {
        toast.success('Testing Mode: Bypassing Razorpay Checkout...');
        const verifyRes = await api.post('/orders/razorpay/verify', {
          razorpayOrderId: orderData.order.id,
          razorpayPaymentId: 'pay_mock_' + Date.now(),
          razorpaySignature: 'mock_signature',
          orderData: {
            cookId: cart.cookId,
            items: cart.items.map(i => ({ foodItemId: i._id, qty: i.qty })),
            deliveryAddress: {
              street: user?.address?.street || '123 Home St',
              city: user?.address?.city || 'Delhi',
              state: 'Delhi',
              pincode: '110001'
            },
            deliveryType: 'Delivery',
            paymentMethod: 'Card',
            specialInstructions: ''
          }
        });

        if (verifyRes.data.success) {
          toast.success('Test Order placed successfully! 🍲');
          clearCart();
          navigate(`/buyer/orders/${verifyRes.data.order._id}`);
        } else {
          toast.error('Payment verification failed.');
        }
        return;
      }
      
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'MaaKeHaathKaKhana',
        description: 'Payment for your home-cooked meal',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/orders/razorpay/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderData: {
                cookId: cart.cookId,
                items: cart.items.map(i => ({ foodItemId: i._id, qty: i.qty })),
                deliveryAddress: {
                  street: user?.address?.street || '123 Fake St',
                  city: user?.address?.city || 'Delhi',
                  state: 'Delhi',
                  pincode: '110001'
                },
                deliveryType: 'Delivery',
                paymentMethod: 'Card',
                specialInstructions: ''
              }
            });

            if (verifyRes.data.success) {
              toast.success('Order placed successfully! 🍲');
              clearCart();
              navigate(`/buyer/orders/${verifyRes.data.order._id}`);
            }
          } catch (err) {
            toast.error('Payment verification failed.');
            console.error(err);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#E85D26'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing checkout');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen py-16 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold font-display text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any delicious home-cooked meals yet.</p>
        <button onClick={() => navigate('/explore')} className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-primary-500/30">
          Explore Chefs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600 font-medium mb-6 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Menu
        </button>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Ordering from</p>
              <h3 className="text-lg font-bold text-gray-900">{cart.cookName}</h3>
            </div>
          </div>
          
          <div className="space-y-6">
            {cart.items.map(item => (
              <div key={item._id} className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🍲</div>}
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-gray-900">{item.name}</h4>
                   <p className="text-primary-600 font-medium">₹{item.price}</p>
                 </div>
                 <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => updateQuantity(item._id, item.qty - 1)} className="p-1 hover:bg-white rounded-md text-gray-600 shadow-sm"><FiMinus size={14} /></button>
                    <span className="font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQuantity(item._id, item.qty + 1)} className="p-1 hover:bg-white rounded-md text-gray-600 shadow-sm"><FiPlus size={14} /></button>
                 </div>
                 <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-2">
                   <FiTrash2 size={18} />
                 </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-medium text-gray-900">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">₹{deliveryFee}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 mt-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
                <span>To Pay</span>
                <span className="text-primary-600">₹{finalAmount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end">
             <button 
               onClick={handleCheckout} 
               disabled={loading}
               className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary-500/30 transition-all ${loading ? 'bg-primary-400 cursor-wait' : 'bg-primary-500 hover:bg-primary-600 hover:-translate-y-1'}`}
             >
               {loading ? 'Processing...' : `Proceed to Pay ₹${finalAmount}`}
             </button>
             {!isAuthenticated && (
               <p className="text-xs text-center text-gray-500 mt-3 flex justify-center gap-1">
                 You will be asked to <strong className="text-primary-600">login</strong> before payment
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
