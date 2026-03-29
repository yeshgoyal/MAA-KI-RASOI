import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiStar, FiClock, FiPlus, FiMinus, FiShoppingCart, FiPhone, FiCamera } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CookProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [cook, setCook] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCookAndMenu = async () => {
      try {
        setLoading(true);
        const [cookRes, menuRes] = await Promise.all([
          api.get(`/cooks/${id}`),
          api.get(`/food?cookId=${id}`)
        ]);
        setCook(cookRes.data.cook);
        setMenu(menuRes.data.items);
      } catch (err) {
        console.error('Failed to load cook profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCookAndMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <LoadingSpinner size="xl" className="text-primary-500" />
      </div>
    );
  }

  if (!cook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <h2>Cook not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen pb-24">
      {/* Header Profile Cover */}
      <div className="h-64 sm:h-80 w-full relative overflow-hidden">
        {cook.photo ? (
           <img src={cook.photo} alt={cook.userId?.name} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center">
             <span className="text-8xl">👩‍🍳</span>
           </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:px-20 text-white">
          <h1 className="text-4xl font-display font-bold mb-2">{cook.userId?.name}</h1>
          <p className="max-w-xl text-white/90 mb-4">{cook.bio}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              <span>{cook.rating?.toFixed(1) || 'New'} Rating</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <FiMapPin />
              <span>{cook.location?.address}, {cook.location?.city}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <FiClock />
              <span>~45 mins Delivery</span>
            </div>
            {cook.userId?.phone && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <FiPhone />
                <span>{cook.userId.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Kitchen Spotlight Section */}
        {cook.kitchenPhoto && (
          <div className="mb-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:-translate-y-1 transition-transform">
            <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
               <img src={cook.kitchenPhoto} alt="Our Kitchen" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-bold mb-3 border border-green-100">
                 <FiCamera className="text-green-500" /> Verified Kitchen
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900 mb-2">Straight from our home to yours.</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in complete transparency. That's why we're proud to show you exactly where your food is prepared. We maintain the highest hygiene standards because this is the same kitchen where we cook for our own family!
              </p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">Menu</h2>
        
        {menu.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No items available currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => {
              const cartItem = cart.items.find(i => i._id === item._id);
              
              return (
                <div key={item._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                      <div className="mt-2 font-bold text-primary-600">₹{item.price}</div>
                    </div>
                    <div className="mt-2">
                       {cartItem ? (
                         <div className="flex items-center gap-3 bg-primary-50 rounded-lg w-max px-2 py-1">
                           <button onClick={() => updateQuantity(item._id, cartItem.qty - 1)} className="p-1 text-primary-600 hover:bg-primary-100 rounded-md transition-colors"><FiMinus size={14} /></button>
                           <span className="font-bold w-4 text-center text-primary-700">{cartItem.qty}</span>
                           <button onClick={() => updateQuantity(item._id, cartItem.qty + 1)} className="p-1 text-primary-600 hover:bg-primary-100 rounded-md transition-colors"><FiPlus size={14} /></button>
                         </div>
                       ) : (
                         <button 
                           onClick={() => {
                             if (!isAuthenticated) {
                               toast.error('Please login to add items to your cart.');
                               navigate('/login');
                               return;
                             }
                             addToCart(item, cook._id, cook.userId?.name);
                           }}
                           disabled={!item.available}
                           className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${item.available ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                         >
                           {item.available ? 'Add' : 'Unavailable'}
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Bar if items exist */}
      {cart.items.length > 0 && cart.cookId === cook._id && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 transform transition-transform">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'} | {cart.cookName}</p>
              <h3 className="text-xl font-bold text-gray-900">Total: ₹{getCartTotal()}</h3>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <FiShoppingCart />
              <span>View Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookProfilePage;
