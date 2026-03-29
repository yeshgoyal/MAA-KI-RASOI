import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';

const CookCard = ({ cook }) => {
  return (
    <Link to={`/cooks/${cook._id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        {cook.photo ? (
          <img 
            src={cook.photo} 
            alt={cook.userId?.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <span className="text-6xl">👩‍🍳</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {cook.trustedMaaBadge && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-primary-600 shadow-sm flex items-center gap-1">
              🏅 Trusted Maa
            </span>
          )}
          {cook.hygieneBadge && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-green-600 shadow-sm flex items-center gap-1">
              ✨ Hygiene++
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {cook.userId?.name}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <FiStar className="text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-bold text-yellow-700 text-sm">{cook.rating?.toFixed(1) || 'NEW'}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {cook.bio || 'Passionate home cook serving authentic meals made with love.'}
        </p>

        <div className="flex items-center text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
          <FiMapPin className="text-primary-400 mr-2 shrink-0" />
          <span className="truncate">{cook.location?.address || 'Location hidden'}, {cook.location?.city}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-1 flex-wrap flex-1">
            {cook.specialDishes?.slice(0, 2).map((dish, idx) => (
              <span key={idx} className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-md">
                {dish}
              </span>
            ))}
            {cook.specialDishes?.length > 2 && (
              <span className="text-xs text-gray-400 self-center">+{cook.specialDishes.length - 2} more</span>
            )}
            {(!cook.specialDishes || cook.specialDishes.length === 0) && (
              <span className="text-xs text-gray-400">Authentic Indian</span>
            )}
          </div>
          <button className="text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors ml-2 shrink-0">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CookCard;
