import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import CookCard from '../Components/ui/CookCard';
import LoadingSpinner from '../Components/ui/LoadingSpinner';
import EmptyState from '../Components/ui/EmptyState';

const ExplorePage = () => {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState(''); // Lunch, Dinner, etc.

  useEffect(() => {
    fetchCooks();
  }, [filterCity, filterType]);

  const fetchCooks = async () => {
    try {
      setLoading(true);
      let query = '/cooks?limit=20';
      if (filterCity) query += `&city=${filterCity}`;
      if (filterType) query += `&mealType=${filterType}`;
      
      const { data } = await api.get(query);
      setCooks(data.cooks || []);
    } catch (err) {
      console.error('Error fetching cooks', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCooks = cooks.filter((cook) => {
    if (!search) return true;
    const nameMatch = cook.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const dishMatch = cook.specialDishes?.some(dish => dish.toLowerCase().includes(search.toLowerCase()));
    return nameMatch || dishMatch;
  });

  return (
    <div className="bg-[#FFF8F0] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Explore Home Chefs</h1>
          <p className="text-gray-600">Find the perfect home-cooked meal nearby, made with love and fresh ingredients.</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10 sticky top-[88px] z-30">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or dish..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select 
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="appearance-none w-full md:w-48 pl-4 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-gray-700"
              >
                <option value="">All Cities</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
              <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none w-full md:w-48 pl-4 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-gray-700"
              >
                <option value="">Any Meal</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Tiffin">Weekly Tiffin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" className="text-primary-500" />
          </div>
        ) : filteredCooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCooks.map((cook) => (
              <CookCard key={cook._id} cook={cook} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Chefs Found" 
            message={`We couldn't find any home chefs matching your search criteria. Try removing some filters.`}
            action={
              <button 
                onClick={() => { setSearch(''); setFilterCity(''); setFilterType(''); }}
                className="px-6 py-2 bg-primary-50 text-primary-600 rounded-xl font-medium"
              >
                Clear all filters
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
