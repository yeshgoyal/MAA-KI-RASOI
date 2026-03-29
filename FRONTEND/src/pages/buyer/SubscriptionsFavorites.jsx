import EmptyState from '../../Components/ui/EmptyState';
import { FiCalendar, FiHeart } from 'react-icons/fi';

export const Subscriptions = () => {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Subscriptions</h1>
      <EmptyState 
        icon={<FiCalendar />}
        title="No active subscriptions"
        message="Subscribe to a cook's weekly tiffin plan to enjoy daily home-cooked meals without hassle."
        action={
          <a href="/explore" className="px-6 py-2 bg-primary-50 text-primary-600 rounded-xl font-medium inline-block hover:bg-primary-100 transition-colors">
            Find Tiffin Plans
          </a>
        }
      />
    </div>
  );
};

export const FavoriteCooks = () => {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Favorite Cooks</h1>
      <EmptyState 
        icon={<FiHeart className="text-red-400" />}
        title="Saved for later"
        message="You haven't added any cooks to your favorites yet. Heart your favorite moms to find them faster!"
      />
    </div>
  );
};
