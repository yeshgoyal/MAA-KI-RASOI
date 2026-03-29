import { FiClock, FiHeart, FiShoppingCart } from 'react-icons/fi';

const FoodCard = ({ food, onAddToCart, isCookView, onEdit, onDelete }) => {
  const isAvailable = food.available !== false;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md group flex flex-col ${!isAvailable ? 'opacity-70' : ''}`}>
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {food.image ? (
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            🍲
          </div>
        )}
        
        {food.dietaryType && (
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-md ${
              food.dietaryType === 'Veg' ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'
            }`}>
              {food.dietaryType}
            </span>
            {food.spiciness === 'Spicy' && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/90 text-white backdrop-blur-md">
                🌶️ Spicy
              </span>
            )}
          </div>
        )}
        
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-800 font-medium rounded-lg shadow-lg">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
            {food.name}
          </h3>
          <span className="text-lg font-bold text-secondary-600">₹{food.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{food.description || 'Delicious home-cooked meal'}</p>
        
        {food.prepTime && (
          <div className="flex items-center text-xs text-gray-400 mb-4">
            <FiClock className="mr-1" /> Prep: {food.prepTime} mins
          </div>
        )}

        <div className="pt-4 border-t border-gray-50 mt-auto">
          {isCookView ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(food)} className="flex-1 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">Edit</button>
              <button onClick={() => onDelete(food._id)} className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">Delete</button>
            </div>
          ) : (
            <button 
              onClick={() => onAddToCart(food)} 
              disabled={!isAvailable}
              className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all ${
                isAvailable 
                  ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
