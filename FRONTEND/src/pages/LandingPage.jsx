import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiShield, FiStar, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import CookCard from '../Components/ui/CookCard';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../Components/ui/LoadingSpinner';

const LandingPage = () => {
  const { isAuthenticated, isCook } = useAuth();
  const [featuredCooks, setFeaturedCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const { data } = await api.get('/cooks?limit=3');
        setFeaturedCooks(data.cooks || []);
      } catch (err) {
        console.error('Failed to load cooks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCooks();
  }, []);

  return (
    <div className="bg-[#FFF8F0] min-h-screen font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Background Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="flex-1 text-center lg:text-left relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-6 border border-primary-100">
            <FiStar className="fill-primary-600" /> Rated 4.9/5 by 10,000+ foodies
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Maa ke hath ka khana</span>
            <br />
            <span className="text-4xl lg:text-5xl text-gray-700 mt-3 block">only @ 50 rupees</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Discover passionate home cooks nearby delivering warm, authentic, and hygienic nostalgia right to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              Order Now <FiChevronRight />
            </Link>
            
            {!isAuthenticated && (
              <Link 
                to="/register?role=cook"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all flex items-center justify-center"
              >
                Become a Cook
              </Link>
            )}
          </div>
          
          {/* Quick Search */}
          <div className="mt-12 bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0 relative z-20">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for Rajma Chawal, Poha..." 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="bg-secondary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-600 transition-colors">
              Find Food
            </button>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none hidden lg:block">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
             {/* Using a placeholder aesthetic image URL instead of local for now since we haven't generated one */}
            <img 
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80" 
              alt="Delicious home cooked Indian thali" 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            
            {/* Floating review card */}
            <div className="absolute -left-6 bottom-12 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 animate-slide-up animation-delay-500 flex items-center gap-4 max-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-xl">❤️</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">"Just like how my mom makes it!"</p>
                <div className="flex text-yellow-500 text-xs mt-1">
                  <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Why choose us?</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">We're bringing back the lost art of unadulterated, wholesome home cooking to your daily life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-500 text-3xl shadow-sm mb-6">
                <FiHeart />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
              <p className="text-gray-600 leading-relaxed">Directly from the kitchens of passionate home cooks, prepared with fresh ingredients and zero preservatives.</p>
            </div>
            
            <div className="bg-secondary-50 p-8 rounded-3xl border border-secondary-100/50 hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary-500 text-3xl shadow-sm mb-6">
                <FiShield />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hygiene Verified</h3>
              <p className="text-gray-600 leading-relaxed">Every kitchen passes a strict hygiene and quality check before they can start sharing their culinary magic.</p>
            </div>
            
            <div className="bg-accent-50 p-8 rounded-3xl border border-accent-100/50 hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-accent-500 text-3xl shadow-sm mb-6">
                <span className="text-3xl">🍲</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Plans</h3>
              <p className="text-gray-600 leading-relaxed">Order one-off meals or subscribe to affordable weekly tiffin plans customized to your dietary needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cooks Section */}
      <section className="py-24 bg-[#FFF8F0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Meet our trusted Moms</h2>
              <p className="text-gray-500 text-lg max-w-xl">Support local home chefs bringing their family recipes to you.</p>
            </div>
            <Link to="/explore" className="hidden sm:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700">
              View all <FiChevronRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCooks.length > 0 ? (
                featuredCooks.map((cook) => (
                  <CookCard key={cook._id} cook={cook} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No cooks found yet. Wait for someone to join!
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/explore" className="inline-flex items-center gap-2 text-primary-600 font-bold px-6 py-3 border border-primary-200 rounded-xl">
              View all Cooks <FiChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/20 rounded-full filter blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Ready to experience the taste of home?
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl">
              Join thousands of happy customers who have found their home away from home through our platform.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link to="/register" className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all inline-block">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
